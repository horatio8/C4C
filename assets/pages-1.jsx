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

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={a.hero.photoKind} src={a.hero.photoUrl} alt="" eager label={a.hero.photoLabel} credit={a.hero.photoCredit} height={620}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 var(--gutter) 80px' }}>
            <div>
              <Eyebrow dark>{a.hero.eyebrow}</Eyebrow>
              <h1 className="h-display display" style={{ color: 'var(--bone)', marginTop: 28 }}>
                {a.hero.title1}<br /><span className="italic" style={{ color: '#e6c97a' }}>{a.hero.titleItalic}</span>
              </h1>
            </div>
          </div>
        </Photo>
      </section>

      <section className="section">
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 96 }}>
            <Eyebrow ochre>{a.story.eyebrow}</Eyebrow>
            <div>
              <p className="lead" style={{ marginBottom: 32 }}>{a.story.lead}</p>
              <p className="body" style={{ fontSize: 17 }}>{a.story.body}</p>
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

      <section className="section">
        <div className="container-wide">
          <Eyebrow ochre>{a.numbers.eyebrow}</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 48, borderTop: '1px solid var(--ink)' }}>
            {a.numbers.items.map((s, i) => (
              <div key={s.l} style={{ padding: '48px 32px 0 0', borderRight: i < a.numbers.items.length - 1 ? '1px solid var(--rule)' : 'none', paddingLeft: i > 0 ? 32 : 0 }}>
                <div className="numeral">{s.n}</div>
                <div className="small" style={{ marginTop: 24, maxWidth: 200 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section warm-bg" style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96, marginBottom: 80, alignItems: 'flex-end' }}>
            <Eyebrow ochre>{a.team.eyebrow}</Eyebrow>
            <div>
              <h2 className="h-1 display">{a.team.headlinePre}<span className="italic">{a.team.headlineItalic}</span></h2>
              <p className="lead" style={{ marginTop: 24, maxWidth: 600 }}>{a.team.lead}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {a.team.members.map(t => (
              <div key={t.name}>
                <Photo kind={t.kind} src={t.photoUrl} alt={t.name} height={360} label={t.tag} />
                <div style={{ paddingTop: 24 }}>
                  <h3 className="display" style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.05 }}>{t.name}</h3>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', marginTop: 8 }}>{t.role}</div>
                  <p className="body" style={{ fontSize: 14, marginTop: 16 }}>{t.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 96 }}>
            <div>
              <Eyebrow ochre>{a.financials.eyebrow}</Eyebrow>
              <h2 className="h-2 display" style={{ marginTop: 24 }}>{a.financials.headlinePre}<span className="italic">{a.financials.headlineItalic}</span></h2>
              <p className="body" style={{ marginTop: 24 }}>{a.financials.body}</p>
            </div>
            <div style={{ borderTop: '1px solid var(--ink)' }}>
              {a.financials.documents.map((d, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 220px 40px', gap: 24, padding: '28px 0', borderBottom: '1px solid var(--rule)', alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--ochre-2)', letterSpacing: '0.1em' }}>{d.y}</span>
                  <div className="display" style={{ fontSize: 22, fontWeight: 400 }}>{d.name}</div>
                  <span className="mono small">{d.size}</span>
                  <span aria-hidden="true" style={{ fontSize: 18, textAlign: 'right' }}>↓</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
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
                {w.hero.title1}<br /><span className="italic" style={{ color: '#e6c97a' }}>{w.hero.titleItalic}</span>
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
                  {a.n} · ISSUE AREA
                </div>
                <h2 className="display" style={{ fontSize: 'clamp(56px, 7vw, 120px)', lineHeight: 0.92, fontWeight: 300, letterSpacing: '-0.04em' }}>
                  {a.title}.
                </h2>
                <p className="display italic" style={{ fontSize: 28, color: 'var(--terracotta-2)', marginTop: 24, lineHeight: 1.2, fontWeight: 400 }}>
                  {a.tagline}
                </p>
                <p className="body" style={{ marginTop: 32, maxWidth: 480, fontSize: 17 }}>{a.body}</p>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--ink-4)', marginTop: 32 }}>
                  {a.meta}
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setPage('issue:' + a.slug)}>Explore {a.title.toLowerCase()} ↗</button>
                  {a.slug === 'energy' && <button type="button" className="btn-ghost" onClick={() => setPage('aea')}>See AEA campaign</button>}
                </div>
              </div>
              <div style={{ order: i % 2 === 0 ? 2 : 1 }}>
                <Photo kind={a.kind} src={a.photoUrl} alt="" height={520} label={a.title} credit={`Field reporting · 2026`} />
              </div>
            </div>
          </div>
        </section>
      ))}
    </React.Fragment>
  );
}

