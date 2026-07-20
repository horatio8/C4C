const { useState, useEffect, useMemo, useCallback } = React;

function prettifyKey(k) {
  if (typeof k !== 'string') return String(k);
  return k
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, c => c.toUpperCase())
    .trim();
}

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

function emptyLike(template) {
  if (typeof template === 'string') return '';
  if (typeof template === 'number') return 0;
  if (typeof template === 'boolean') return false;
  if (Array.isArray(template)) {
    return template.length ? [emptyLike(template[0])] : [];
  }
  if (isPlainObject(template)) {
    const out = {};
    for (const k of Object.keys(template)) out[k] = emptyLike(template[k]);
    return out;
  }
  return null;
}

function StringField({ value, onChange }) {
  const long = typeof value === 'string' && (value.length > 80 || value.includes('\n'));
  if (long) {
    return <textarea value={value} onChange={e => onChange(e.target.value)} rows={Math.min(12, Math.max(3, Math.ceil(value.length / 80)))} />;
  }
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} />;
}

function NumberField({ value, onChange }) {
  return <input type="number" value={value} onChange={e => onChange(e.target.value === '' ? 0 : Number(e.target.value))} />;
}

function BooleanField({ value, onChange }) {
  return (
    <label className="checkbox-row">
      <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} />
      <span>{value ? 'On' : 'Off'}</span>
    </label>
  );
}

function ArrayField({ value, onChange, label }) {
  const items = Array.isArray(value) ? value : [];
  const sample = items[0];

  const addItem = () => {
    const next = sample !== undefined ? emptyLike(sample) : '';
    onChange([...items, next]);
  };
  const removeAt = (i) => onChange(items.filter((_, j) => j !== i));
  const moveAt = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = items.slice();
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  const updateAt = (i, v) => {
    const copy = items.slice();
    copy[i] = v;
    onChange(copy);
  };

  // Tuple of two strings (e.g. ["$1,840", "Average household electricity bill, NSW · 2025"])
  const isTuple = sample !== undefined && Array.isArray(sample) && sample.every(x => typeof x === 'string');

  return (
    <div>
      {items.length === 0 && (
        <div className="help" style={{ marginBottom: 8 }}>Empty list. Add an item to get started.</div>
      )}
      {items.map((item, i) => (
        <div key={i} className="list-item">
          <div className="list-item-header">
            <span>{label} #{i + 1}</span>
            <div className="list-item-actions">
              <button type="button" className="btn small secondary" onClick={() => moveAt(i, -1)} disabled={i === 0}>↑</button>
              <button type="button" className="btn small secondary" onClick={() => moveAt(i, 1)} disabled={i === items.length - 1}>↓</button>
              <button type="button" className="btn small danger" onClick={() => removeAt(i)}>Remove</button>
            </div>
          </div>
          {isTuple ? (
            <TupleEditor value={item} onChange={(v) => updateAt(i, v)} />
          ) : (
            <Field value={item} onChange={(v) => updateAt(i, v)} hideLabel />
          )}
        </div>
      ))}
      <div className="toolbar-add">
        <button type="button" className="btn secondary small" onClick={addItem}>+ Add {label.toLowerCase()}</button>
      </div>
    </div>
  );
}

function TupleEditor({ value, onChange }) {
  const update = (i, v) => {
    const copy = value.slice();
    copy[i] = v;
    onChange(copy);
  };
  return (
    <div>
      {value.map((v, i) => (
        <div key={i} className="field">
          <label className="field-label">Position {i + 1}</label>
          <StringField value={v} onChange={(nv) => update(i, nv)} />
        </div>
      ))}
    </div>
  );
}

function ObjectField({ value, onChange }) {
  const update = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div>
      {Object.entries(value).map(([k, v]) => (
        <div key={k} className="field">
          <label className="field-label">{prettifyKey(k)}</label>
          <Field value={v} onChange={(nv) => update(k, nv)} parentKey={k} />
        </div>
      ))}
    </div>
  );
}

const IMAGE_KEY_RE = /(photoUrl|logoUrl|imageUrl|iconUrl|founderPhotoUrl|ogImage|featuredImage)$/i;

function isImageKey(k) { return typeof k === 'string' && IMAGE_KEY_RE.test(k); }

