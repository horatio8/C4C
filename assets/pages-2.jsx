// AEA + News + Donate + Contact (v2 — earthy)

function AEAPage() {
  const [pillar, setPillar] = useState('proven');
  const pillars = {
    proven: {
      eyebrow: 'Pillar A',
      headline: 'Proven for families',
      sub: 'The technologies in the energy mix have to be proven — for cost, for reliability, for safety. Not "promising". Not "emerging". Proven.',
      points: [
        ['$1,840', 'Average household electricity bill, NSW · 2025'],
        ['+62%', 'Wholesale price increase since 2019'],
        ['98.4%', 'Grid reliability target — already missed in 4 states'],
      ],
    },
    true: {
      eyebrow: 'Pillar B',
      headline: 'True on cost',
      sub: 'No more accounting tricks. Every bill, every subsidy, every transmission line — the public deserves the full number, before we lock it in.',
      points: [
        ['$320bn', 'Estimated grid build-out to 2050'],
        ['28,000 km', 'New transmission lines required'],
        ['$0', 'Of which is currently in the federal forward estimates'],
      ],
    },
    secure: {
      eyebrow: 'Pillar C',
      headline: 'Secure for the grid',
      sub: 'Energy security is national security. The grid that powers our hospitals and our manufacturers cannot depend on the weather.',
      points: [
        ['72hrs', 'Of dispatchable storage required to firm 90% renewables'],
        ['1.4GW', 'Of firming capacity retired since 2022'],
        ['18', 'Coal units scheduled to close before 2035'],
      ],
    },
  };
  const p = pillars[pillar];

  return (
    <React.Fragment>
      {/* AEA hero — distinct sub-brand identity */}
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
              ↳ A CAMPAIGN OF THE COALITION FOR CONSERVATION
            </div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)' }}>
              SUB-BRAND · OWN VOICE · SAME ORG
            </div>
          </div>
        </div>

        <div className="container-wide" style={{ padding: '88px var(--gutter) 112px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div className="display italic" style={{ fontSize: 56, color: '#1FB5D8', fontWeight: 400, lineHeight: 1 }}>AEA</div>
            <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.2)' }} />
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)' }}>AFFORDABLE ENERGY AUSTRALIA</div>
          </div>

          <h1 className="display" style={{ fontSize: 'clamp(64px, 8.5vw, 144px)', lineHeight: 0.92, letterSpacing: '-0.04em', fontWeight: 300, color: 'white' }}>
            Power that's <span style={{ color: '#1FB5D8' }}>proven</span>,<br />
            <span className="italic">true</span> on cost,<br />
            and secure for the grid.
          </h1>
          <p className="lead" style={{ marginTop: 40, color: 'rgba(255,255,255,0.85)', maxWidth: 720, fontSize: 24 }}>
            An honest national campaign for a national conversation Australia keeps avoiding. Built on three pillars. Backed by three years of research.
          </p>

          <div style={{ display: 'flex', gap: 14, marginTop: 56, flexWrap: 'wrap' }}>
            <button className="btn" style={{ background: '#1FB5D8', color: '#0A1F44' }}>Sign the AEA petition ↗</button>
            <button className="btn btn-outline-paper" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>Read the messaging matrix</button>
          </div>
        </div>
      </section>

      {/* Pillar tabs */}
      <section className="section">
        <div className="container-wide">
          <Eyebrow ochre>The three pillars · Click to switch</Eyebrow>
          <div style={{ display: 'flex', gap: 0, marginTop: 32, marginBottom: 64 }}>
            {Object.keys(pillars).map(k => (
              <button key={k}
                onClick={() => setPillar(k)}
                className={`pillar-tab ${pillar === k ? 'active' : ''}`}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', opacity: 0.7 }}>{pillars[k].eyebrow}</div>
                <div className="display" style={{ fontSize: 30, marginTop: 12, fontWeight: 400 }}>{pillars[k].headline}</div>
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

      {/* AEA petition */}
      <section style={{ background: '#f0f4fa', padding: '120px 0', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: '#0A1F44' }}>JOIN THE AEA SUPPORTER LIST</div>
              <h2 className="h-1 display" style={{ marginTop: 24, color: '#0A1F44', fontWeight: 300 }}>
                14,228 Australians have <span className="italic">already signed.</span>
              </h2>
              <p className="body" style={{ marginTop: 24, fontSize: 17 }}>
                AEA's supporter list is separate from the C4C parent list — different cadence, different content, different consent. You can sign one or both.
              </p>
              <div style={{ display: 'flex', gap: 40, marginTop: 48 }}>
                {[['14,228', 'Signatures'], ['89', 'Electorates'], ['6/6', 'States & Terr.']].map(s => (
                  <div key={s[1]}>
                    <div className="display" style={{ fontSize: 40, color: '#0A1F44', lineHeight: 1, fontWeight: 300 }}>{s[0]}</div>
                    <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-3)', marginTop: 8 }}>{s[1]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'white', padding: 48, border: '1px solid var(--rule)' }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: '#0A1F44', marginBottom: 32 }}>SIGN THE PETITION</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div><label className="label">First name</label><input className="input" /></div>
                <div><label className="label">Last name</label><input className="input" /></div>
                <div style={{ gridColumn: '1 / -1' }}><label className="label">Email</label><input className="input" /></div>
                <div><label className="label">Postcode</label><input className="input" /></div>
                <div><label className="label">Mobile (optional)</label><input className="input" /></div>
                <label style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13, color: 'var(--ink-3)', marginTop: 16 }}>
                  <input type="checkbox" style={{ marginTop: 4 }} defaultChecked /> I'd like AEA campaign updates by email. I can unsubscribe anytime.
                </label>
                <button className="btn" style={{ background: '#0A1F44', color: '#1FB5D8', gridColumn: '1 / -1', marginTop: 16 }}>
                  Sign the AEA petition ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

// ---------- News ----------
function NewsPage() {
  const [filter, setFilter] = useState('All');
  const items = [
    { type: 'Submission', date: '28 APR 2026', title: 'Capacity Investment Scheme — Round 4 Response', tag: 'Energy', body: 'C4C\'s 12-page response to Treasury\'s consultation, with technical analysis of merit-order effects and firming requirements.' },
    { type: 'Op-ed', date: '02 APR 2026', title: 'Why farmers, not activists, will solve the methane question', tag: 'Agriculture', body: 'Published in The Australian. A 1,180-word case for paying farmers for what they do, instead of regulating them out of the way.' },
    { type: 'News', date: '24 MAR 2026', title: 'C4C welcomes the bipartisan endorsement of small modular reactors', tag: 'Energy', body: 'Joint statement with the ANSTO research alliance on the federal SMR feasibility process.' },
    { type: 'Statement', date: '12 MAR 2026', title: 'On the closure of Eraring: a managed transition is possible. This was not it.', tag: 'Energy', body: 'A statement on closure announcements made without firming plans, transmission contracts, or community consultation.' },
    { type: 'Fact sheet', date: '01 MAR 2026', title: 'A Low-Emissions Future: the Economic Case', tag: 'Cross-cutting', body: 'A 24-page primer for centre-right legislators on the economic upside of practical climate action.' },
    { type: 'Event', date: '14 FEB 2026', title: 'The Soil Carbon Pact — closed roundtable, Toowoomba', tag: 'Agriculture', body: 'Eighteen family-farm representatives from across NSW and QLD met with C4C\'s research unit to set methodologies.' },
    { type: 'Submission', date: '28 JAN 2026', title: 'Safeguard Mechanism Review — industry transition pathways', tag: 'Heavy Industry', body: 'Detailed C4C response to the federal Safeguard Mechanism review — particular focus on cement and aluminium.' },
    { type: 'Op-ed', date: '14 JAN 2026', title: 'The conservation movement\'s problem with farmers', tag: 'Biodiversity', body: 'Published in The Spectator Australia. On private-land conservation as the next frontier.' },
  ];
  const filters = ['All', 'Energy', 'Agriculture', 'Biodiversity', 'Heavy Industry', 'Cross-cutting'];
  const filtered = filter === 'All' ? items : items.filter(i => i.tag === filter);

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind="reef" label="The Whitsundays" credit="Photo: Jack Atley · QLD · 2026" height={520}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 var(--gutter) 72px' }}>
            <div>
              <Eyebrow dark>News & Resources</Eyebrow>
              <h1 className="h-display display" style={{ color: 'var(--bone)', marginTop: 28 }}>
                The work,<br /><span className="italic" style={{ color: '#e6c97a' }}>on the record.</span>
              </h1>
            </div>
          </div>
        </Photo>
      </section>

      <section style={{ padding: '32px 0', background: 'var(--paper-warm)', borderBottom: '1px solid var(--rule)', position: 'sticky', top: 79, zIndex: 10 }}>
        <div className="container-wide" style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="eyebrow">Filter</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {filters.map(f => (
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

// ---------- Donate (kept the 3-step flow per your request) ----------
function DonatePage() {
  const [amount, setAmount] = useState(100);
  const [recurring, setRecurring] = useState(true);
  const [step, setStep] = useState(1);
  const presets = [50, 100, 250, 1000];

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind="outback" label="West MacDonnell Ranges" credit="Photo: Jack Atley · NT · 2026" height={520}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 var(--gutter) 72px' }}>
            <div>
              <Eyebrow dark>Support · DGR endorsed</Eyebrow>
              <h1 className="h-display display" style={{ color: 'var(--bone)', marginTop: 28, maxWidth: 1100 }}>
                Fund the work that <span className="italic" style={{ color: '#e6c97a' }}>writes itself</span> into the record.
              </h1>
            </div>
          </div>
        </Photo>
      </section>

      <section style={{ background: 'var(--paper-warm)', borderBottom: '1px solid var(--rule)' }}>
        <div className="container-wide" style={{ padding: '80px var(--gutter)' }}>
          <div style={{ display: 'flex', gap: 0, marginBottom: 56, borderBottom: '1px solid var(--rule)' }}>
            {['01 — Amount', '02 — Your details', '03 — Confirmation'].map((s, i) => (
              <div key={s} style={{ flex: 1, padding: '24px 0', borderBottom: step === i + 1 ? '2px solid var(--ink)' : 'none', marginBottom: -1 }}>
                <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: step === i + 1 ? 'var(--ink)' : 'var(--ink-4)', textTransform: 'uppercase' }}>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'flex-start' }}>
            {step === 1 && (
              <div>
                <Eyebrow ochre>Your contribution</Eyebrow>
                <div style={{ display: 'flex', gap: 12, marginTop: 24, marginBottom: 32 }}>
                  <button onClick={() => setRecurring(false)} className="btn" style={{ flex: 1, background: !recurring ? 'var(--ink)' : 'transparent', color: !recurring ? 'var(--paper)' : 'var(--ink)', border: '1px solid var(--ink)', justifyContent: 'center' }}>One-time</button>
                  <button onClick={() => setRecurring(true)} className="btn" style={{ flex: 1, background: recurring ? 'var(--ink)' : 'transparent', color: recurring ? 'var(--paper)' : 'var(--ink)', border: '1px solid var(--ink)', justifyContent: 'center' }}>Monthly · Recommended</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                  {presets.map(p => (
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
                  <label className="label">Or custom amount (AUD)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, top: 14, fontFamily: 'var(--display)', fontSize: 20, color: 'var(--ink-3)' }}>$</span>
                    <input className="input" value={amount} onChange={e => setAmount(e.target.value)} style={{ paddingLeft: 24, fontFamily: 'var(--display)', fontSize: 22, fontWeight: 300 }} />
                  </div>
                </div>
                <div style={{ marginTop: 40, padding: 28, background: 'var(--paper)', border: '1px solid var(--rule)' }}>
                  <div className="eyebrow" style={{ marginBottom: 12 }}>What ${amount}{recurring ? '/mo' : ''} funds</div>
                  <p className="body italic" style={{ fontSize: 18, fontFamily: 'var(--display)', color: 'var(--ink)', fontWeight: 300 }}>
                    {amount < 100 && 'Two researcher-hours on a parliamentary submission in development.'}
                    {amount >= 100 && amount < 500 && 'A full briefing pack distributed to a federal MP and their advisers.'}
                    {amount >= 500 && amount < 2500 && 'A C4C representative at a closed-door industry roundtable, on the record.'}
                    {amount >= 2500 && 'Underwrites a piece of original C4C research that lands in submissions, op-eds, and ministerial briefings.'}
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
                <div className="display italic" style={{ fontSize: 88, color: 'var(--terracotta-2)', fontWeight: 300, lineHeight: 0.9 }}>Thank you.</div>
                <p className="lead" style={{ marginTop: 32 }}>
                  You'll receive a tax-deductible receipt in your inbox in the next 60 seconds. We'll send you a quarterly update on the work your contribution funded — no spam, no chain of fundraising emails.
                </p>
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
              <Eyebrow ochre>Trust & transparency</Eyebrow>
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--ink)' }}>
                {[
                  ['DGR', 'Deductible Gift Recipient endorsed by the ATO. Donations over $2 are tax-deductible.'],
                  ['ACNC', 'Registered with the Australian Charities and Not-for-profits Commission since 2017.'],
                  ['Audit', 'Audited annually by Pitcher Partners. Books published every July.'],
                  ['Disclosure', 'Donors over $25,000 named in the annual report, with consent.'],
                ].map(t => (
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

// ---------- Contact ----------
function ContactPage() {
  const [topic, setTopic] = useState('General enquiry');
  const [sent, setSent] = useState(false);
  const topics = ['General enquiry', 'Press & media', 'Partnerships', 'Donations & giving', 'Speaking & events', 'Other'];

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind="coast" label="Sydney Harbour" credit="Photo: C4C office · 2026" height={420}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 var(--gutter) 72px' }}>
            <div>
              <Eyebrow dark>Contact</Eyebrow>
              <h1 className="h-display display" style={{ color: 'var(--bone)', marginTop: 28 }}>
                Get in touch<br /><span className="italic" style={{ color: '#e6c97a' }}>— we read everything.</span>
              </h1>
            </div>
          </div>
        </Photo>
      </section>

      <section className="section">
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 96, alignItems: 'flex-start' }}>
            <div>
              <Eyebrow ochre>Send us a message</Eyebrow>
              <h2 className="h-2 display" style={{ marginTop: 24 }}>
                One form. <span className="italic">The right person reads it.</span>
              </h2>
              <p className="body" style={{ marginTop: 24 }}>
                Tell us a little about what you're after. Press, partnerships, donations, speaking — pick a topic and we'll route your note to whoever can help fastest. We aim to reply within two business days.
              </p>
              <div className="mono small" style={{ marginTop: 40, color: 'var(--ink-3)', lineHeight: 1.9, paddingTop: 32, borderTop: '1px solid var(--rule)' }}>
                MON–FRI · 09:00–17:30 AEST<br />
                Sydney HQ · Level 9, 255 George Street<br />
                ABN 84 638 274 922 · DGR endorsed
              </div>
            </div>

            {sent ? (
              <div style={{ padding: '64px 56px', border: '1px solid var(--ink)', background: 'var(--bone)' }}>
                <Eyebrow ochre>Received</Eyebrow>
                <div className="display" style={{ fontSize: 64, lineHeight: 0.95, marginTop: 24 }}>
                  Thank you.
                </div>
                <p className="lead" style={{ marginTop: 24, maxWidth: 480 }}>
                  Your message is on its way to the right person at C4C. Expect a reply within two business days. If it's urgent, mark your subject line with <span className="mono" style={{ background: 'var(--ink)', color: 'var(--bone)', padding: '2px 8px', fontSize: 13 }}>URGENT</span>.
                </p>
                <button onClick={() => setSent(false)} className="btn btn-outline" style={{ marginTop: 40 }}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: 56, border: '1px solid var(--ink)', background: 'var(--bone)' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="label">What's this about?</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {topics.map(tp => (
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
                  <input type="checkbox" style={{ marginTop: 4 }} /> Add me to the C4C quarterly briefing list (optional, double opt-in).
                </label>
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--rule)' }}>
                  <span className="mono small" style={{ color: 'var(--ink-3)' }}>
                    Routed to: <span style={{ color: 'var(--ink)' }}>{topic}</span>
                  </span>
                  <button type="submit" className="btn btn-primary">Send message →</button>
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
