// Coalition for Conservation — components (CMS-driven)
// Content reads from window.CONTENT (loaded via /content.js).

const { useState, useEffect, useRef, useMemo } = React;
const C = () => window.CONTENT;

function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#2f5a3a" />
      <circle cx="32" cy="32" r="30" stroke="#4f7d5a" strokeWidth="0.6" fill="none" opacity="0.6" />
      <path d="M46 20 C 38 14, 22 16, 18 28 C 14 40, 24 50, 36 48 C 42 47, 46 44, 48 40"
        stroke="#ecebe2" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M40 24 C 44 22, 50 22, 52 26 C 49 32, 44 33, 40 30 Z"
        fill="#c08a3e" opacity="0.95" />
      <path d="M40 24 C 44 26, 48 28, 52 26" stroke="#2f5a3a" strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}

function Wordmark({ dark }) {
  const s = C().site;
  const c = 'var(--bone)';
  const sub = 'rgba(236,235,226,0.6)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {s.iconUrl
        ? <img src={s.iconUrl} alt="" aria-hidden="true" style={{ height: 42, width: 'auto', display: 'block', flexShrink: 0 }} />
        : <Logo size={44} />}
      <div className="wordmark-text" style={{ lineHeight: 1 }}>
        <div className="display" style={{ fontSize: 22, color: c, letterSpacing: '-0.02em', fontWeight: 400, whiteSpace: 'nowrap' }}>
          {s.wordmarkLine1Pre}<span className="italic" style={{ fontFamily: 'var(--display)' }}>{s.wordmarkLine1Italic}</span>{s.wordmarkLine1Post}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: sub, marginTop: 6, whiteSpace: 'nowrap' }}>
          {s.wordmarkLine2}
        </div>
      </div>
    </div>
  );
}

function pageIdForPath(path) {
  const map = { '/': 'home', '/about': 'about', '/work': 'work', '/campaigns': 'aea', '/news': 'news', '/donate': 'donate', '/contact': 'contact' };
  if (map[path]) return map[path];
  const m = path && path.match(/^\/issues\/([a-z-]+)$/);
  if (m) return 'issue:' + m[1];
  return null;
}

// External vs internal: pass setPage if you want internal nav.
function followLink(setPage, target, e) {
  if (!target) { e && e.preventDefault(); return; }
  if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:') || target.startsWith('tel:')) {
    return; // browser handles
  }
  const id = pageIdForPath(target);
  if (id) {
    e && e.preventDefault();
    setPage && setPage(id);
  }
}