function ImageField({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const onFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setBusy(true); setErr('');
    try {
      const buf = await file.arrayBuffer();
      // base64 from bytes (chunked to avoid call-stack issues on large files)
      const bytes = new Uint8Array(buf);
      let bin = '';
      const CHUNK = 0x8000;
      for (let i = 0; i < bytes.length; i += CHUNK) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
      const b64 = btoa(bin);
      const r = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentBase64: b64 }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(j.error || `Upload failed (${r.status})`); return; }
      onChange(j.url);
    } catch (ex) {
      setErr(String(ex && ex.message || ex));
    } finally {
      setBusy(false);
      if (e.target) e.target.value = '';
    }
  };
  return (
    <div className="image-field">
      <div className="image-row">
        {value
          ? <img className="image-preview" src={value} alt="" />
          : <div className="image-preview image-preview-empty">no image</div>}
        <div className="image-controls">
          <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="/assets/imported/… or https://…" />
          <div className="image-actions">
            <label className="btn btn-sm">
              {busy ? 'Uploading…' : 'Upload…'}
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" onChange={onFile} disabled={busy} style={{ display: 'none' }} />
            </label>
            {value && <button type="button" className="btn btn-sm btn-ghost" onClick={() => onChange('')}>Clear</button>}
          </div>
          {err && <div className="err">{err}</div>}
        </div>
      </div>
    </div>
  );
}

function Field({ value, onChange, parentKey, hideLabel }) {
  if (value === null || value === undefined) {
    if (isImageKey(parentKey)) return <ImageField value="" onChange={onChange} />;
    return <input type="text" value="" onChange={e => onChange(e.target.value)} />;
  }
  if (typeof value === 'string') {
    if (isImageKey(parentKey)) return <ImageField value={value} onChange={onChange} />;
    return <StringField value={value} onChange={onChange} />;
  }
  if (typeof value === 'number') {
    return <NumberField value={value} onChange={onChange} />;
  }
  if (typeof value === 'boolean') {
    return <BooleanField value={value} onChange={onChange} />;
  }
  if (Array.isArray(value)) {
    return <ArrayField value={value} onChange={onChange} label={parentKey ? prettifyKey(singularize(parentKey)) : 'Item'} />;
  }
  if (isPlainObject(value)) {
    return (
      <div className="group">
        <ObjectField value={value} onChange={onChange} />
      </div>
    );
  }
  return <div className="help">Unsupported value: {String(value)}</div>;
}

function singularize(word) {
  if (typeof word !== 'string') return 'Item';
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('s')) return word.slice(0, -1);
  return word;
}

function Login({ onSuccess }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setErr(j.error || 'Login failed');
        return;
      }
      onSuccess();
    } catch (e) {
      setErr('Network error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <h1>C4C admin</h1>
        <p>Sign in to edit site content.</p>
        {err && <div className="err">{err}</div>}
        <div className="field">
          <label>Password</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} autoFocus required />
        </div>
        <button type="submit" className="btn" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}

const SECTION_LABELS = {
  media: 'Media & Webinars',
  site: 'Site',
  nav: 'Navigation',
  footer: 'Footer',
  home: 'Home page',
  about: 'About page',
  work: 'What we do',
  issues: 'Issue pages',
  aea: 'AEA campaign',
  news: 'News',
  donate: 'Donate',
  contact: 'Contact',
};

const MEDIA_TYPES = ['News', 'Op-ed', 'Media Release', 'Statement', 'Submission', 'Webinar', 'Video', 'Podcast', 'Report', 'Event', 'Other'];
const MEDIA_TAGS = ['Energy', 'Agriculture', 'Biodiversity', 'Other'];

