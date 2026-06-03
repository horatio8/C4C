// Zero-dep GitHub Contents API client for CMS persistence.
// Reads + writes JSON files (and binary files) in the configured repo + branch.
// Each write creates a single commit; Vercel auto-redeploys on push.

function cfg() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const token = process.env.GITHUB_TOKEN;
  if (!owner || !repo || !token) {
    const err = new Error('GitHub backend not configured (need GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN).');
    err.code = 'CONFIG';
    throw err;
  }
  return { owner, repo, branch, token };
}

function authHeaders() {
  const { token } = cfg();
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'C4C-CMS/1.0',
  };
}

// Returns { content: <decoded utf8 string | Buffer>, sha: string } or null if 404.
async function getFile(path, { binary = false } = {}) {
  const { owner, repo, branch } = cfg();
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}?ref=${encodeURIComponent(branch)}`;
  const r = await fetch(url, { headers: authHeaders() });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub getFile ${path}: ${r.status} ${await r.text()}`);
  const j = await r.json();
  const buf = Buffer.from(j.content || '', j.encoding || 'base64');
  return { content: binary ? buf : buf.toString('utf8'), sha: j.sha };
}

// Writes a file (creates or updates). content can be string or Buffer.
async function putFile(path, content, message, { sha, branch } = {}) {
  const { owner, repo, branch: defaultBranch } = cfg();
  const useBranch = branch || defaultBranch;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}`;
  const body = {
    message: message || `cms: update ${path}`,
    content: Buffer.isBuffer(content) ? content.toString('base64') : Buffer.from(content, 'utf8').toString('base64'),
    branch: useBranch,
  };
  if (sha) body.sha = sha;
  const r = await fetch(url, { method: 'PUT', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) {
    const text = await r.text();
    // 409 = sha conflict (someone else updated). Surface so caller can retry once.
    const err = new Error(`GitHub putFile ${path}: ${r.status} ${text}`);
    err.status = r.status;
    throw err;
  }
  return await r.json();
}

// Convenience: read a JSON file (returns parsed + sha).
async function getJson(path) {
  const f = await getFile(path);
  if (!f) return { data: null, sha: null };
  try { return { data: JSON.parse(f.content), sha: f.sha }; }
  catch (e) { throw new Error(`getJson ${path}: invalid JSON — ${e.message}`); }
}

// Convenience: write JSON file with retry on sha conflict.
async function putJson(path, data, message) {
  const json = JSON.stringify(data, null, 2) + '\n';
  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const current = await getJson(path);
      return await putFile(path, json, message, { sha: current.sha });
    } catch (e) {
      if (e.status === 409 && attempts < 3) continue; // retry
      throw e;
    }
  }
}

module.exports = { cfg, getFile, putFile, getJson, putJson };
