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
    try {
      const r = await fetch('/api/petition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          first_name: fd.get('first_name') || '',
          last_name: fd.get('last_name') || '',
          email: fd.get('email') || '',
          phone: fd.get('phone') || '',
          postcode: fd.get('postcode') || '',
          whysigned: fd.get('whysigned') || '',
        }),
      });
      if (!r.ok) {
        let detail = '';
        try { const j = await r.json(); detail = j && (j.message || j.error || '') || ''; } catch {}
        setErr(detail || `Submission failed (HTTP ${r.status}). Please try again.`);
      } else {
        setSigned(true);
      }
    } catch (ex) {
      setErr('Network error — please try again.');
    } finally {
      setBusy(false);
    }
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
              <div className="aea-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 32, rowGap: 56, marginTop: 80, borderTop: '1px solid var(--ink)', paddingTop: 8 }}>
                {sq.stats.map((s, i) => (
                  <div key={i} style={{ paddingTop: 32, display: 'flex', flexDirection: 'column' }}>
                    <div className="display" style={{ fontSize: 'clamp(40px, 4vw, 64px)', color: '#0A1F44', lineHeight: 0.92, fontWeight: 300, letterSpacing: '-0.04em' }}>
                      {s.value}
                    </div>
                    {s.label && <div className="small" style={{ marginTop: 16 }}>{s.label}</div>}
                    {s.source && <div className="mono" style={{ marginTop: 'auto', paddingTop: 16, fontSize: 10, lineHeight: 1.45, color: 'var(--ink-4)', letterSpacing: '0.02em' }}>{s.source}</div>}
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
                {a.petition.headlinePre}{a.petition.headlineItalic && (<><br /><span className="italic">{a.petition.headlineItalic}</span></>)}
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
                    <label htmlFor="aea_first" className="label">First name <span aria-hidden="true" style={{ color: '#c44' }}>*</span></label>
                    <input id="aea_first" name="first_name" type="text" autoComplete="given-name" required placeholder=" " className="input" />
                  </div>
                  <div>
                    <label htmlFor="aea_last" className="label">Last name <span aria-hidden="true" style={{ color: '#c44' }}>*</span></label>
                    <input id="aea_last" name="last_name" type="text" autoComplete="family-name" required placeholder=" " className="input" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="aea_email" className="label">Email <span aria-hidden="true" style={{ color: '#c44' }}>*</span></label>
                    <input id="aea_email" name="email" type="email" autoComplete="email" required placeholder=" " className="input" />
                  </div>
                  <div>
                    <label htmlFor="aea_postcode" className="label">Postcode (optional)</label>
                    <input id="aea_postcode" name="postcode" type="text" inputMode="numeric" pattern="[0-9]{4}" autoComplete="postal-code" placeholder=" " className="input" />
                  </div>
                  <div>
                    <label htmlFor="aea_phone" className="label">Phone (optional)</label>
                    <input id="aea_phone" name="phone" type="tel" autoComplete="tel" placeholder=" " className="input" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="aea_whysigned" className="label">Why I signed (optional)</label>
                    <textarea id="aea_whysigned" name="whysigned" rows={4} placeholder=" " className="input" style={{ resize: 'vertical', minHeight: 96, lineHeight: 1.5, paddingTop: 14 }} />
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

// Stripe payment links — LIVE. acct_1KSyH4B1lSf62lWQ (Coalition for Conservation).
// All charges tagged metadata.campaign=C4C; receipts emailed by Stripe.
const STRIPE_LINKS = {
  once: {
    50:    'https://donate.stripe.com/5kQ4gy2LWgKN1f65280gw0F',
    100:   'https://donate.stripe.com/4gMbJ086g2TXe1S2U00gw0G',
    250:   'https://donate.stripe.com/28E4gyaeocuxe1SgKQ0gw0H',
    1000:  'https://donate.stripe.com/3cIbJ04U4fGJ7DugKQ0gw0I',
    other: 'https://donate.stripe.com/28EcN4bis669e1S1PW0gw0N',
  },
  month: {
    50:    'https://buy.stripe.com/14AfZg5Y8dyBaPGeCI0gw0J',
    100:   'https://buy.stripe.com/14A6oG5Y83Y1e1S66c0gw0K',
    250:   'https://buy.stripe.com/4gMbJ0aeo1PT0b2dyE0gw0L',
    1000:  'https://buy.stripe.com/aFabJ0aeodyB3ne2U00gw0M',
    // Stripe doesn't allow custom amounts on subscriptions — no "other" here.
  },
};

function DonatePage() {
  const d = C().donate;
  const [recurring, setRecurring] = useState(true);

  // Read ?status=success&amount=…&freq=… for the thank-you state
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const success = params.get('status') === 'success';
  const successAmount = params.get('amount') || '';
  const successFreq = (params.get('freq') || '').toLowerCase();
  const successRecurring = successFreq === 'month' || successFreq === 'monthly';

  const presets = recurring ? [50, 100, 250, 1000] : [50, 100, 250, 1000, 'other'];

  const goToStripe = (key) => {
    const freq = recurring ? 'month' : 'once';
    const url = STRIPE_LINKS[freq][key];
    if (!url) return;
    // Tag the Checkout Session so the Stripe webhook can resolve the Site
    // (AEA vs Coalition) when writing into Airtable. The value flows through
    // to Checkout Session.client_reference_id and is preserved on the
    // donor's return-URL too.
    const ref = encodeURIComponent('coalition.affordableenergy.org.au');
    window.location.href = url + (url.includes('?') ? '&' : '?') + `client_reference_id=${ref}`;
  };

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
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'flex-start' }}>
            {success ? (
              <div>
                <div className="display italic" style={{ fontSize: 88, color: 'var(--terracotta-2)', fontWeight: 300, lineHeight: 0.9 }}>{d.thankYou}</div>
                <p className="lead" style={{ marginTop: 32 }}>{d.thankYouBody}</p>
                {(successAmount || successFreq) && (
                  <div style={{ marginTop: 48, padding: 28, background: 'var(--paper)', border: '1px solid var(--rule)' }}>
                    <div className="eyebrow eyebrow-ochre" style={{ marginBottom: 16 }}>Receipt summary</div>
                    <div className="mono" style={{ fontSize: 13, lineHeight: 2 }}>
                      {[
                        successAmount && ['Amount', `$${successAmount} AUD`],
                        successFreq && ['Frequency', successRecurring ? 'Monthly' : 'One-time'],
                        ['DGR status', 'Tax-deductible (donations over $2)'],
                        ['ABN', '82 201 923 025'],
                      ].filter(Boolean).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', gap: 16 }}>
                          <span style={{ width: 120, flex: '0 0 auto', color: 'var(--ink-soft, #6b6b5e)' }}>{k}</span>
                          <span>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Eyebrow ochre>{d.amountEyebrow}</Eyebrow>
                <div style={{ display: 'flex', gap: 12, marginTop: 24, marginBottom: 32 }}>
                  <button type="button" onClick={() => setRecurring(false)} aria-pressed={!recurring} className="btn" style={{ flex: 1, background: !recurring ? 'var(--ink)' : 'transparent', color: !recurring ? 'var(--paper)' : 'var(--ink)', border: '1px solid var(--ink)', justifyContent: 'center' }}>{d.oneTimeLabel}</button>
                  <button type="button" onClick={() => setRecurring(true)} aria-pressed={recurring} className="btn" style={{ flex: 1, background: recurring ? 'var(--ink)' : 'transparent', color: recurring ? 'var(--paper)' : 'var(--ink)', border: '1px solid var(--ink)', justifyContent: 'center' }}>{d.monthlyLabel}</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${presets.length}, 1fr)`, gap: 12 }}>
                  {presets.map(p => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => goToStripe(p)}
                      style={{
                        padding: '36px 0',
                        border: '1px solid var(--rule-2)',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.15s, border-color 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--paper)'; e.currentTarget.style.borderColor = 'var(--ink)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--rule-2)'; }}
                    >
                      <div className="display" style={{ fontSize: p === 'other' ? 32 : 40, fontWeight: 300, lineHeight: 1 }}>
                        {p === 'other' ? 'Other' : `$${p}`}
                      </div>
                      {recurring && p !== 'other' && <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-3)', marginTop: 6 }}>/MONTH</div>}
                    </button>
                  ))}
                </div>
                <p className="small" style={{ color: 'var(--ink-3)', marginTop: 24 }}>
                  Secure checkout via Stripe. {recurring ? 'Monthly donations can be cancelled any time from your Stripe receipt email.' : 'Choose "Other" to enter a custom amount on the next screen.'}
                </p>
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

  // Map our topic labels to the Nucleus form's `type` field values.
  const TOPIC_TO_TYPE = {
    'General enquiry': 'general',
    'Press & media': 'Press',
    'Partnerships': 'Partnerships',
    'Donations & giving': 'Donations',
    'Speaking & events': 'speaking',
    'Other': 'Other',
  };

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const fd = new FormData(e.currentTarget);
    const payload = {
      first_name: fd.get('first_name') || '',
      last_name: fd.get('last_name') || '',
      email: fd.get('email') || '',
      organisation: fd.get('organisation') || '',
      subject: fd.get('subject') || '',
      message: fd.get('message') || '',
      type: TOPIC_TO_TYPE[topic] || topic,
    };
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        let detail = '';
        try { const j = await r.json(); detail = j && (j.message || j.error || '') || ''; } catch {}
        setErr(detail || `Submission failed (HTTP ${r.status}). Please try again.`);
      } else {
        setSent(true);
      }
    } catch (ex) {
      setErr('Network error — please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={c.hero.photoKind} src={c.hero.photoUrl} alt="" eager label={c.hero.photoLabel} credit={c.hero.photoCredit} height={520}>
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
                  {c.thanks.body}
                </p>
                <button type="button" onClick={() => setSent(false)} className="btn btn-outline" style={{ marginTop: 40 }}>{c.thanks.ctaLabel}</button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: 56, border: '1px solid var(--ink)', background: 'var(--bone)' }}>
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
                  <label htmlFor="ct_first" className="label">First name <span aria-hidden="true" style={{ color: '#c44' }}>*</span></label>
                  <input id="ct_first" name="first_name" type="text" autoComplete="given-name" required placeholder=" " className="input" />
                </div>
                <div>
                  <label htmlFor="ct_last" className="label">Last name <span aria-hidden="true" style={{ color: '#c44' }}>*</span></label>
                  <input id="ct_last" name="last_name" type="text" autoComplete="family-name" required placeholder=" " className="input" />
                </div>
                <div>
                  <label htmlFor="ct_email" className="label">Email <span aria-hidden="true" style={{ color: '#c44' }}>*</span></label>
                  <input id="ct_email" name="email" type="email" autoComplete="email" required placeholder=" " className="input" />
                </div>
                <div>
                  <label htmlFor="ct_org" className="label">Organisation (optional)</label>
                  <input id="ct_org" name="organisation" type="text" autoComplete="organization" placeholder=" " className="input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="ct_subject" className="label">Subject <span aria-hidden="true" style={{ color: '#c44' }}>*</span></label>
                  <input id="ct_subject" name="subject" type="text" required placeholder=" " className="input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="ct_msg" className="label">Your message <span aria-hidden="true" style={{ color: '#c44' }}>*</span></label>
                  <textarea id="ct_msg" name="message" rows={6} required placeholder=" " className="input" style={{ resize: 'vertical', minHeight: 140, lineHeight: 1.5, paddingTop: 14 }} />
                </div>
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
  const [catFilter, setCatFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');
  const [q, setQ] = useState('');
  const [visible, setVisible] = useState(pageSize);

  useEffect(() => {
    fetch('/media.json')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)))
      .then(setItems)
      .catch(e => setErr('Failed to load media: ' + e.message));
  }, []);

  useEffect(() => { setVisible(pageSize); }, [catFilter, tagFilter, q, pageSize]);

  const all = items || [];
  // Category tabs (Interview / Comment / Press Release / Media), in fixed order.
  const CAT_ORDER = ['Interview', 'Comment', 'Press Release', 'Media'];
  const presentCats = Array.from(new Set(all.map(i => i.category).filter(Boolean)));
  const cats = ['All', ...CAT_ORDER.filter(c => presentCats.includes(c)), ...presentCats.filter(c => !CAT_ORDER.includes(c))];
  // Topic order: known pillars first, then Other last.
  const TAG_ORDER = ['Energy', 'Agriculture', 'Biodiversity', 'Other'];
  const presentTags = Array.from(new Set(all.map(i => i.tag).filter(Boolean)));
  const tags = ['All', ...TAG_ORDER.filter(t => presentTags.includes(t)), ...presentTags.filter(t => !TAG_ORDER.includes(t))];

  const ql = q.trim().toLowerCase();
  const filtered = all.filter(it => {
    if (catFilter !== 'All' && it.category !== catFilter) return false;
    if (tagFilter !== 'All' && it.tag !== tagFilter) return false;
    if (ql && !(
      (it.title || '').toLowerCase().includes(ql) ||
      (it.excerpt || '').toLowerCase().includes(ql) ||
      (it.body || '').toLowerCase().includes(ql)
    )) return false;
    return true;
  });
  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const olderStep = m.olderStep || 6;

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={hero.photoKind || 'forest'} src={hero.photoUrl} alt="" eager imgPosition={hero.imgPosition || 'center 32%'} label={hero.photoLabel} credit={hero.photoCredit} height={520}>
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
        <section className="section" style={{ paddingTop: 48, paddingBottom: 56 }}>
          <div className="container-wide">
            <p className="lead" style={{ maxWidth: 800 }}>{m.intro}</p>
          </div>
        </section>
      )}

      <section style={{ padding: '24px 0 32px', background: 'var(--paper-warm)', borderBottom: '1px solid var(--rule)', position: 'sticky', top: 79, zIndex: 10 }}>
        <div className="container-wide" style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', rowGap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div className="eyebrow">Category</div>
            <div role="tablist" aria-label="Filter by category" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {cats.map(t => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={catFilter === t}
                  onClick={() => setCatFilter(t)}
                  style={{
                    padding: '6px 12px',
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    border: '1px solid var(--rule-2)',
                    borderRadius: 999,
                    background: catFilter === t ? 'var(--ink)' : 'transparent',
                    color: catFilter === t ? 'var(--bone)' : 'var(--ink-2)',
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
                return (
                  <a
                    key={it.id || i}
                    href={`/media/${it.id}`}
                    onClick={(e) => { e.preventDefault(); setPage('article:' + it.id); }}
                    style={{ display: 'block', color: 'inherit', textDecoration: 'none', borderBottom: '1px solid var(--rule)', paddingBottom: 24 }}>
                    {card}
                  </a>
                );
              })}
            </div>
          )}

          {hasMore && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 56 }}>
              <button type="button" className="btn btn-outline" onClick={() => setVisible(v => v + olderStep)}>
                See older posts ↓
              </button>
            </div>
          )}
        </div>
      </section>
    </React.Fragment>
  );
}

function MediaArticlePage({ slug, setPage }) {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch('/media.json')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)))
      .then(setItems)
      .catch(e => setErr('Failed to load: ' + e.message));
  }, []);

  const item = items && items.find(x => x.id === slug);

  useEffect(() => {
    if (item) document.title = item.title + ' — ' + C().site.title;
  }, [item]);

  if (!items && !err) return <div className="section"><div className="container-wide"><p className="body" style={{ color: 'var(--ink-3)' }}>Loading…</p></div></div>;
  if (err) return <div className="section"><div className="container-wide"><p className="body" style={{ color: '#9a1f1f' }}>{err}</p></div></div>;
  if (!item) {
    return (
      <section className="section">
        <div className="container-wide">
          <Eyebrow ochre>Not found</Eyebrow>
          <h1 className="h-1 display" style={{ marginTop: 16 }}>That article doesn't exist.</h1>
          <button type="button" className="btn btn-outline" style={{ marginTop: 24 }} onClick={() => setPage('media')}>← Back to Media &amp; Webinars</button>
        </div>
      </section>
    );
  }

  const paras = (item.body || '').split('\n\n').filter(p => p.trim());

  return (
    <article>
      {/* Text-only header band — no stretched cover image, so portrait
          photos are never cropped into a banner. */}
      <section className="umber-bg" style={{ padding: '56px 0 48px' }}>
        <div className="container-wide" style={{ maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
          <a href="/media-and-webinars" onClick={(e) => { e.preventDefault(); setPage('media'); }}
             className="mono" style={{ fontSize: 12, letterSpacing: '0.1em', color: '#e6c97a', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', marginBottom: 28 }}>
            ← Media &amp; Webinars
          </a>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: '#e6c97a', textTransform: 'uppercase' }}>{item.type}</span>
            <span style={{ color: 'rgba(236,225,200,0.6)' }}>·</span>
            <span className="mono" style={{ fontSize: 12, color: 'rgba(236,225,200,0.75)' }}>{item.date}</span>
            {item.tag && <><span style={{ color: 'rgba(236,225,200,0.6)' }}>·</span><span className="mono" style={{ fontSize: 11, color: 'rgba(236,225,200,0.75)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.tag}</span></>}
          </div>
          <h1 className="display" style={{ fontSize: 'clamp(30px, 4vw, 54px)', lineHeight: 1.08, fontWeight: 300, color: 'var(--bone)', letterSpacing: '-0.02em' }}>
            {item.title}
          </h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container-wide" style={{ maxWidth: 820, marginLeft: 'auto', marginRight: 'auto' }}>
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt=""
              style={{ width: '100%', maxHeight: 520, objectFit: 'contain', display: 'block', background: 'var(--paper-warm)', borderRadius: 4, marginBottom: 40 }}
            />
          )}
          {paras.length > 0 ? paras.map((p, i) => (
            <p key={i} className="body" style={{ fontSize: 18, lineHeight: 1.7, marginBottom: 24 }}>{p}</p>
          )) : (
            <p className="body" style={{ fontSize: 18 }}>{item.excerpt}</p>
          )}
        </div>
      </section>
    </article>
  );
}

function PrivacyPage({ setPage }) {
  const p = C().privacy || {};
  const paras = (p.body || '').split('\n\n').filter(x => x.trim());
  return (
    <React.Fragment>
      <section className="section" style={{ background: 'var(--umber)' }}>
        <div className="container-wide">
          <Eyebrow dark>{p.eyebrow || 'Legal'}</Eyebrow>
          <h1 className="h-1 display" style={{ color: 'var(--bone)', marginTop: 20 }}>{p.title || 'Privacy Policy'}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container-wide" style={{ maxWidth: 820, marginLeft: 'auto', marginRight: 'auto' }}>
          {paras.length > 0 ? paras.map((para, i) => (
            para.startsWith('## ')
              ? <h2 key={i} className="display" style={{ fontSize: 26, fontWeight: 400, marginTop: i === 0 ? 0 : 40, marginBottom: 16 }}>{para.slice(3)}</h2>
              : <p key={i} className="body" style={{ fontSize: 17, lineHeight: 1.7, marginBottom: 20, whiteSpace: 'pre-line' }}>{para}</p>
          )) : (
            <p className="body" style={{ color: 'var(--ink-3)' }}>Privacy policy content coming soon.</p>
          )}
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { AEAPage, NewsPage, DonatePage, ContactPage, MediaPage, MediaArticlePage, PrivacyPage });