function slugify(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

function formatDateAU(isoOrDate) {
  if (!isoOrDate) return '';
  const d = new Date(isoOrDate);
  if (isNaN(d)) return isoOrDate;
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Accept a full YouTube URL or a bare 11-char ID; store just the ID.
function ytId(s) {
  if (!s) return '';
  const m = String(s).match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : String(s).trim();
}

function MediaItemForm({ value, onSave, onCancel }) {
  const [item, setItem] = useState(value);
  const update = (k, v) => setItem(prev => ({ ...prev, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const copy = { ...item };
    if (!copy.id) copy.id = slugify(copy.title);
    if (copy.iso_date && (!copy.date || copy.date === '')) copy.date = formatDateAU(copy.iso_date);
    onSave(copy);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-header">
          <h3>{item._new ? 'New media item' : 'Edit media item'}</h3>
          <button type="button" className="btn small secondary" onClick={onCancel}>Cancel</button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label className="field-label">Title</label>
            <input type="text" value={item.title || ''} onChange={e => update('title', e.target.value)} required autoFocus />
          </div>
          <div className="form-row">
            <div className="field">
              <label className="field-label">Date (display)</label>
              <input type="text" value={item.date || ''} onChange={e => update('date', e.target.value)} placeholder="11 MAY 2026" />
              <div className="help">DD MMM YYYY — auto-fills from ISO date if blank.</div>
            </div>
            <div className="field">
              <label className="field-label">ISO date</label>
              <input type="date" value={(item.iso_date || '').slice(0, 10)} onChange={e => update('iso_date', e.target.value)} />
              <div className="help">Sorts newest first.</div>
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label className="field-label">Type</label>
              <select value={item.type || 'News'} onChange={e => update('type', e.target.value)}>
                {MEDIA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Topic</label>
              <select value={item.tag || 'Other'} onChange={e => update('tag', e.target.value)}>
                {MEDIA_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label className="field-label">URL (links to article on click)</label>
            <input type="url" value={item.url || ''} onChange={e => update('url', e.target.value)} placeholder="https://…" />
          </div>
          <div className="field">
            <label className="field-label">Hero image</label>
            <ImageField value={item.imageUrl || ''} onChange={v => update('imageUrl', v)} />
          </div>
          <div className="form-row">
            <div className="field">
              <label className="field-label">YouTube video (link or ID)</label>
              <input type="text" value={item.youtubeId || ''} onChange={e => update('youtubeId', ytId(e.target.value))} placeholder="https://youtu.be/… or 11-char ID" />
              <div className="help">Video/Webinar posts: embeds the player on the story page and uses the video thumbnail as the hero when no image is set.</div>
            </div>
            <div className="field">
              <label className="field-label">Image focus (optional)</label>
              <input type="text" value={item.imagePosition || ''} onChange={e => update('imagePosition', e.target.value)} placeholder="center 30%" />
              <div className="help">CSS object-position for the card crop, e.g. "center 30%" to lower a face into frame.</div>
            </div>
          </div>
          <div className="field">
            <label className="field-label">Excerpt</label>
            <textarea value={item.excerpt || ''} onChange={e => update('excerpt', e.target.value)} rows={3} />
          </div>
          <div className="field">
            <label className="field-label">Body</label>
            <textarea value={item.body || ''} onChange={e => update('body', e.target.value)} rows={10} />
          </div>
          <div className="field">
            <label className="field-label">ID / slug</label>
            <input type="text" value={item.id || ''} onChange={e => update('id', e.target.value)} placeholder="auto from title" />
            <div className="help">Used as a stable identifier. Leave blank to auto-generate.</div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn">Apply</button>
        </div>
      </form>
    </div>
  );
}

function MediaCRM({ onUnauthorized }) {
  const [items, setItems] = useState(null);
  const [original, setOriginal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(0);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');

  useEffect(() => {
    fetch('/api/media').then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(j => {
      setItems(Array.isArray(j) ? j : []);
      setOriginal(JSON.stringify(j));
    }).catch(e => setError('Failed to load media: ' + e.message));
  }, []);

  const dirty = items && original && JSON.stringify(items) !== original;

  async function save() {
    if (!items || saving) return;
    setSaving(true);
    setError('');
    try {
      const r = await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });
      if (r.status === 401) { onUnauthorized && onUnauthorized(); return; }
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setError(j.error || ('Save failed: HTTP ' + r.status));
        return;
      }
      setOriginal(JSON.stringify(items));
      setSavedAt(Date.now());
    } catch (e) {
      setError('Network error: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  function revert() {
    if (!original) return;
    if (!dirty || confirm('Discard unsaved changes?')) {
      setItems(JSON.parse(original));
    }
  }

  function addNew() {
    setEditing({
      _new: true,
      id: '',
      title: '',
      date: formatDateAU(new Date()),
      iso_date: new Date().toISOString().slice(0, 10),
      type: 'News',
      tag: 'Energy',
      excerpt: '',
      body: '',
      url: '',
      imageUrl: '',
    });
  }

  function startEdit(idx) {
    setEditing({ _idx: idx, ...items[idx] });
  }

  function applyEdit(updated) {
    if (updated._new) {
      const { _new, ...item } = updated;
      setItems([item, ...items]);
    } else {
      const { _idx, ...item } = updated;
      setItems(items.map((it, i) => i === _idx ? item : it));
    }
    setEditing(null);
  }

  function removeAt(idx) {
    if (!confirm(`Delete "${items[idx].title}"?`)) return;
    setItems(items.filter((_, i) => i !== idx));
  }

  // Save shortcut + beforeunload guard
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); if (dirty) save(); }
    };
    const onBeforeUnload = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('keydown', onKey);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('beforeunload', onBeforeUnload); };
  }, [dirty, items]);

  if (!items && !error) return <div style={{ padding: 40, color: '#6a6a6a' }}>Loading media catalogue…</div>;
  if (error && !items) return <div className="err" style={{ background: '#fde8e8', color: '#9a1f1f', padding: 14, borderRadius: 6 }}>{error}</div>;

  const types = Array.from(new Set(items.map(i => i.type).filter(Boolean))).sort();
  const tags = Array.from(new Set(items.map(i => i.tag).filter(Boolean))).sort();

  const ql = q.trim().toLowerCase();
  const filteredIdx = items
    .map((it, i) => i)
    .filter(i => {
      const it = items[i];
      if (typeFilter !== 'All' && it.type !== typeFilter) return false;
      if (tagFilter !== 'All' && it.tag !== tagFilter) return false;
      if (ql && !(
        (it.title || '').toLowerCase().includes(ql) ||
        (it.excerpt || '').toLowerCase().includes(ql) ||
        (it.url || '').toLowerCase().includes(ql)
      )) return false;
      return true;
    });

  let statusEl = null;
  if (saving) statusEl = <span className="status">Saving…</span>;
  else if (dirty) statusEl = <span className="status dirty">Unsaved changes</span>;
  else if (savedAt) statusEl = <span className="status saved">Saved</span>;

  return (
    <React.Fragment>
      <div className="topbar">
        <h2>Media & Webinars · <span style={{ color: '#6a6a6a', fontWeight: 400 }}>{items.length} items</span></h2>
        <div className="actions">
          {statusEl}
          <button className="btn secondary" onClick={revert} disabled={!dirty}>Revert</button>
          <button className="btn" onClick={save} disabled={!dirty || saving}>{saving ? 'Saving…' : 'Save all'}</button>
        </div>
      </div>

      <div className="content">
        {error && <div className="err" style={{ background: '#fde8e8', color: '#9a1f1f', padding: 10, borderRadius: 6, marginBottom: 16 }}>{error}</div>}

        <div className="crm-toolbar">
          <button className="btn" onClick={addNew}>+ New item</button>
          <input type="search" className="crm-search" placeholder="Search title, excerpt, URL…" value={q} onChange={e => setQ(e.target.value)} />
          <select className="crm-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="All">All types ({items.length})</option>
            {types.map(t => <option key={t} value={t}>{t} ({items.filter(i => i.type === t).length})</option>)}
          </select>
          <select className="crm-select" value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
            <option value="All">All topics ({items.length})</option>
            {tags.map(t => <option key={t} value={t}>{t} ({items.filter(i => i.tag === t).length})</option>)}
          </select>
          <span className="crm-count">{filteredIdx.length} match{filteredIdx.length === 1 ? '' : 'es'}</span>
        </div>

        {filteredIdx.length === 0 ? (
          <div style={{ padding: '48px 0', color: '#6a6a6a' }}>No items match. Adjust filters or add a new item.</div>
        ) : (
          <table className="crm-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Title</th>
                <th style={{ width: 110 }}>Date</th>
                <th style={{ width: 120 }}>Type</th>
                <th style={{ width: 100 }}>Topic</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIdx.map(i => {
                const it = items[i];
                return (
                  <tr key={it.id || i}>
                    <td>
                      <div className="crm-title">{it.title || <em>(untitled)</em>}</div>
                      {it.excerpt && <div className="crm-excerpt">{it.excerpt.length > 140 ? it.excerpt.slice(0, 140) + '…' : it.excerpt}</div>}
                    </td>
                    <td className="crm-mono">{it.date || ''}</td>
                    <td>{it.type ? <span className="crm-pill">{it.type}</span> : ''}</td>
                    <td>{it.tag ? <span className="crm-pill crm-pill-tag">{it.tag}</span> : ''}</td>
                    <td>
                      <button className="btn small secondary" onClick={() => startEdit(i)}>Edit</button>
                      <button className="btn small danger" onClick={() => removeAt(i)} style={{ marginLeft: 6 }}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {editing && <MediaItemForm value={editing} onSave={applyEdit} onCancel={() => setEditing(null)} />}
    </React.Fragment>
  );
}

function Admin({ onLogout }) {
  const [content, setContent] = useState(null);
  const [original, setOriginal] = useState(null);
  const [active, setActive] = useState('site');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(j => {
      setContent(j);
      setOriginal(JSON.stringify(j));
    }).catch(e => setError('Failed to load content: ' + e.message));
  }, []);

  const dirty = content && original && JSON.stringify(content) !== original;

  const sections = useMemo(() => {
    if (!content) return [];
    // Media is its own CRM, not a generic section of content.json — but
    // surface it in the sidebar so it sits with the other editable areas.
    return ['media', ...Object.keys(content)];
  }, [content]);

  const save = async () => {
    if (!content || saving) return;
    setSaving(true);
    setError('');
    try {
      const r = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (r.status === 401) { onLogout(); return; }
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setError(j.error || 'Save failed');
        return;
      }
      setOriginal(JSON.stringify(content));
      setSavedAt(Date.now());
    } catch (e) {
      setError('Network error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const revert = () => {
    if (!original) return;
    if (!dirty || confirm('Discard unsaved changes?')) {
      setContent(JSON.parse(original));
    }
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    onLogout();
  };

  // Save shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (dirty) save();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dirty, content]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  if (!content) {
    return <div style={{ padding: 40, color: '#6a6a6a' }}>{error || 'Loading…'}</div>;
  }

  const sectionContent = active === 'media' ? null : content[active];
  const updateSection = (v) => setContent({ ...content, [active]: v });

  let statusEl = null;
  if (saving) statusEl = <span className="status">Saving…</span>;
  else if (dirty) statusEl = <span className="status dirty">Unsaved changes</span>;
  else if (savedAt) statusEl = <span className="status saved">Saved</span>;

  return (
    <div className="shell">
      <aside className="sidebar">
        <h1>C4C admin</h1>
        <nav>
          {sections.map(k => (
            <button
              key={k}
              className={active === k ? 'active' : ''}
              onClick={() => setActive(k)}
            >
              {SECTION_LABELS[k] || prettifyKey(k)}
            </button>
          ))}
        </nav>
        <div className="footer-actions">
          <a href="/" target="_blank" rel="noopener">View site ↗</a>
          <button onClick={logout}>Log out</button>
        </div>
      </aside>

      <div className="main">
        {active === 'media' ? (
          <MediaCRM onUnauthorized={onLogout} />
        ) : (
          <React.Fragment>
            <div className="topbar">
              <h2>{SECTION_LABELS[active] || prettifyKey(active)}</h2>
              <div className="actions">
                {statusEl}
                <button className="btn secondary" onClick={revert} disabled={!dirty}>Revert</button>
                <button className="btn" onClick={save} disabled={!dirty || saving}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>

            <div className="content">
              {error && <div className="err" style={{ background: '#fde8e8', color: '#9a1f1f', padding: '10px 12px', borderRadius: 6, marginBottom: 16 }}>{error}</div>}
              {isPlainObject(sectionContent) ? (
                <ObjectField value={sectionContent} onChange={updateSection} />
              ) : (
                <Field value={sectionContent} onChange={updateSection} parentKey={active} />
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

function Root() {
  const [authed, setAuthed] = useState(null);

  useEffect(() => {
    fetch('/api/session').then(r => r.json()).then(j => setAuthed(!!j.admin));
  }, []);

  if (authed === null) return <div style={{ padding: 40, color: '#6a6a6a' }}>Loading…</div>;
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  return <Admin onLogout={() => setAuthed(false)} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