function BriefingForm({ topic }) {
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
        <p style={{ marginTop: 16, color: 'rgba(236,225,200,0.78)' }}>We'll send the {topic.toLowerCase()} briefing to your inbox four times a year. Check your email for confirmation.</p>
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
      <div>
        <label htmlFor="brief_postcode" className="label" style={{ color: 'rgba(236,225,200,0.6)' }}>Postcode</label>
        <input id="brief_postcode" name="postcode" type="text" inputMode="numeric" pattern="[0-9]{4}" className="input" placeholder=" " style={{ borderBottomColor: 'rgba(236,225,200,0.3)', color: 'var(--bone)' }} />
      </div>
      <div>
        <label className="label" style={{ color: 'rgba(236,225,200,0.6)' }}>Electorate (auto)</label>
        <input className="input" style={{ borderBottomColor: 'rgba(236,225,200,0.3)', color: 'rgba(236,225,200,0.5)' }} placeholder="From postcode" disabled />
      </div>
      {err && <div style={{ gridColumn: '1 / -1', color: '#ff9a7a', fontSize: 13 }}>{err}</div>}
      <div style={{ gridColumn: '1 / -1', marginTop: 24 }}>
        <button type="submit" className="btn btn-ochre" disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Subscribing…' : `Subscribe to the ${topic.toLowerCase()} briefing ↗`}
        </button>
      </div>
    </form>
  );
}

function IssuePage({ slug, setPage }) {
  const issues = C().issues;
  const a = issues[slug] || issues.energy;
  const shared = issues.shared;

  const taglineParts = a.tagline.split('.');

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={a.kind} src={a.photoUrl} alt="" eager height={620} label={`${a.title} · field reporting`} credit="Photo: Jack Atley · 2026">
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.75) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 var(--gutter) 80px' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 13, color: 'rgba(236,225,200,0.7)', marginBottom: 32 }}>
              <a href="/work" onClick={(e) => { e.preventDefault(); setPage('work'); }} style={{ cursor: 'pointer', borderBottom: '1px solid rgba(236,225,200,0.3)', color: 'inherit', textDecoration: 'none' }}>What we do</a>
              <span aria-hidden="true">/</span>
              <span>{a.title}</span>
            </div>
            <div className="mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: '#e6c97a', marginBottom: 24 }}>
              {a.tag} · ISSUE AREA · {a.title.toUpperCase()}
            </div>
            <h1 className="h-display display" style={{ maxWidth: 1200, color: 'var(--bone)' }}>
              {taglineParts[0]}.<br />
              <span className="italic" style={{ color: '#e6c97a' }}>{taglineParts[1] && taglineParts[1].trim() + '.'}</span>
            </h1>
          </div>
        </Photo>
      </section>

      <section className="section">
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 96 }}>
            <Eyebrow ochre>The C4C position</Eyebrow>
            <p className="lead" style={{ fontSize: 26 }}>{a.position}</p>
          </div>
        </div>
      </section>

      <section className="section warm-bg" style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96, alignItems: 'flex-start' }}>
            <div>
              <Eyebrow ochre>{shared.whyEyebrow}</Eyebrow>
              <h2 className="h-2 display" style={{ marginTop: 24 }}>{shared.whyHeadline}</h2>
            </div>
            <div>
              <p className="body" style={{ fontSize: 18, marginBottom: 24 }}>{a.why}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 56, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
                {shared.stats.map(s => (
                  <div key={s.l}>
                    <div className="numeral" style={{ fontSize: 64 }}>{s.n}</div>
                    <div className="small" style={{ marginTop: 16 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96 }}>
            <Eyebrow ochre>{shared.workEyebrow}</Eyebrow>
            <div>
              {shared.workItems.map((it, i) => (
                <a
                  key={i}
                  href="/news"
                  onClick={(e) => { e.preventDefault(); setPage('news'); }}
                  style={{ display: 'grid', gridTemplateColumns: '140px 1fr 240px 40px', gap: 24, padding: '28px 0', borderBottom: '1px solid var(--rule)', borderTop: i === 0 ? '1px solid var(--ink)' : 'none', alignItems: 'baseline', cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
                >
                  <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--ochre-2)', textTransform: 'uppercase' }}>{it.type}</span>
                  <div className="display" style={{ fontSize: 22, lineHeight: 1.2, fontWeight: 400 }}>{it.t}</div>
                  <span className="mono small">{it.d}</span>
                  <span aria-hidden="true" style={{ fontSize: 18, textAlign: 'right' }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section umber-bg">
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'flex-start' }}>
            <div>
              <Eyebrow dark>{shared.briefingEyebrow}</Eyebrow>
              <h2 className="h-1 display" style={{ marginTop: 24, color: 'var(--bone)' }}>
                Get the {a.title.toLowerCase()} <span className="italic" style={{ color: '#e6c97a' }}>briefing.</span>
              </h2>
              <p className="lead" style={{ color: 'rgba(236,225,200,0.78)', marginTop: 24 }}>{shared.briefingLead}</p>
            </div>
            <BriefingForm topic={a.title} />
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { AboutPage, WorkPage, IssuePage, BriefingForm, postJson });
