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

function Field({ value, onChange, parentKey, hideLabel }) {
  if (value === null || value === undefined) {
    return <input type="text" value="" onChange={e => onChange(e.target.value)} />;
  }
  if (typeof value === 'string') {
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
    return Object.keys(content);
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

  const sectionContent = content[active];
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