function Nav({ page, setPage }) {
  const n = C().nav;
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const go = (id) => { close(); setPage(id); };

  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-inner">
        <a className="brand" href="/" onClick={(e) => { e.preventDefault(); go('home'); }} aria-label="Coalition for Conservation — home">
          <Wordmark />
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-drawer"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(o => !o)}
        >
          <span className="bar" aria-hidden="true" />
        </button>
        <div className="nav-links">
          {n.links.map(it => (
            <a
              key={it.id}
              href={it.path || '#'}
              className={`nav-link ${page === it.id ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); go(it.id); }}
            >
              {it.label}
            </a>
          ))}
          <a
            href={n.ctaPath || '/donate'}
            onClick={(e) => { e.preventDefault(); go('donate'); }}
          >
            <button type="button" className="nav-cta">
              {n.ctaLabel} <span aria-hidden="true" style={{ fontSize: 14 }}>↗</span>
            </button>
          </a>
        </div>
      </div>
      <div id="primary-drawer" className={`nav-drawer ${open ? 'open' : ''}`} hidden={!open}>
        {n.links.map(it => (
          <a key={it.id} href={it.path || '#'} className="nav-link" onClick={(e) => { e.preventDefault(); go(it.id); }}>{it.label}</a>
        ))}
        <a href={n.ctaPath || '/donate'} onClick={(e) => { e.preventDefault(); go('donate'); }}>
          <button type="button" className="nav-cta">{n.ctaLabel} ↗</button>
        </a>
      </div>
    </nav>
  );
}

const SOCIAL_ICONS = {
  LI: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z',
  IG: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.36 2.67.94 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.8.72 1.47 1.38 2.13.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.8-.3 1.47-.72 2.13-1.38.66-.66 1.08-1.33 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.8-.72-1.47-1.38-2.13C21.34 1.36 20.67.94 19.87.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 12 8a4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z',
  YT: 'M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.6 15.6V8.4l6.27 3.6-6.27 3.6z',
  FB: 'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.95.93-1.95 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z',
  FX: 'M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64z',
  TT: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .59.05.86.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 5.4 20.4a6.34 6.34 0 0 0 10.84-4.47v-6.9a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.42-.46z',
};
function SocialIcon({ label }) {
  const d = SOCIAL_ICONS[label] || SOCIAL_ICONS[label === 'X' ? 'FX' : ''];
  if (!d) return <span style={{ fontSize: 10, fontFamily: 'var(--mono)' }}>{label}</span>;
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function Footer({ setPage }) {
  const f = C().footer;
  return (
    <footer>
      <div className="container-wide" style={{ padding: '96px var(--gutter) 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 56, paddingBottom: 64 }}>
          <div>
            <Wordmark />
            <p style={{ marginTop: 28, color: 'rgba(236,225,200,0.72)', maxWidth: 340, fontSize: 14, lineHeight: 1.65 }}>
              {f.blurb}
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              {f.social.map(s => {
                const url = (s && s.url) || '';
                const label = (s && s.label) || s;
                const interactive = !!url;
                return (
                  <a
                    key={label}
                    href={url || '#'}
                    target={interactive ? '_blank' : undefined}
                    rel={interactive ? 'noopener noreferrer' : undefined}
                    onClick={interactive ? undefined : (e) => e.preventDefault()}
                    aria-label={typeof label === 'string' ? `C4C on ${label}` : 'Social link'}
                    aria-disabled={!interactive}
                    style={{ width: 38, height: 38, border: '1px solid rgba(236,225,200,0.2)', borderRadius: 999, display: 'grid', placeItems: 'center', color: 'rgba(236,225,200,0.85)', textDecoration: 'none', opacity: interactive ? 1 : 0.5, cursor: interactive ? 'pointer' : 'default' }}>
                    <SocialIcon label={label} />
                  </a>
                );
              })}
            </div>
          </div>
          {f.columns.map(col => (
            <div key={col.title}>
              <div className="eyebrow eyebrow-paper" style={{ marginBottom: 20 }}>{col.title}</div>
              {col.links.map(l => {
                const label = typeof l === 'string' ? l : l.label;
                const target = typeof l === 'string' ? '' : (l.page || '');
                return (
                  <a
                    key={label}
                    href={target || '#'}
                    onClick={(e) => followLink(setPage, target, e)}
                    style={{ display: 'block', padding: '8px 0', fontSize: 14, color: 'rgba(236,225,200,0.85)' }}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          ))}
          <div>
            <div className="eyebrow eyebrow-paper" style={{ marginBottom: 20 }}>{f.office.title}</div>
            <p style={{ fontSize: 14, color: 'rgba(236,225,200,0.85)', lineHeight: 1.75 }}>
              {f.office.addressLine1}<br />
              {f.office.addressLine2}<br /><br />
              <a href={`tel:${(f.office.phone || '').replace(/\s/g, '')}`} style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(236,225,200,0.7)' }}>
                {f.office.phone}
              </a>
            </p>
          </div>
        </div>

        <div style={{ paddingTop: 32, borderTop: '1px solid rgba(236,225,200,0.18)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', color: 'rgba(236,225,200,0.5)' }}>
            {f.legal}
          </div>
          <div style={{ display: 'flex', gap: 28, fontSize: 12, color: 'rgba(236,225,200,0.6)' }}>
            {f.legalLinks.map(l => {
              const label = typeof l === 'string' ? l : l.label;
              const target = typeof l === 'string' ? '' : (l.page || '');
              return (
                <a key={label} href={target || '#'} onClick={(e) => followLink(setPage, target, e)}>
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

function Eyebrow({ children, ochre, dark }) {
  return (
    <div className={`eyebrow ${ochre ? 'eyebrow-ochre' : ''} ${dark ? 'eyebrow-paper' : ''}`}>
      {children}
    </div>
  );
}

function Photo({ kind = 'outback', label, credit, height = 480, style, src, alt, eager, imgPosition, children }) {
  const cls = `ph ph-${kind}${src ? ' ph-has-image' : ''}`;
  return (
    <div className={cls} style={{ height, ...style }}>
      {src && (
        <img
          src={src}
          alt={alt || ''}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: imgPosition || 'center', display: 'block', zIndex: 1 }}
        />
      )}
      {credit && <div className="ph-credit">{credit}</div>}
      {children}
    </div>
  );
}

function HomeHero({ setPage }) {
  const h = C().home.hero;
  const stats = C().home.stats;
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <Photo kind={h.photoKind} label={h.photoLabel} credit={h.photoCredit} src={h.photoUrl} alt="" eager height={'78vh'} style={{ minHeight: 640, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.15) 0%, rgba(20,17,11,0.4) 60%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />

        <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 80, paddingTop: 80 }}>
          <div style={{ maxWidth: 1100 }}>
            <Eyebrow dark>{h.eyebrow}</Eyebrow>
            <h1 className="h-display display" style={{ marginTop: 32, color: 'var(--bone)', textShadow: '0 2px 30px rgba(0,0,0,0.3)' }}>
              {h.title1}<br />
              <span className="italic" style={{ color: '#e6c97a' }}>{h.titleItalic}</span>
            </h1>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'flex-end', marginTop: 56 }}>
            <p className="lead" style={{ color: 'rgba(236,225,200,0.9)', maxWidth: 620, fontSize: 24 }}>
              {h.lead}
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {h.ctaPrimary && <button type="button" className="btn btn-rust" onClick={() => setPage('donate')}>{h.ctaPrimary}</button>}
              {h.ctaSecondary && <button type="button" className="btn btn-outline-paper" onClick={() => setPage('contact')}>{h.ctaSecondary}</button>}
            </div>
          </div>
        </div>
      </Photo>

      {stats.length > 0 && (
        <div style={{ background: 'var(--ink)', color: 'var(--bone)' }}>
          <div className="container-wide" style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 0 }}>
            {stats.map((s, i) => {
              const solo = stats.length === 1;
              return (
                <div
                  key={i}
                  style={{
                    padding: solo ? '64px 48px' : '40px 32px',
                    borderRight: i < stats.length - 1 ? '1px solid rgba(236,225,200,0.15)' : 'none',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: solo ? 18 : 20,
                  }}
                >
                  <div
                    className="display"
                    style={{
                      fontSize: solo ? 'clamp(72px, 9vw, 128px)' : 56,
                      fontWeight: 300,
                      lineHeight: 0.9,
                      color: 'var(--bone)',
                      letterSpacing: '-0.04em',
                      flexShrink: 0,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    className={solo ? 'display italic' : ''}
                    style={{
                      fontSize: solo ? 'clamp(18px, 2.2vw, 28px)' : 13,
                      lineHeight: 1.3,
                      color: 'rgba(236,225,200,0.85)',
                      maxWidth: solo ? 'none' : 180,
                      fontWeight: solo ? 400 : undefined,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function MissionStatement({ setPage }) {
  const m = C().home.mission;
  return (
    <section className="section" style={{ paddingBottom: 0 }}>
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 96 }}>
          <div>
            <Eyebrow ochre>{m.eyebrow}</Eyebrow>
          </div>
          <div>
            <h2 className="display" style={{ fontSize: 'clamp(36px, 4vw, 64px)', lineHeight: 1.05, fontWeight: 300, letterSpacing: '-0.025em' }}>
              {m.headlinePre}<span className="italic" style={{ color: 'var(--terracotta-2)' }}>{m.headlineItalic}</span>{m.headlinePost}
            </h2>
            <div style={{ marginTop: 48, display: 'flex', gap: 32, alignItems: 'center', paddingTop: 32, borderTop: '1px solid var(--rule)' }}>
              <div style={{ width: 72, height: 72, borderRadius: 999, overflow: 'hidden', flexShrink: 0, background: 'var(--paper-warm)' }}>
                {m.founderPhotoUrl
                  ? <img src={m.founderPhotoUrl} alt={m.founderName} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  : <Photo kind="portrait" height={72} />}
              </div>
              <div>
                <div className="display" style={{ fontSize: 20 }}>{m.founderName}</div>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--ink-3)', textTransform: 'uppercase', marginTop: 4 }}>{m.founderRole}</div>
              </div>
              <button type="button" className="btn-ghost" style={{ marginLeft: 'auto' }} onClick={() => setPage('about')}>{m.linkLabel}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlagshipCampaign({ setPage }) {
  const f = C().home.flagship;
  return (
    <section className="section">
      <div className="container-wide">
        <Eyebrow ochre>{f.eyebrow}</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginTop: 40, background: 'var(--ink)', color: 'var(--bone)', minHeight: 560 }}>
          {f.photoUrl
            ? <Photo kind={f.photoKind} src={f.photoUrl} label={f.photoLabel} credit={f.photoCredit} alt="" height="100%" />
            : (
              <div className="flagship-media" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ink)', padding: '48px 56px', minHeight: 560 }}>
                {f.logoUrl
                  ? <img src={f.logoUrl} alt="Affordable Energy Australia" loading="lazy" decoding="async" style={{ maxWidth: '78%', maxHeight: 220, width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }} />
                  : <Photo kind={f.photoKind} label={f.photoLabel} credit={f.photoCredit} alt="" height="100%" />}
              </div>
            )}
          <div style={{ padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {(f.chipLabel || f.subBrandLabel) && (
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 32 }}>
                  {f.chipLabel && <span className="chip chip-active" style={{ borderColor: 'rgba(236,225,200,0.3)', color: 'var(--bone)' }}>{f.chipLabel}</span>}
                  {f.subBrandLabel && <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'rgba(236,225,200,0.55)' }}>{f.subBrandLabel}</span>}
                </div>
              )}
              {f.campaignName && (
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em', color: '#e6c97a', marginBottom: 24 }}>
                  {f.campaignName}
                </div>
              )}
              <h2 className="display" style={{ fontSize: 'clamp(40px, 4.5vw, 72px)', fontWeight: 300, lineHeight: 0.98, color: 'var(--bone)', letterSpacing: '-0.03em' }}>
                {f.headline1}
                {(f.headline2Italic || f.headline2Suffix) && (<>
                  <br />
                  <span className="italic" style={{ color: '#e6c97a' }}>{f.headline2Italic}</span>{f.headline2Suffix}
                </>)}
                {f.headline3 && (<><br />{f.headline3}</>)}
              </h2>
              <p className="body" style={{ marginTop: 28, maxWidth: 480, color: 'rgba(236,225,200,0.78)' }}>
                {f.body}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap', marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(236,225,200,0.18)' }}>
              <button type="button" className="btn btn-ochre" onClick={() => setPage('aea')}>{f.ctaLabel}</button>
              {(f.supporters || f.electorates) && (
                <div style={{ display: 'flex', gap: 32 }}>
                  {f.supporters && (
                    <div>
                      <div className="display" style={{ fontSize: 24, color: 'var(--bone)', fontWeight: 300 }}>{f.supporters}</div>
                      {f.supportersLabel && <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(236,225,200,0.55)', marginTop: 4, textTransform: 'uppercase' }}>{f.supportersLabel}</div>}
                    </div>
                  )}
                  {f.electorates && (
                    <div>
                      <div className="display" style={{ fontSize: 24, color: 'var(--bone)', fontWeight: 300 }}>{f.electorates}</div>
                      {f.electoratesLabel && <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(236,225,200,0.55)', marginTop: 4, textTransform: 'uppercase' }}>{f.electoratesLabel}</div>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IssueAreas({ setPage }) {
  const ia = C().home.issueAreas;
  return (
    <section className="section umber-bg">
      <div className="container-wide">
        <div style={{ marginBottom: 80, maxWidth: 760 }}>
          <Eyebrow dark>{ia.eyebrow}</Eyebrow>
          <h2 className="h-1 display" style={{ marginTop: 24 }}>{ia.headline}{ia.headlineItalic && (<><br /><span className="italic">{ia.headlineItalic}</span></>)}</h2>
          <p className="lead" style={{ marginTop: 24 }}>
            {ia.lead}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${ia.areas.length}, 1fr)`, gap: 16 }}>
          {ia.areas.map(a => (
            <a
              key={a.n}
              href={`/issues/${a.slug}`}
              onClick={(e) => { e.preventDefault(); setPage('issue:' + a.slug); }}
              style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none', display: 'block' }}
            >
              <Photo kind={a.kind} src={a.photoUrl} alt={a.title} height={320} label={`Issue ${a.n}`} />
              <div style={{ paddingTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ochre)', letterSpacing: '0.14em' }}>{a.n} —</span>
                  <span aria-hidden="true" style={{ fontSize: 18, color: 'rgba(236,225,200,0.6)' }}>↗</span>
                </div>
                <h3 className="display" style={{ fontSize: 36, marginTop: 16, fontWeight: 300, color: 'var(--bone)' }}>{a.title}</h3>
                <p className="body" style={{ fontSize: 14, marginTop: 16, color: 'rgba(236,225,200,0.72)' }}>{a.body}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedPolicy({ setPage }) {
  const fp = C().home.featuredPolicy;
  return (
    <section className="section">
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96, alignItems: 'flex-end' }}>
          <Eyebrow ochre>{fp.eyebrow}</Eyebrow>
          <div>
            <h2 className="h-1 display">{fp.headline}</h2>
          </div>
        </div>

        <div style={{ marginTop: 64, borderTop: '1px solid var(--ink)' }}>
          {fp.items.map((it, i) => (
            <a
              key={i}
              href="/news"
              onClick={(e) => { e.preventDefault(); setPage('news'); }}
              style={{ display: 'grid', gridTemplateColumns: '160px 130px 1fr 220px 60px', gap: 32, padding: '40px 0', borderBottom: '1px solid var(--rule)', alignItems: 'flex-start', cursor: 'pointer', transition: 'background 0.2s', color: 'inherit', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--shade)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--ochre-2)', textTransform: 'uppercase', paddingTop: 10 }}>{it.type}</span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', paddingTop: 10 }}>{it.date}</span>
              <h3 className="display" style={{ fontSize: 30, lineHeight: 1.1, fontWeight: 400, letterSpacing: '-0.015em' }}>{it.title}</h3>
              <span className="small" style={{ paddingTop: 12 }}>{it.cite}</span>
              <span aria-hidden="true" style={{ fontSize: 22, textAlign: 'right', paddingTop: 8 }}>↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerStrip() {
  const p = C().home.partners;
  return (
    <section style={{ background: 'var(--paper-warm)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
      <div className="container-wide" style={{ padding: '48px var(--gutter)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 56, flexWrap: 'wrap' }}>
          <div className="eyebrow" style={{ flexShrink: 0 }}>{p.eyebrow}</div>
          <div className="partner-row" style={{ display: 'flex', flex: 1, gap: 48, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            {p.items.map((item, i) => {
              const name = typeof item === 'string' ? item : item.name;
              const logoUrl = typeof item === 'string' ? '' : (item.logoUrl || '');
              if (logoUrl) {
                return (
                  <img
                    key={name || i}
                    src={logoUrl}
                    alt={name}
                    loading="lazy"
                    decoding="async"
                    style={{ height: 78, width: 'auto', maxWidth: 220, objectFit: 'contain' }}
                  />
                );
              }
              return (
                <div key={name || i} className="display italic" style={{ fontSize: 18, color: 'var(--ink-2)', fontWeight: 400 }}>
                  {name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PressBand({ setPage }) {
  const pr = C().home.press;
  const [recent, setRecent] = useState(null);

  useEffect(() => {
    fetch('/media.json')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(items => setRecent(items.slice(0, 3)))
      .catch(() => setRecent([]));
  }, []);

  // Show the three most recent Media & Webinars headlines; fall back to the
  // configured press quotes until media loads.
  const useMedia = recent && recent.length > 0;

  return (
    <section className="section dark">
      <div className="container-wide">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56 }}>
          <Eyebrow dark>{pr.eyebrow}</Eyebrow>
          <a
            href="/media-and-webinars"
            onClick={(e) => { e.preventDefault(); setPage('media'); }}
            className="mono"
            style={{ fontSize: 11, letterSpacing: '0.12em', color: 'rgba(236,225,200,0.7)', borderBottom: '1px solid rgba(236,225,200,0.3)', paddingBottom: 4, textDecoration: 'none' }}
          >
            {pr.linkLabel}
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
          {useMedia
            ? recent.map((it, i) => (
                <a
                  key={it.id || i}
                  href={`/media/${it.id}`}
                  onClick={(e) => { e.preventDefault(); setPage('article:' + it.id); }}
                  style={{ paddingTop: 32, borderTop: '1px solid rgba(236,225,200,0.25)', textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <div className="display italic" style={{ fontSize: 20, color: '#e6c97a', marginBottom: 24, fontWeight: 400 }}>{it.type}</div>
                  <p className="display" style={{ fontSize: 26, lineHeight: 1.2, fontWeight: 300, color: 'var(--bone)' }}>{it.title}</p>
                  <div className="mono" style={{ fontSize: 11, color: 'rgba(236,225,200,0.5)', marginTop: 28, letterSpacing: '0.1em' }}>{it.date}</div>
                </a>
              ))
            : pr.items.map((p, i) => (
                <div key={i} style={{ paddingTop: 32, borderTop: '1px solid rgba(236,225,200,0.25)' }}>
                  <div className="display italic" style={{ fontSize: 22, color: '#e6c97a', marginBottom: 32, fontWeight: 400 }}>{p.masthead}</div>
                  <p className="display" style={{ fontSize: 28, lineHeight: 1.2, fontWeight: 300, color: 'var(--bone)' }}>"{p.headline}"</p>
                  <div className="mono" style={{ fontSize: 11, color: 'rgba(236,225,200,0.5)', marginTop: 32, letterSpacing: '0.1em' }}>{p.when}</div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

function DonateBand({ setPage }) {
  const d = C().home.donateBand;
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <Photo kind={d.photoKind} src={d.photoUrl} alt="" height={560} label={d.photoLabel} credit={d.photoCredit} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,17,11,0.85) 0%, rgba(20,17,11,0.55) 100%)', zIndex: 2 }} />
      <div className="container-wide" style={{ position: 'relative', zIndex: 4, padding: '128px var(--gutter)', minHeight: 560, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 96, alignItems: 'center', width: '100%' }}>
          <div>
            <Eyebrow dark ochre>{d.eyebrow}</Eyebrow>
            <h2 className="h-1 display" style={{ marginTop: 24, color: 'var(--bone)' }}>
              {d.headlinePre}<span className="italic" style={{ color: '#e6c97a' }}>{d.headlineItalic}</span>{d.headlinePost}
            </h2>
          </div>
          <div>
            <p className="lead" style={{ color: 'rgba(236,225,200,0.85)', marginBottom: 40 }}>
              {d.lead}
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {d.ctaPrimary && <button type="button" className="btn btn-rust" onClick={() => setPage('donate')}>{d.ctaPrimary}</button>}
              {d.ctaSecondary && <button type="button" className="btn btn-outline-paper" onClick={() => setPage('donate')}>{d.ctaSecondary}</button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage({ setPage }) {
  return (
    <React.Fragment>
      <HomeHero setPage={setPage} />
      <PartnerStrip />
      <MissionStatement setPage={setPage} />
      <FlagshipCampaign setPage={setPage} />
      <IssueAreas setPage={setPage} />
      <PressBand setPage={setPage} />
      <DonateBand setPage={setPage} />
    </React.Fragment>
  );
}

Object.assign(window, {
  Logo, Wordmark, Nav, Footer, Eyebrow, Photo,
  HomePage, HomeHero, PartnerStrip, MissionStatement, FlagshipCampaign,
  IssueAreas, FeaturedPolicy, PressBand, DonateBand, followLink,
});
