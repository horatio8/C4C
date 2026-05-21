// AEA + News + Donate + Contact (CMS-driven)

function AEAPage({ setPage }) {
  const a = C().aea;
  const sq = a.statusQuo;
  const [signed, setSigned] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const formRef = useRef(null);
  const matrixUrl = a.messagingMatrixUrl || '';
  const hasFlagshipNumbers = (a.petition.stats && a.petition.stats.length > 0);

  const scrollToForm = () => {
    if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  async function submitPetition(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const fd = new FormData(e.currentTarget);
    const ok = await postJson('/api/petition', {
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      email: fd.get('email'),
      postcode: fd.get('postcode'),
      mobile: fd.get('mobile'),
      consent: !!fd.get('consent'),
    });
    setBusy(false);
    if (ok) setSigned(true);
    else setErr('Submission failed. Please try again.');
  }

  return (
    <React.Fragment>
      <section style={{ background: '#0A1F44', color: '#f4f7fb', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.35 }} aria-hidden="true">
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
            {a.headerRight && (
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)' }}>
                {a.headerRight}
              </div>
            )}
          </div>
        </div>

        <div className="container-wide" style={{ padding: '88px var(--gutter) 112px', position: 'relative' }}>
          <div className="display italic" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#1FB5D8', fontWeight: 400, lineHeight: 1, marginBottom: 32 }}>
            {a.wordmark}
          </div>

          <h1 className="display" style={{ fontSize: 'clamp(56px, 8vw, 128px)', lineHeight: 0.92, letterSpacing: '-0.04em', fontWeight: 300, color: 'white' }}>
            {a.headline1Pre}{a.headline1Highlight && <span style={{ color: '#1FB5D8' }}>{a.headline1Highlight}</span>}{a.headline1Post}
            {a.headline2Italic && (<><br /><span className="italic">{a.headline2Italic}</span>{a.headline2Post}</>)}
            {a.headline3 && (<><br />{a.headline3}</>)}
          </h1>
          {a.lead && <p className="lead" style={{ marginTop: 40, color: 'rgba(255,255,255,0.85)', maxWidth: 720, fontSize: 22 }}>
            {a.lead}
          </p>}

          <div style={{ display: 'flex', gap: 14, marginTop: 56, flexWrap: 'wrap' }}>
            {a.ctaPrimary && <button type="button" className="btn" style={{ background: '#1FB5D8', color: '#0A1F44' }} onClick={scrollToForm}>
              {a.ctaPrimary}
            </button>}
            {matrixUrl && (
              <a href={matrixUrl} target="_blank" rel="noopener noreferrer">
                <button type="button" className="btn btn-outline-paper" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
                  {a.ctaSecondary || 'Read more'} ↗
                </button>
              </a>
            )}
          </div>
        </div>
      </section>

      {sq && (
        <section className="section">
          <div className="container-wide">
            <Eyebrow ochre>{sq.eyebrow || 'Why this matters'}</Eyebrow>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96, marginTop: 24 }}>
              <h2 className="display" style={{ fontSize: 'clamp(48px, 5vw, 88px)', lineHeight: 0.95, color: '#0A1F44', fontWeight: 300, letterSpacing: '-0.035em' }}>
                {sq.headline}
              </h2>
              <p className="body" style={{ fontSize: 18 }}>{sq.body}</p>
            </div>
            {sq.stats && sq.stats.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${sq.stats.length}, 1fr)`, gap: 0, marginTop: 80, borderTop: '1px solid var(--ink)' }}>
                {sq.stats.map((s, i) => (
                  <div key={i} style={{ padding: '40px 24px 0 0', borderRight: i < sq.stats.length - 1 ? '1px solid var(--rule)' : 'none', paddingLeft: i > 0 ? 32 : 0 }}>
                    <div className="display" style={{ fontSize: 'clamp(48px, 6vw, 88px)', color: '#0A1F44', lineHeight: 0.92, fontWeight: 300, letterSpacing: '-0.04em' }}>
                      {s.value}
                    </div>
                    {s.label && <div className="small" style={{ marginTop: 16 }}>{s.label}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section ref={formRef} style={{ background: '#f0f4fa', padding: '120px 0', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              {a.petition.topLabel && <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: '#0A1F44' }}>{a.petition.topLabel}</div>}
              <h2 className="h-1 display" style={{ marginTop: 24, color: '#0A1F44', fontWeight: 300 }}>
                {a.petition.headlinePre}<span className="italic">{a.petition.headlineItalic}</span>
              </h2>
              {a.petition.body && <p className="body" style={{ marginTop: 24, fontSize: 17 }}>{a.petition.body}</p>}
              {a.petition.statement && (
                <blockquote className="display italic" style={{ marginTop: 32, paddingLeft: 24, borderLeft: '3px solid #1FB5D8', fontSize: 22, color: '#0A1F44', fontWeight: 400, lineHeight: 1.35 }}>
                  {a.petition.statement}
                </blockquote>
              )}
              {hasFlagshipNumbers && (
                <div style={{ display: 'flex', gap: 40, marginTop: 48 }}>
                  {a.petition.stats.map(s => (
                    <div key={s[1]}>
                      <div className="display" style={{ fontSize: 40, color: '#0A1F44', lineHeight: 1, fontWeight: 300 }}>{s[0]}</div>
                      <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-3)', marginTop: 8 }}>{s[1]}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {signed ? (
              <div style={{ background: 'white', padding: 48, border: '1px solid var(--rule)' }}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: '#0A1F44', marginBottom: 16 }}>SIGNATURE RECEIVED</div>
                <h3 className="display" style={{ fontSize: 48, color: '#0A1F44', fontWeight: 300 }}>{a.petition.thanksTitle}</h3>
                <p className="body" style={{ marginTop: 16 }}>{a.petition.thanksBody}</p>
              </div>
            ) : (
              <form onSubmit={submitPetition} style={{ background: 'white', padding: 48, border: '1px solid var(--rule)' }}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: '#0A1F44', marginBottom: 32 }}>{a.petition.formTitle}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <label htmlFor="aea_first" className="label">First name</label>
                    <input id="aea_first" name="first_name" type="text" autoComplete="given-name" required placeholder=" " className="input" />
                  </div>
                  <div>
                    <label htmlFor="aea_last" className="label">Last name</label>
                    <input id="aea_last" name="last_name" type="text" autoComplete="family-name" required placeholder=" " className="input" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="aea_email" className="label">Email</label>
                    <input id="aea_email" name="email" type="email" autoComplete="email" required placeholder=" " className="input" />
                  </div>
                  <div>
                    <label htmlFor="aea_postcode" className="label">Postcode</label>
                    <input id="aea_postcode" name="postcode" type="text" inputMode="numeric" pattern="[0-9]{4}" autoComplete="postal-code" required placeholder=" " className="input" />
                  </div>
                  <div>
                    <label htmlFor="aea_mobile" className="label">Mobile (optional)</label>
                    <input id="aea_mobile" name="mobile" type="tel" autoComplete="tel" placeholder=" " className="input" />
                  </div>
                  <label style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13, color: 'var(--ink-3)', marginTop: 16 }}>
                    <input type="checkbox" name="consent" value="yes" defaultChecked style={{ marginTop: 4 }} /> {a.petition.consent}
                  </label>
                  {err && <div style={{ gridColumn: '1 / -1', color: '#9a1f1f', fontSize: 13 }}>{err}</div>}
                  <button type="submit" disabled={busy} className="btn" style={{ background: '#0A1F44', color: '#1FB5D8', gridColumn: '1 / -1', marginTop: 16 }}>
                    {busy ? 'Signing…' : a.petition.submitLabel}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

function NewsPage({ setPage }) {
  const n = C().news;
  const pageSize = n.pageSize || 8;
  const [filter, setFilter] = useState(n.filters[0] || 'All');
  const [q, setQ] = useState('');
  const [visible, setVisible] = useState(pageSize);

  useEffect(() => { setVisible(pageSize); }, [filter, q, pageSize]);

  const allByTag = filter === (n.filters[0] || 'All') ? n.items : n.items.filter(i => i.tag === filter);
  const ql = q.trim().toLowerCase();
  const filtered = ql
    ? allByTag.filter(it =>
        (it.title || '').toLowerCase().includes(ql) ||
        (it.body || '').toLowerCase().includes(ql) ||
        (it.tag || '').toLowerCase().includes(ql) ||
        (it.type || '').toLowerCase().includes(ql)
      )
    : allByTag;
  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={n.hero.photoKind} src={n.hero.photoUrl} alt="" eager label={n.hero.photoLabel} credit={n.hero.photoCredit} height={520}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 var(--gutter) 72px' }}>
            <div>
              <Eyebrow dark>{n.hero.eyebrow}</Eyebrow>
              <h1 className="h-display display" style={{ color: 'var(--bone)', marginTop: 28 }}>
                {n.hero.title1}{n.hero.titleItalic && (<><br /><span className="italic" style={{ color: '#e6c97a' }}>{n.hero.titleItalic}</span></>)}
              </h1>
            </div>
          </div>
        </Photo>
      </section>

      <section style={{ padding: '32px 0', background: 'var(--paper-warm)', borderBottom: '1px solid var(--rule)', position: 'sticky', top: 79, zIndex: 10 }}>
        <div className="container-wide" style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="eyebrow">Filter</div>
          <div role="tablist" aria-label="Filter by topic" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {n.filters.map(f => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
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
            <span className="mono small" aria-live="polite">{shown.length} of {filtered.length}</span>
            <label htmlFor="news_search" style={{ position: 'absolute', left: -9999 }}>Search news</label>
            <input
              id="news_search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="input"
              placeholder="Search…"
              style={{ width: 240, padding: '8px 12px', fontSize: 13, borderBottom: 'none', borderRadius: 999, border: '1px solid var(--rule-2)', background: 'var(--paper)' }}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          {shown.length === 0 && (
            <div className="body" style={{ padding: '64px 0', color: 'var(--ink-3)' }}>
              No items match. Try a different filter or search term.
            </div>
          )}
          {shown.map((it, i) => (
            <article key={i} style={{ display: 'grid', gridTemplateColumns: '140px 130px 1fr 160px', gap: 32, padding: '40px 0', borderBottom: '1px solid var(--rule)', borderTop: i === 0 ? '1px solid var(--ink)' : 'none', alignItems: 'flex-start' }}>
              <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--ochre-2)', textTransform: 'uppercase', paddingTop: 12 }}>{it.type}</span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', paddingTop: 12 }}>{it.date}</span>
              <div>
                <h3 className="display" style={{ fontSize: 28, lineHeight: 1.15, fontWeight: 400, letterSpacing: '-0.015em' }}>{it.title}</h3>
                <p className="body" style={{ fontSize: 14, marginTop: 14, maxWidth: 600 }}>{it.body}</p>
              </div>
              <span className="chip" style={{ alignSelf: 'flex-start', marginTop: 8 }}>{it.tag}</span>
            </article>
          ))}
          {hasMore && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
              <button type="button" className="btn btn-outline" onClick={() => setVisible(v => v + pageSize)}>
                See older posts ↓
              </button>
            </div>
          )}
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
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function handleStep2(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const fd = new FormData(e.currentTarget);
    const ok = await postJson('/api/donate-intent', {
      amount: Number(amount),
      recurring,
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      email: fd.get('email'),
      postcode: fd.get('postcode'),
      phone: fd.get('phone'),
      briefing: !!fd.get('briefing'),
    });
    setBusy(false);
    if (ok) setStep(3);
    else setErr('Submission failed. Please try again.');
  }

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={d.hero.photoKind} src={d.hero.photoUrl} alt="" eager label={d.hero.photoLabel} credit={d.hero.photoCredit} height={520}>
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
                  <button type="button" onClick={() => setRecurring(false)} aria-pressed={!recurring} className="btn" style={{ flex: 1, background: !recurring ? 'var(--ink)' : 'transparent', color: !recurring ? 'var(--paper)' : 'var(--ink)', border: '1px solid var(--ink)', justifyContent: 'center' }}>{d.oneTimeLabel}</button>
                  <button type="button" onClick={() => setRecurring(true)} aria-pressed={recurring} className="btn" style={{ flex: 1, background: recurring ? 'var(--ink)' : 'transparent', color: recurring ? 'var(--paper)' : 'var(--ink)', border: '1px solid var(--ink)', justifyContent: 'center' }}>{d.monthlyLabel}</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                  {d.presets.map(p => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setAmount(p)}
                      aria-pressed={amount === p}
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
                  <label htmlFor="donate_amount" className="label">{d.customLabel}</label>
                  <div style={{ position: 'relative' }}>
                    <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 14, fontFamily: 'var(--display)', fontSize: 20, color: 'var(--ink-3)' }}>$</span>
                    <input id="donate_amount" type="number" min="1" step="1" inputMode="numeric" className="input" value={amount} onChange={e => setAmount(e.target.value === '' ? 0 : Number(e.target.value))} style={{ paddingLeft: 24, fontFamily: 'var(--display)', fontSize: 22, fontWeight: 300 }} />
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
                <button type="button" onClick={() => setStep(2)} disabled={!amount || amount < 1} className="btn btn-primary" style={{ marginTop: 32 }}>Continue ↗</button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleStep2}>
                <Eyebrow ochre>Your details</Eyebrow>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
                  <div>
                    <label htmlFor="don_first" className="label">First name</label>
                    <input id="don_first" name="first_name" type="text" autoComplete="given-name" required placeholder=" " className="input" />
                  </div>
                  <div>
                    <label htmlFor="don_last" className="label">Last name</label>
                    <input id="don_last" name="last_name" type="text" autoComplete="family-name" required placeholder=" " className="input" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="don_email" className="label">Email</label>
                    <input id="don_email" name="email" type="email" autoComplete="email" required placeholder=" " className="input" />
                  </div>
                  <div>
                    <label htmlFor="don_post" className="label">Postcode</label>
                    <input id="don_post" name="postcode" type="text" inputMode="numeric" pattern="[0-9]{4}" autoComplete="postal-code" required placeholder=" " className="input" />
                  </div>
                  <div>
                    <label htmlFor="don_phone" className="label">Phone (optional)</label>
                    <input id="don_phone" name="phone" type="tel" autoComplete="tel" placeholder=" " className="input" />
                  </div>
                  {d.briefingConsent && (
                    <label style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13, color: 'var(--ink-3)', marginTop: 8 }}>
                      <input type="checkbox" name="briefing" value="yes" style={{ marginTop: 4 }} /> {d.briefingConsent}
                    </label>
                  )}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p className="small" style={{ color: 'var(--ink-3)' }}>
                      A real payment processor will be wired here before launch — this confirmation step records your intent only.
                    </p>
                  </div>
                </div>
                {err && <div style={{ marginTop: 16, color: '#9a1f1f', fontSize: 13 }}>{err}</div>}
                <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
                  <button type="button" onClick={() => setStep(1)} className="btn btn-outline">← Back</button>
                  <button type="submit" disabled={busy} className="btn btn-primary">{busy ? 'Submitting…' : `Donate $${amount}${recurring ? '/mo' : ''} ↗`}</button>
                </div>
              </form>
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
                    ABN ........... 82 201 923 025<br />
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
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const fd = new FormData(e.currentTarget);
    const ok = await postJson('/api/contact', {
      topic,
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      email: fd.get('email'),
      org: fd.get('org'),
      subject: fd.get('subject'),
      message: fd.get('message'),
      consent: !!fd.get('consent'),
    });
    setBusy(false);
    if (ok) setSent(true);
    else setErr('Submission failed. Please try again.');
  }

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={c.hero.photoKind} src={c.hero.photoUrl} alt="" eager label={c.hero.photoLabel} credit={c.hero.photoCredit} height={420}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 var(--gutter) 72px' }}>
            <div>
              <Eyebrow dark>{c.hero.eyebrow}</Eyebrow>
              <h1 className="h-display display" style={{ color: 'var(--bone)', marginTop: 28 }}>
                {c.hero.title1}{c.hero.titleItalic && (<><br /><span className="italic" style={{ color: '#e6c97a' }}>{c.hero.titleItalic}</span></>)}
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
              <p className="lead" style={{ marginTop: 24 }}>{c.intro.body}</p>
              {c.intro.footnote && (
                <div className="mono small" style={{ marginTop: 40, color: 'var(--ink-3)', lineHeight: 1.9, paddingTop: 32, borderTop: '1px solid var(--rule)', whiteSpace: 'pre-line' }}>
                  {c.intro.footnote}
                </div>
              )}
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
                <button type="button" onClick={() => setSent(false)} className="btn btn-outline" style={{ marginTop: 40 }}>{c.thanks.ctaLabel}</button>
              </div>
            ) : (
              <form onSubmit={submit} method="post" action="/api/contact" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: 56, border: '1px solid var(--ink)', background: 'var(--bone)' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span className="label">What's this about?</span>
                  <div role="radiogroup" aria-label="Topic" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {c.topics.map(tp => (
                      <button
                        type="button"
                        key={tp}
                        role="radio"
                        aria-checked={topic === tp}
                        onClick={() => setTopic(tp)}
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
                  <input type="hidden" name="topic" value={topic} />
                </div>
                <div>
                  <label htmlFor="ct_first" className="label">First name</label>
                  <input id="ct_first" name="first_name" type="text" autoComplete="given-name" required placeholder=" " className="input" />
                </div>
                <div>
                  <label htmlFor="ct_last" className="label">Last name</label>
                  <input id="ct_last" name="last_name" type="text" autoComplete="family-name" required placeholder=" " className="input" />
                </div>
                <div>
                  <label htmlFor="ct_email" className="label">Email</label>
                  <input id="ct_email" name="email" type="email" autoComplete="email" required placeholder=" " className="input" />
                </div>
                <div>
                  <label htmlFor="ct_org" className="label">Organisation (optional)</label>
                  <input id="ct_org" name="org" type="text" autoComplete="organization" placeholder=" " className="input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="ct_subject" className="label">Subject</label>
                  <input id="ct_subject" name="subject" type="text" required placeholder=" " className="input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="ct_msg" className="label">Your message</label>
                  <textarea id="ct_msg" name="message" rows={6} required placeholder=" " className="input" style={{ resize: 'vertical', minHeight: 140, lineHeight: 1.5, paddingTop: 14 }} />
                </div>
                <label style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13, color: 'var(--ink-3)' }}>
                  <input type="checkbox" name="consent" value="yes" style={{ marginTop: 4 }} /> {c.consent}
                </label>
                {err && <div style={{ gridColumn: '1 / -1', color: '#9a1f1f', fontSize: 13 }}>{err}</div>}
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--rule)' }}>
                  <span className="mono small" style={{ color: 'var(--ink-3)' }}>
                    Routed to: <span style={{ color: 'var(--ink)' }}>{topic}</span>
                  </span>
                  <button type="submit" disabled={busy} className="btn btn-primary">{busy ? 'Sending…' : c.submitLabel}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

function MediaPage({ setPage }) {
  const m = (C().media) || {};
  const hero = m.hero || {};
  const pageSize = m.pageSize || 12;

  const [items, setItems] = useState(null);
  const [err, setErr] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/media.json')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)))
      .then(setItems)
      .catch(e => setErr('Failed to load media: ' + e.message));
  }, []);

  const all = items || [];
  const types = ['All', ...Array.from(new Set(all.map(i => i.type).filter(Boolean)))];
  const tags = ['All', ...Array.from(new Set(all.map(i => i.tag).filter(Boolean)))];

  const ql = q.trim().toLowerCase();
  const filtered = all.filter(it => {
    if (typeFilter !== 'All' && it.type !== typeFilter) return false;
    if (tagFilter !== 'All' && it.tag !== tagFilter) return false;
    if (ql && !(
      (it.title || '').toLowerCase().includes(ql) ||
      (it.excerpt || '').toLowerCase().includes(ql) ||
      (it.body || '').toLowerCase().includes(ql)
    )) return false;
    return true;
  });
  const shown = filtered;

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={hero.photoKind || 'forest'} src={hero.photoUrl} alt="" eager label={hero.photoLabel} credit={hero.photoCredit} height={520}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 var(--gutter) 72px' }}>
            <div>
              <Eyebrow dark>{hero.eyebrow || 'Media & Webinars'}</Eyebrow>
              <h1 className="h-display display" style={{ color: 'var(--bone)', marginTop: 28 }}>
                {hero.title1 || 'Our work,'}{hero.titleItalic && (<><br /><span className="italic" style={{ color: '#e6c97a' }}>{hero.titleItalic}</span></>)}
              </h1>
            </div>
          </div>
        </Photo>
      </section>

      {m.intro && (
        <section className="section" style={{ paddingTop: 48, paddingBottom: 0 }}>
          <div className="container-wide">
            <p className="lead" style={{ maxWidth: 800 }}>{m.intro}</p>
          </div>
        </section>
      )}

      <section style={{ padding: '24px 0 32px', background: 'var(--paper-warm)', borderBottom: '1px solid var(--rule)', position: 'sticky', top: 79, zIndex: 10 }}>
        <div className="container-wide" style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', rowGap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div className="eyebrow">Type</div>
            <div role="tablist" aria-label="Filter by type" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {types.map(t => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={typeFilter === t}
                  onClick={() => setTypeFilter(t)}
                  style={{
                    padding: '6px 12px',
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    border: '1px solid var(--rule-2)',
                    borderRadius: 999,
                    background: typeFilter === t ? 'var(--ink)' : 'transparent',
                    color: typeFilter === t ? 'var(--bone)' : 'var(--ink-2)',
                    cursor: 'pointer',
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div className="eyebrow">Topic</div>
            <div role="tablist" aria-label="Filter by topic" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {tags.map(t => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tagFilter === t}
                  onClick={() => setTagFilter(t)}
                  style={{
                    padding: '6px 12px',
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    border: '1px solid var(--rule-2)',
                    borderRadius: 999,
                    background: tagFilter === t ? 'var(--ochre-2)' : 'transparent',
                    color: tagFilter === t ? 'var(--bone)' : 'var(--ink-2)',
                    cursor: 'pointer',
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
            <span className="mono small" aria-live="polite">{shown.length} item{shown.length === 1 ? '' : 's'}</span>
            <label htmlFor="media_search" style={{ position: 'absolute', left: -9999 }}>Search media</label>
            <input
              id="media_search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="input"
              placeholder="Search…"
              style={{ width: 220, padding: '8px 12px', fontSize: 13, borderBottom: 'none', borderRadius: 999, border: '1px solid var(--rule-2)', background: 'var(--paper)' }}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          {!items && !err && <div className="body" style={{ padding: '64px 0', color: 'var(--ink-3)' }}>Loading…</div>}
          {err && <div className="body" style={{ padding: '64px 0', color: '#9a1f1f' }}>{err}</div>}

          {items && filtered.length === 0 && (
            <div className="body" style={{ padding: '64px 0', color: 'var(--ink-3)' }}>
              No items match. Try a different filter or search term.
            </div>
          )}

          {items && filtered.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
              {shown.map((it, i) => {
                const card = (
                  <React.Fragment>
                    {it.imageUrl ? (
                      <img
                        src={it.imageUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block', background: 'var(--paper-warm)' }}
                      />
                    ) : (
                      <div className={`ph ph-${(it.tag || 'forest').toLowerCase() === 'energy' ? 'coast' : (it.tag || '').toLowerCase() === 'agriculture' ? 'wheat' : 'forest'}`} style={{ height: 200 }} />
                    )}
                    <div style={{ padding: '20px 0' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ochre-2)', textTransform: 'uppercase' }}>{it.type}</span>
                        <span style={{ color: 'var(--ink-4)' }}>·</span>
                        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{it.date}</span>
                        {it.tag && <><span style={{ color: 'var(--ink-4)' }}>·</span><span className="chip" style={{ fontSize: 10, padding: '3px 8px' }}>{it.tag}</span></>}
                      </div>
                      <h3 className="display" style={{ fontSize: 22, lineHeight: 1.2, fontWeight: 400, letterSpacing: '-0.01em', marginBottom: 12 }}>
                        {it.title}
                      </h3>
                      {it.excerpt && <p className="body" style={{ fontSize: 14, color: 'var(--ink-2)' }}>{it.excerpt}</p>}
                    </div>
                  </React.Fragment>
                );
                if (it.url) {
                  return (
                    <a key={it.id || i} href={it.url} target="_blank" rel="noopener noreferrer"
                       style={{ display: 'block', color: 'inherit', textDecoration: 'none', borderBottom: '1px solid var(--rule)', paddingBottom: 24 }}>
                      {card}
                    </a>
                  );
                }
                return (
                  <div key={it.id || i} style={{ borderBottom: '1px solid var(--rule)', paddingBottom: 24 }}>
                    {card}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { AEAPage, NewsPage, DonatePage, ContactPage, MediaPage });
