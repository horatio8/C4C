// AEA + News + Donate + Contact (CMS-driven)

function AEAPage() {
  const a = C().aea;
  const pillarKeys = Object.keys(a.pillars);
  const [pillar, setPillar] = useState(pillarKeys[0]);
  const p = a.pillars[pillar];

  return (
    <React.Fragment>
      <section style={{ background: '#0A1F44', color: '#f4f7fb', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
          <svg viewBox="0 0 1440 600" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
            <defs>
              <pattern id="aeagrid" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#1FB5D8" strokeWidth="0.4" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="1440" height="600" fill="url(#aeagrid)" />
          </svg>
        </div>

        <div className="container-wide" style={{ padding: '40px var(--gutter) 0', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.16em', color: '#1FB5D8' }}>
              {a.headerLeft}
            </div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)' }}>
              {a.headerRight}
            </div>
          </div>
        </div>

        <div className="container-wide" style={{ padding: '88px var(--gutter) 112px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div className="display italic" style={{ fontSize: 56, color: '#1FB5D8', fontWeight: 400, lineHeight: 1 }}>AEA</div>
            <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.2)' }} />
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)' }}>{a.wordmark}</div>
          </div>

          <h1 className="display" style={{ fontSize: 'clamp(64px, 8.5vw, 144px)', lineHeight: 0.92, letterSpacing: '-0.04em', fontWeight: 300, color: 'white' }}>
            {a.headline1Pre}<span style={{ color: '#1FB5D8' }}>{a.headline1Highlight}</span>{a.headline1Post}<br />
            <span className="italic">{a.headline2Italic}</span>{a.headline2Post}<br />
            {a.headline3}
          </h1>
          <p className="lead" style={{ marginTop: 40, color: 'rgba(255,255,255,0.85)', maxWidth: 720, fontSize: 24 }}>
            {a.lead}
          </p>

          <div style={{ display: 'flex', gap: 14, marginTop: 56, flexWrap: 'wrap' }}>
            <button className="btn" style={{ background: '#1FB5D8', color: '#0A1F44' }}>{a.ctaPrimary}</button>
            <button className="btn btn-outline-paper" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>{a.ctaSecondary}</button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <Eyebrow ochre>{a.pillarsEyebrow}</Eyebrow>
          <div style={{ display: 'flex', gap: 0, marginTop: 32, marginBottom: 64 }}>
            {pillarKeys.map(k => (
              <button key={k}
                onClick={() => setPillar(k)}
                className={`pillar-tab ${pillar === k ? 'active' : ''}`}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', opacity: 0.7 }}>{a.pillars[k].eyebrow}</div>
                <div className="display" style={{ fontSize: 30, marginTop: 12, fontWeight: 400 }}>{a.pillars[k].headline}</div>
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96 }}>
            <div>
              <h2 className="display" style={{ fontSize: 'clamp(48px, 5vw, 80px)', lineHeight: 0.95, color: '#0A1F44', fontWeight: 300, letterSpacing: '-0.035em' }}>
                {p.headline}.
              </h2>
              <p className="lead" style={{ marginTop: 32 }}>{p.sub}</p>
            </div>
            <div>
              {p.points.map((pt, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, padding: '36px 0', borderBottom: '1px solid var(--rule)', borderTop: i === 0 ? '1px solid var(--ink)' : 'none', alignItems: 'baseline' }}>
                  <div className="display" style={{ fontSize: 64, color: '#0A1F44', lineHeight: 0.92, fontWeight: 300, letterSpacing: '-0.04em' }}>{pt[0]}</div>
                  <div className="body" style={{ fontSize: 16 }}>{pt[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#f0f4fa', padding: '120px 0', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: '#0A1F44' }}>{a.petition.topLabel}</div>
              <h2 className="h-1 display" style={{ marginTop: 24, color: '#0A1F44', fontWeight: 300 }}>
                {a.petition.headlinePre}<span className="italic">{a.petition.headlineItalic}</span>
              </h2>
              <p className="body" style={{ marginTop: 24, fontSize: 17 }}>{a.petition.body}</p>
              <div style={{ display: 'flex', gap: 40, marginTop: 48 }}>
                {a.petition.stats.map(s => (
                  <div key={s[1]}>
                    <div className="display" style={{ fontSize: 40, color: '#0A1F44', lineHeight: 1, fontWeight: 300 }}>{s[0]}</div>
                    <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-3)', marginTop: 8 }}>{s[1]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'white', padding: 48, border: '1px solid var(--rule)' }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: '#0A1F44', marginBottom: 32 }}>{a.petition.formTitle}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div><label className="label">First name</label><input className="input" /></div>
                <div><label className="label">Last name</label><input className="input" /></div>
                <div style={{ gridColumn: '1 / -1' }}><label className="label">Email</label><input className="input" /></div>
                <div><label className="label">Postcode</label><input className="input" /></div>
                <div><label className="label">Mobile (optional)</label><input className="input" /></div>
                <label style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13, color: 'var(--ink-3)', marginTop: 16 }}>
                  <input type="checkbox" style={{ marginTop: 4 }} defaultChecked /> {a.petition.consent}
                </label>
                <button className="btn" style={{ background: '#0A1F44', color: '#1FB5D8', gridColumn: '1 / -1', marginTop: 16 }}>
                  {a.petition.submitLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

function NewsPage() {
  const n = C().news;
  const [filter, setFilter] = useState(n.filters[0] || 'All');
  const filtered = filter === (n.filters[0] || 'All') ? n.items : n.items.filter(i => i.tag === filter);

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={n.hero.photoKind} label={n.hero.photoLabel} credit={n.hero.photoCredit} height={520}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 var(--gutter) 72px' }}>
            <div>
              <Eyebrow dark>{n.hero.eyebrow}</Eyebrow>
              <h1 className="h-display display" style={{ color: 'var(--bone)', marginTop: 28 }}>
                {n.hero.title1}<br /><span className="italic" style={{ color: '#e6c97a' }}>{n.hero.titleItalic}</span>
              </h1>
            </div>
          </div>
        </Photo>
      </section>

      <section style={{ padding: '32px 0', background: 'var(--paper-warm)', borderBottom: '1px solid var(--rule)', position: 'sticky', top: 79, zIndex: 10 }}>
        <div className="container-wide" style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="eyebrow">Filter</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {n.filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '8px 16px',
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: '1px solid var(--rule-2)',
                  borderRadius: 999,
                  background: filter === f ? 'var(--ink)' : 'transparent',
                  color: filter === f ? 'var(--bone)' : 'var(--ink-2)',
                  cursor: 'pointer',
                }}>
                {f}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
            <span className="mono small">{filtered.length} items</span>
            <input className="input" placeholder="Search…" style={{ width: 240, padding: '8px 12px', fontSize: 13, borderBottom: 'none', borderRadius: 999, border: '1px solid var(--rule-2)', background: 'var(--paper)' }} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          {filtered.map((it, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 130px 1fr 160px 60px', gap: 32, padding: '40px 0', borderBottom: '1px solid var(--rule)', borderTop: i === 0 ? '1px solid var(--ink)' : 'none', alignItems: 'flex-start', cursor: 'pointer' }}>
              <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--ochre-2)', textTransform: 'uppercase', paddingTop: 12 }}>{it.type}</span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', paddingTop: 12 }}>{it.date}</span>
              <div>
                <h3 className="display" style={{ fontSize: 28, lineHeight: 1.15, fontWeight: 400, letterSpacing: '-0.015em' }}>{it.title}</h3>
                <p className="body" style={{ fontSize: 14, marginTop: 14, maxWidth: 600 }}>{it.body}</p>
              </div>
              <span className="chip" style={{ alignSelf: 'flex-start', marginTop: 8 }}>{it.tag}</span>
              <span style={{ fontSize: 22, textAlign: 'right', paddingTop: 8 }}>↗</span>
            </div>
          ))}
        </div>
      </section>
    </React.Fragment>
  );
}

function DonatePage() {
  const d = C().donate;
  const [amount, setAmount] = useState(d.presets[1] || 100);
  const [recurring, setRecurring] = useState(true);
  const [step, setStep] = useState(1);

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={d.hero.photoKind} label={d.hero.photoLabel} credit={d.hero.photoCredit} height={520}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 var(--gutter) 72px' }}>
            <div>
              <Eyebrow dark>{d.hero.eyebrow}</Eyebrow>
              <h1 className="h-display display" style={{ color: 'var(--bone)', marginTop: 28, maxWidth: 1100 }}>
                {d.hero.headlinePre}<span className="italic" style={{ color: '#e6c97a' }}>{d.hero.headlineItalic}</span>{d.hero.headlinePost}
              </h1>
            </div>
          </div>
        </Photo>
      </section>

      <section style={{ background: 'var(--paper-warm)', borderBottom: '1px solid var(--rule)' }}>
        <div className="container-wide" style={{ padding: '80px var(--gutter)' }}>
          <div style={{ display: 'flex', gap: 0, marginBottom: 56, borderBottom: '1px solid var(--rule)' }}>
            {d.stepLabels.map((s, i) => (
              <div key={s} style={{ flex: 1, padding: '24px 0', borderBottom: step === i + 1 ? '2px solid var(--ink)' : 'none', marginBottom: -1 }}>
                <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: step === i + 1 ? 'var(--ink)' : 'var(--ink-4)', textTransform: 'uppercase' }}>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'flex-start' }}>
            {step === 1 && (
              <div>
                <Eyebrow ochre>{d.amountEyebrow}</Eyebrow>
                <div style={{ display: 'flex', gap: 12, marginTop: 24, marginBottom: 32 }}>
                  <button onClick={() => setRecurring(false)} className="btn" style={{ flex: 1, background: !recurring ? 'var(--ink)' : 'transparent', color: !recurring ? 'var(--paper)' : 'var(--ink)', border: '1px solid var(--ink)', justifyContent: 'center' }}>{d.oneTimeLabel}</button>
                  <button onClick={() => setRecurring(true)} className="btn" style={{ flex: 1, background: recurring ? 'var(--ink)' : 'transparent', color: recurring ? 'var(--paper)' : 'var(--ink)', border: '1px solid var(--ink)', justifyContent: 'center' }}>{d.monthlyLabel}</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                  {d.presets.map(p => (
                    <button key={p} onClick={() => setAmount(p)}
                      style={{
                        padding: '36px 0',
                        border: '1px solid ' + (amount === p ? 'var(--ink)' : 'var(--rule-2)'),
                        background: amount === p ? 'var(--paper)' : 'transparent',
                        cursor: 'pointer',
                      }}>
                      <div className="display" style={{ fontSize: 40, fontWeight: 300, lineHeight: 1 }}>${p}</div>
                      {recurring && <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-3)', marginTop: 6 }}>/MONTH</div>}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="label">{d.customLabel}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, top: 14, fontFamily: 'var(--display)', fontSize: 20, color: 'var(--ink-3)' }}>$</span>
                    <input className="input" value={amount} onChange={e => setAmount(e.target.value)} style={{ paddingLeft: 24, fontFamily: 'var(--display)', fontSize: 22, fontWeight: 300 }} />
                  </div>
                </div>
                <div style={{ marginTop: 40, padding: 28, background: 'var(--paper)', border: '1px solid var(--rule)' }}>
                  <div className="eyebrow" style={{ marginBottom: 12 }}>What ${amount}{recurring ? '/mo' : ''} funds</div>
                  <p className="body italic" style={{ fontSize: 18, fontFamily: 'var(--display)', color: 'var(--ink)', fontWeight: 300 }}>
                    {amount < 100 && d.fundsLabels.under100}
                    {amount >= 100 && amount < 500 && d.fundsLabels.under500}
                    {amount >= 500 && amount < 2500 && d.fundsLabels.under2500}
                    {amount >= 2500 && d.fundsLabels.over2500}
                  </p>
                </div>
                <button onClick={() => setStep(2)} className="btn btn-primary" style={{ marginTop: 32 }}>Continue ↗</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <Eyebrow ochre>Your details</Eyebrow>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
                  <div><label className="label">First name</label><input className="input" /></div>
                  <div><label className="label">Last name</label><input className="input" /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label className="label">Email</label><input className="input" type="email" /></div>
                  <div><label className="label">Postcode</label><input className="input" /></div>
                  <div><label className="label">Phone (optional)</label><input className="input" /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label className="label">Card details</label><input className="input" placeholder="•••• •••• •••• ••••" /></div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
                  <button onClick={() => setStep(1)} className="btn btn-outline">← Back</button>
                  <button onClick={() => setStep(3)} className="btn btn-primary">Donate ${amount}{recurring ? '/mo' : ''} ↗</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="display italic" style={{ fontSize: 88, color: 'var(--terracotta-2)', fontWeight: 300, lineHeight: 0.9 }}>{d.thankYou}</div>
                <p className="lead" style={{ marginTop: 32 }}>{d.thankYouBody}</p>
                <div style={{ marginTop: 48, padding: 28, background: 'var(--paper)', border: '1px solid var(--rule)' }}>
                  <div className="eyebrow eyebrow-ochre" style={{ marginBottom: 16 }}>Receipt summary</div>
                  <div className="mono" style={{ fontSize: 13, lineHeight: 1.9 }}>
                    AMOUNT ........ ${amount} AUD<br />
                    FREQUENCY ..... {recurring ? 'Monthly' : 'One-time'}<br />
                    DGR STATUS .... Tax-deductible (donations over $2)<br />
                    ABN ........... 84 638 274 922<br />
                    REF NO ........ C4C-2026-{String(Math.floor(Math.random() * 99999)).padStart(5, '0')}
                  </div>
                </div>
              </div>
            )}

            <aside style={{ position: 'sticky', top: 96 }}>
              <Eyebrow ochre>{d.trustEyebrow}</Eyebrow>
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--ink)' }}>
                {d.trustItems.map(t => (
                  <div key={t[0]} style={{ padding: '24px 0', borderBottom: '1px solid var(--rule)' }}>
                    <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--ochre-2)', textTransform: 'uppercase', marginBottom: 8 }}>{t[0]}</div>
                    <p className="small">{t[1]}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

function ContactPage() {
  const c = C().contact;
  const [topic, setTopic] = useState(c.topics[0]);
  const [sent, setSent] = useState(false);

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={c.hero.photoKind} label={c.hero.photoLabel} credit={c.hero.photoCredit} height={420}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 var(--gutter) 72px' }}>
            <div>
              <Eyebrow dark>{c.hero.eyebrow}</Eyebrow>
              <h1 className="h-display display" style={{ color: 'var(--bone)', marginTop: 28 }}>
                {c.hero.title1}<br /><span className="italic" style={{ color: '#e6c97a' }}>{c.hero.titleItalic}</span>
              </h1>
            </div>
          </div>
        </Photo>
      </section>

      <section className="section">
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 96, alignItems: 'flex-start' }}>
            <div>
              <Eyebrow ochre>{c.intro.eyebrow}</Eyebrow>
              <h2 className="h-2 display" style={{ marginTop: 24 }}>
                {c.intro.headlinePre}<span className="italic">{c.intro.headlineItalic}</span>
              </h2>
              <p className="body" style={{ marginTop: 24 }}>{c.intro.body}</p>
              <div className="mono small" style={{ marginTop: 40, color: 'var(--ink-3)', lineHeight: 1.9, paddingTop: 32, borderTop: '1px solid var(--rule)', whiteSpace: 'pre-line' }}>
                {c.intro.footnote}
              </div>
            </div>

            {sent ? (
              <div style={{ padding: '64px 56px', border: '1px solid var(--ink)', background: 'var(--bone)' }}>
                <Eyebrow ochre>{c.thanks.eyebrow}</Eyebrow>
                <div className="display" style={{ fontSize: 64, lineHeight: 0.95, marginTop: 24 }}>
                  {c.thanks.title}
                </div>
                <p className="lead" style={{ marginTop: 24, maxWidth: 480 }}>
                  {c.thanks.body} <span className="mono" style={{ background: 'var(--ink)', color: 'var(--bone)', padding: '2px 8px', fontSize: 13 }}>{c.thanks.urgentLabel}</span>.
                </p>
                <button onClick={() => setSent(false)} className="btn btn-outline" style={{ marginTop: 40 }}>{c.thanks.ctaLabel}</button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: 56, border: '1px solid var(--ink)', background: 'var(--bone)' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="label">What's this about?</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {c.topics.map(tp => (
                      <button type="button" key={tp} onClick={() => setTopic(tp)}
                        style={{
                          padding: '8px 16px',
                          fontFamily: 'var(--mono)',
                          fontSize: 11,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          border: '1px solid ' + (topic === tp ? 'var(--ink)' : 'var(--rule-2)'),
                          background: topic === tp ? 'var(--ink)' : 'transparent',
                          color: topic === tp ? 'var(--bone)' : 'var(--ink-2)',
                          cursor: 'pointer',
                        }}>
                        {tp}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">First name</label>
                  <input className="input" required />
                </div>
                <div>
                  <label className="label">Last name</label>
                  <input className="input" required />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" required />
                </div>
                <div>
                  <label className="label">Organisation (optional)</label>
                  <input className="input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Subject</label>
                  <input className="input" required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Your message</label>
                  <textarea className="input" rows={6} required style={{ resize: 'vertical', minHeight: 140, lineHeight: 1.5, paddingTop: 14 }} />
                </div>
                <label style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13, color: 'var(--ink-3)' }}>
                  <input type="checkbox" style={{ marginTop: 4 }} /> {c.consent}
                </label>
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--rule)' }}>
                  <span className="mono small" style={{ color: 'var(--ink-3)' }}>
                    Routed to: <span style={{ color: 'var(--ink)' }}>{topic}</span>
                  </span>
                  <button type="submit" className="btn btn-primary">{c.submitLabel}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { AEAPage, NewsPage, DonatePage, ContactPage });
