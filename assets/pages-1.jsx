// About + What we do + Issue page (CMS-driven)

async function postJson(url, data) {
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return r.ok;
  } catch (e) {
    return false;
  }
}

function AboutPage({ setPage }) {
  const a = C().about;
  const storyParagraphs = (a.story.body || '').split('\n\n').filter(Boolean);

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={a.hero.photoKind} src={a.hero.photoUrl} alt="" eager label={a.hero.photoLabel} credit={a.hero.photoCredit} height={620}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 var(--gutter) 80px' }}>
            <div>
              <Eyebrow dark>{a.hero.eyebrow}</Eyebrow>
              <h1 className="h-display display" style={{ color: 'var(--bone)', marginTop: 28 }}>
                {a.hero.title1}
                {a.hero.titleItalic && (<><br /><span className="italic" style={{ color: '#e6c97a' }}>{a.hero.titleItalic}</span></>)}
              </h1>
            </div>
          </div>
        </Photo>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container-wide" style={{ paddingTop: 64 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 96 }}>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 200 }}>
              {C().site.iconUrl && <img src={C().site.iconUrl} alt="" aria-hidden="true" style={{ height: 96, width: 96, objectFit: 'contain', display: 'block' }} />}
              <div style={{ marginTop: 'auto', textAlign: 'right' }}>
                <Eyebrow ochre>{a.story.eyebrow}</Eyebrow>
              </div>
            </div>
            <div>
              <p className="lead" style={{ marginBottom: 32 }}>{a.story.lead}</p>
              {storyParagraphs.map((para, i) => {
                const isSignature = i === storyParagraphs.length - 1;
                if (isSignature) {
                  return (
                    <p key={i} className="body italic" style={{ fontSize: 18, marginTop: 32, textAlign: 'right', whiteSpace: 'pre-line', color: 'var(--ink-2)' }}>
                      — {para}
                    </p>
                  );
                }
                return (
                  <p key={i} className="body" style={{ fontSize: 17, marginBottom: 20, whiteSpace: 'pre-line' }}>{para}</p>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section umber-bg">
        <div className="container-wide">
          <Eyebrow dark>{a.howWeWork.eyebrow}</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 56, marginTop: 56 }}>
            {a.howWeWork.items.map(m => (
              <div key={m.num}>
                <div className="mono" style={{ fontSize: 11, color: '#e6c97a', letterSpacing: '0.14em', marginBottom: 40 }}>{m.num} —</div>
                <div className="display italic" style={{ fontSize: 88, lineHeight: 0.92, color: 'var(--bone)', fontWeight: 300, letterSpacing: '-0.04em' }}>We {m.word}.</div>
                <p className="body" style={{ marginTop: 32, fontSize: 16, color: 'rgba(236,225,200,0.78)' }}>{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {a.team && a.team.groups && a.team.groups.length > 0 && (
        <section className="section warm-bg" style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
          <div className="container-wide">
            <div style={{ marginBottom: 64 }}>
              <Eyebrow ochre>{a.team.eyebrow}</Eyebrow>
            </div>

            {a.team.groups.map(group => (
              <div key={group.title} style={{ marginBottom: 64 }}>
                <h3 className="display" style={{ fontSize: 28, fontWeight: 400, paddingBottom: 16, borderBottom: '1px solid var(--ink)', marginBottom: 32 }}>
                  {group.title}
                </h3>
                {group.members && group.members.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
                    {group.members.map(t => (
                      <div key={t.name}>
                        <div style={{ aspectRatio: '1 / 1', position: 'relative', overflow: 'hidden' }}>
                          <Photo kind={t.kind || 'portrait'} src={t.photoUrl} alt={t.name} height="100%" label={t.tag || ''} imgPosition="center 25%" />
                        </div>
                        <div style={{ paddingTop: 20 }}>
                          <h4 className="display" style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.1 }}>{t.name}</h4>
                          {t.role && <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', marginTop: 6 }}>{t.role}</div>}
                          {t.bio && <p className="body" style={{ fontSize: 14, marginTop: 12 }}>{t.bio}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="small" style={{ color: 'var(--ink-4)', fontStyle: 'italic' }}>
                    Profiles coming soon.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </React.Fragment>
  );
}

function WorkPage({ setPage }) {
  const w = C().work;

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={w.hero.photoKind} src={w.hero.photoUrl} alt="" eager label={w.hero.photoLabel} credit={w.hero.photoCredit} height={560}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 var(--gutter) 72px' }}>
            <div>
              <Eyebrow dark>{w.hero.eyebrow}</Eyebrow>
              <h1 className="h-display display" style={{ color: 'var(--bone)', marginTop: 28 }}>
                {w.hero.title1}
                {w.hero.titleItalic && (<><br /><span className="italic" style={{ color: '#e6c97a' }}>{w.hero.titleItalic}</span></>)}
              </h1>
            </div>
          </div>
        </Photo>
      </section>

      {w.areas.map((a, i) => (
        <section key={a.slug} style={{ background: i % 2 === 0 ? 'var(--paper)' : 'var(--paper-warm)', borderBottom: '1px solid var(--rule)' }}>
          <div className="container-wide" style={{ padding: '120px var(--gutter)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
              <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
                <div className="mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--ochre-2)', marginBottom: 24 }}>
                  {a.topLabel || (a.n + ' Pillar')}
                </div>
                <h2 className="display" style={{ fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 0.95, fontWeight: 300, letterSpacing: '-0.035em' }}>
                  {a.tagline}
                </h2>
                <p className="body" style={{ marginTop: 32, maxWidth: 520, fontSize: 17 }}>{a.body}</p>
                <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setPage('issue:' + a.slug)}>Explore {a.title.toLowerCase()} ↗</button>
                  {a.slug === 'energy' && <button type="button" className="btn-ghost" onClick={() => setPage('aea')}>See AEA campaign</button>}
                </div>
              </div>
              <div style={{ order: i % 2 === 0 ? 2 : 1 }}>
                <Photo kind={a.kind} src={a.photoUrl} alt="" height={520} label={a.title} credit="" />
              </div>
            </div>
          </div>
        </section>
      ))}

      {w.briefing && (
        <section className="section umber-bg">
          <div className="container-wide">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'flex-start' }}>
              <div>
                <Eyebrow dark>{w.briefing.eyebrow}</Eyebrow>
                <h2 className="h-1 display" style={{ marginTop: 24, color: 'var(--bone)' }}>
                  {w.briefing.headlinePre}<span className="italic" style={{ color: '#e6c97a' }}>{w.briefing.headlineItalic}</span>{w.briefing.headlinePost}
                </h2>
                {w.briefing.lead && <p className="lead" style={{ color: 'rgba(236,225,200,0.78)', marginTop: 24 }}>{w.briefing.lead}</p>}
              </div>
              <BriefingForm topic="C4C" submitLabel={w.briefing.submitLabel || 'Subscribe'} />
            </div>
          </div>
        </section>
      )}
    </React.Fragment>
  );
}

function BriefingForm({ topic, submitLabel }) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const fd = new FormData(e.currentTarget);
    const ok = await postJson('/api/newsletter', {
      topic,
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      email: fd.get('email'),
      postcode: fd.get('postcode'),
    });
    setBusy(false);
    if (ok) setSent(true);
    else setErr('Something went wrong. Please try again.');
  }

  if (sent) {
    return (
      <div style={{ padding: 32, border: '1px solid rgba(236,225,200,0.3)', color: 'var(--bone)' }}>
        <div className="display" style={{ fontSize: 32, color: '#e6c97a' }}>You're on the list.</div>
        <p style={{ marginTop: 16, color: 'rgba(236,225,200,0.78)' }}>We'll send the briefing to your inbox four times a year. Check your email for confirmation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <label htmlFor="brief_first" className="label" style={{ color: 'rgba(236,225,200,0.6)' }}>First name</label>
        <input id="brief_first" name="first_name" className="input" required placeholder=" " style={{ borderBottomColor: 'rgba(236,225,200,0.3)', color: 'var(--bone)' }} />
      </div>
      <div>
        <label htmlFor="brief_last" className="label" style={{ color: 'rgba(236,225,200,0.6)' }}>Last name</label>
        <input id="brief_last" name="last_name" className="input" required placeholder=" " style={{ borderBottomColor: 'rgba(236,225,200,0.3)', color: 'var(--bone)' }} />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <label htmlFor="brief_email" className="label" style={{ color: 'rgba(236,225,200,0.6)' }}>Email</label>
        <input id="brief_email" name="email" type="email" autoComplete="email" className="input" required placeholder=" " style={{ borderBottomColor: 'rgba(236,225,200,0.3)', color: 'var(--bone)' }} />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <label htmlFor="brief_postcode" className="label" style={{ color: 'rgba(236,225,200,0.6)' }}>Postcode</label>
        <input id="brief_postcode" name="postcode" type="text" inputMode="numeric" pattern="[0-9]{4}" className="input" placeholder=" " style={{ borderBottomColor: 'rgba(236,225,200,0.3)', color: 'var(--bone)' }} />
      </div>
      {err && <div style={{ gridColumn: '1 / -1', color: '#ff9a7a', fontSize: 13 }}>{err}</div>}
      <div style={{ gridColumn: '1 / -1', marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn btn-ochre" disabled={busy}>
          {busy ? 'Subscribing…' : `${submitLabel || 'Subscribe'} →`}
        </button>
      </div>
    </form>
  );
}

function IssuePage({ slug, setPage }) {
  const issues = C().issues;
  const a = issues[slug] || issues.energy;
  const shared = issues.shared || {};
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetch('/media.json')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(items => setPosts(items.filter(it => (it.tag || '').toLowerCase() === a.title.toLowerCase()).slice(0, 6)))
      .catch(() => setPosts([]));
  }, [a.title]);

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={a.kind} src={a.photoUrl} alt="" eager height={620} label={a.title} credit="">
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.75) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 var(--gutter) 120px' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 13, color: 'rgba(236,225,200,0.7)', marginBottom: 48 }}>
              <a href="/work" onClick={(e) => { e.preventDefault(); setPage('work'); }} style={{ cursor: 'pointer', borderBottom: '1px solid rgba(236,225,200,0.3)', color: 'inherit', textDecoration: 'none' }}>What we do</a>
              <span aria-hidden="true">/</span>
              <span>{a.title}</span>
            </div>
            <div className="mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: '#e6c97a', marginBottom: 24 }}>
              {a.tag} · {a.title.toUpperCase()}
            </div>
            <h1 className="h-display display" style={{ maxWidth: 1200, color: 'var(--bone)' }}>
              {a.titleWhite
                ? (<React.Fragment>{a.titleWhite}{' '}<span className="italic" style={{ color: '#e6c97a', display: 'block' }}>{a.titleAccent}</span></React.Fragment>)
                : (<span style={{ color: '#e6c97a' }}>{a.tagline}</span>)}
            </h1>
          </div>
        </Photo>
      </section>

      <section className="section">
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 96 }}>
            <Eyebrow ochre>The C4C position</Eyebrow>
            <p className="lead" style={{ fontSize: 22, whiteSpace: 'pre-line' }}>{a.position}</p>
          </div>
        </div>
      </section>

      {posts && posts.length > 0 && (
        <section className="section warm-bg" style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
          <div className="container-wide">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96 }}>
              <Eyebrow ochre>{shared.workEyebrow || 'From Media & Webinars'}</Eyebrow>
              <div>
                {posts.map((it, i) => (
                  <a
                    key={it.id || i}
                    href={`/media/${it.id}`}
                    onClick={(e) => { e.preventDefault(); setPage('article:' + it.id); }}
                    style={{ display: 'grid', gridTemplateColumns: '140px 1fr 240px 40px', gap: 24, padding: '28px 0', borderBottom: '1px solid var(--rule)', borderTop: i === 0 ? '1px solid var(--ink)' : 'none', alignItems: 'baseline', cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
                  >
                    <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--ochre-2)', textTransform: 'uppercase' }}>{it.type}</span>
                    <div className="display" style={{ fontSize: 22, lineHeight: 1.2, fontWeight: 400 }}>{it.title}</div>
                    <span className="mono small">{it.date}</span>
                    <span aria-hidden="true" style={{ fontSize: 18, textAlign: 'right' }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </React.Fragment>
  );
}

Object.assign(window, { AboutPage, WorkPage, IssuePage, BriefingForm, postJson });
