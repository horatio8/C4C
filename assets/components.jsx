// Coalition for Conservation — components v2 (earthy / photographic / warm)

const { useState, useEffect, useRef, useMemo } = React;

// ---------------- Logo ----------------
function Logo({ size = 40, color = 'var(--bone)' }) {
  // Faithful recreation of the C4C mark — globe/leaf "C" in greens
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill="#2f5a3a" />
      <circle cx="32" cy="32" r="30" stroke="#4f7d5a" strokeWidth="0.6" fill="none" opacity="0.6" />
      {/* Stylised C — leaf curl opening right */}
      <path d="M46 20 C 38 14, 22 16, 18 28 C 14 40, 24 50, 36 48 C 42 47, 46 44, 48 40"
        stroke="#ecebe2" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* leaf accent */}
      <path d="M40 24 C 44 22, 50 22, 52 26 C 49 32, 44 33, 40 30 Z"
        fill="#c08a3e" opacity="0.95" />
      <path d="M40 24 C 44 26, 48 28, 52 26" stroke="#2f5a3a" strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}

function Wordmark({ dark = true }) {
  // Default to dark/nav-paper since nav is now green
  const c = 'var(--bone)';
  const sub = 'rgba(236,235,226,0.6)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Logo size={44} />
      <div style={{ lineHeight: 1 }}>
        <div className="display" style={{ fontSize: 24, color: c, letterSpacing: '-0.02em', fontWeight: 400 }}>
          Coalition <span className="italic" style={{ fontFamily: 'var(--display)' }}>for</span> Conservation
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: sub, marginTop: 6 }}>
          Australia · Est. 2017
        </div>
      </div>
    </div>
  );
}

// ---------------- Nav ----------------
function Nav({ page, setPage }) {
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'work', label: 'What we do' },
    { id: 'aea', label: 'Campaigns' },
    { id: 'news', label: 'News' },
    { id: 'contact', label: 'Contact' },
  ];
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="brand" onClick={() => setPage('home')}>
          <Wordmark />
        </div>
        <div className="nav-links">
          {items.map(it => (
            <a key={it.id}
              className={`nav-link ${page === it.id ? 'active' : ''}`}
              onClick={() => setPage(it.id)}>
              {it.label}
            </a>
          ))}
          <button className="nav-cta" onClick={() => setPage('donate')}>
            Donate <span style={{ fontSize: 14 }}>↗</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ---------------- Footer ----------------
function Footer({ setPage }) {
  return (
    <footer>
      <div className="container-wide" style={{ padding: '96px var(--gutter) 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 56, paddingBottom: 64 }}>
          <div>
            <Wordmark dark />
            <p style={{ marginTop: 28, color: 'rgba(236,225,200,0.72)', maxWidth: 340, fontSize: 14, lineHeight: 1.65 }}>
              An Australian environmental charity advancing practical, evidence-led climate and conservation policy. We work in country with farmers, scientists, and policymakers.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              {['LI', 'IG', 'X', 'YT'].map(s => (
                <a key={s} style={{ width: 38, height: 38, border: '1px solid rgba(236,225,200,0.2)', borderRadius: 999, display: 'grid', placeItems: 'center', fontSize: 10, fontFamily: 'var(--mono)', letterSpacing: '0.1em' }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="eyebrow eyebrow-paper" style={{ marginBottom: 20 }}>Explore</div>
            {['About', 'What we do', 'Campaigns', 'News', 'Events', 'Contact'].map(l => (
              <a key={l} style={{ display: 'block', padding: '8px 0', fontSize: 14, color: 'rgba(236,225,200,0.85)' }}>{l}</a>
            ))}
          </div>
          <div>
            <div className="eyebrow eyebrow-paper" style={{ marginBottom: 20 }}>Support</div>
            {['Donate', 'Become a member', 'Volunteer', 'Bequests', 'Corporate giving', 'Annual report'].map(l => (
              <a key={l} style={{ display: 'block', padding: '8px 0', fontSize: 14, color: 'rgba(236,225,200,0.85)' }}>{l}</a>
            ))}
          </div>
          <div>
            <div className="eyebrow eyebrow-paper" style={{ marginBottom: 20 }}>Sydney</div>
            <p style={{ fontSize: 14, color: 'rgba(236,225,200,0.85)', lineHeight: 1.75 }}>
              Level 9, 255 George Street<br />
              Sydney NSW 2000<br /><br />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(236,225,200,0.55)' }}>02 9188 8838</span><br />
              <a style={{ borderBottom: '1px solid rgba(236,225,200,0.3)', fontSize: 13 }}>admin@coalitionforconservation.com.au</a>
            </p>
          </div>
        </div>

        <div style={{ paddingTop: 32, borderTop: '1px solid rgba(236,225,200,0.18)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', color: 'rgba(236,225,200,0.5)' }}>
            ABN 84 638 274 922 · ACNC registered · DGR endorsed · © 2026
          </div>
          <div style={{ display: 'flex', gap: 28, fontSize: 12, color: 'rgba(236,225,200,0.6)' }}>
            <a>Privacy</a><a>Terms</a><a>Conflicts</a><a>Annual reports</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---------------- Pieces ----------------
function Eyebrow({ children, ochre, dark }) {
  return (
    <div className={`eyebrow ${ochre ? 'eyebrow-ochre' : ''} ${dark ? 'eyebrow-paper' : ''}`}>
      {children}
    </div>
  );
}

function Photo({ kind = 'outback', label, credit, height = 480, style, children }) {
  return (
    <div className={`ph ph-${kind}`} style={{ height, ...style }}>
      {label && <div className="ph-label">{label}</div>}
      {credit && <div className="ph-credit">{credit}</div>}
      {children}
    </div>
  );
}

// -------------- HOME --------------
function HomeHero({ setPage }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Full-bleed photographic hero */}
      <Photo kind="outback" label="Hero · West MacDonnell Ranges" credit="Photo: Jack Atley · NT · April 2026" height={'78vh'} style={{ minHeight: 640, position: 'relative' }}>
        {/* Soft warm overlay for legibility */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.15) 0%, rgba(20,17,11,0.4) 60%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />

        <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 80, paddingTop: 80 }}>
          <div style={{ maxWidth: 1100 }}>
            <Eyebrow dark>An Australian environmental charity · Est. 2017</Eyebrow>
            <h1 className="h-display display" style={{ marginTop: 32, color: 'var(--bone)', textShadow: '0 2px 30px rgba(0,0,0,0.3)' }}>
              Conservation,<br />
              <span className="italic" style={{ color: '#e6c97a' }}>with the receipts.</span>
            </h1>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'flex-end', marginTop: 56 }}>
            <p className="lead" style={{ color: 'rgba(236,225,200,0.9)', maxWidth: 620, fontSize: 24 }}>
              We are Australians who believe protecting the environment and growing the economy are the same project. We do the policy work to prove it — practical, technology-neutral, evidence-led.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button className="btn btn-rust" onClick={() => setPage('donate')}>Donate ↗</button>
              <button className="btn btn-outline-paper">Join the list</button>
            </div>
          </div>
        </div>
      </Photo>

      {/* Stat strip below the hero */}
      <div style={{ background: 'var(--ink)', color: 'var(--bone)' }}>
        <div className="container-wide" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[
            ['09', 'years of bipartisan policy work'],
            ['42', 'parliamentary submissions filed'],
            ['300+', 'centre-right legislators in our network'],
            ['14k', 'active supporters across 89 electorates'],
          ].map((s, i) => (
            <div key={i} style={{ padding: '40px 32px', borderRight: i < 3 ? '1px solid rgba(236,225,200,0.15)' : 'none', display: 'flex', alignItems: 'baseline', gap: 20 }}>
              <div className="display" style={{ fontSize: 56, fontWeight: 300, lineHeight: 0.9, color: 'var(--bone)', letterSpacing: '-0.04em' }}>{s[0]}</div>
              <div style={{ fontSize: 13, color: 'rgba(236,225,200,0.7)', lineHeight: 1.4, maxWidth: 180 }}>{s[1]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionStatement() {
  return (
    <section className="section" style={{ paddingBottom: 0 }}>
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 96 }}>
          <div>
            <Eyebrow ochre>The proposition</Eyebrow>
          </div>
          <div>
            <h2 className="display" style={{ fontSize: 'clamp(36px, 4vw, 64px)', lineHeight: 1.05, fontWeight: 300, letterSpacing: '-0.025em' }}>
              For nine years we have been making one argument: that the people who care most about Australian land — <span className="italic" style={{ color: 'var(--terracotta-2)' }}>farmers, foresters, fishers, families who grew up in the bush</span> — belong at the centre of the climate conversation, not the edge of it.
            </h2>
            <div style={{ marginTop: 48, display: 'flex', gap: 32, alignItems: 'center', paddingTop: 32, borderTop: '1px solid var(--rule)' }}>
              <div style={{ width: 72, height: 72, borderRadius: 999, overflow: 'hidden' }}>
                <Photo kind="portrait" height={72} />
              </div>
              <div>
                <div className="display" style={{ fontSize: 20 }}>Cristina Talacko</div>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--ink-3)', textTransform: 'uppercase', marginTop: 4 }}>Chair & Founder</div>
              </div>
              <button className="btn-ghost" style={{ marginLeft: 'auto' }}>Read the founder's letter</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlagshipCampaign({ setPage }) {
  return (
    <section className="section">
      <div className="container-wide">
        <Eyebrow ochre>Flagship campaign · 01</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginTop: 40, background: 'var(--ink)', color: 'var(--bone)', minHeight: 560 }}>
          <Photo kind="coast" label="AEA · Power lines, Hunter Valley" credit="Photo: Lyndon Mechielsen · NSW · 2026" height="100%" />
          <div style={{ padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 32 }}>
                <span className="chip chip-active" style={{ borderColor: 'rgba(236,225,200,0.3)', color: 'var(--bone)' }}>Launching · 11 May</span>
                <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'rgba(236,225,200,0.55)' }}>SUB-BRAND · OWN VOICE</span>
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em', color: '#e6c97a', marginBottom: 24 }}>
                AFFORDABLE ENERGY AUSTRALIA
              </div>
              <h2 className="display" style={{ fontSize: 'clamp(40px, 4.5vw, 72px)', fontWeight: 300, lineHeight: 0.98, color: 'var(--bone)', letterSpacing: '-0.03em' }}>
                Proven for families.<br />
                <span className="italic" style={{ color: '#e6c97a' }}>True</span> on cost.<br />
                Secure for the grid.
              </h2>
              <p className="body" style={{ marginTop: 28, maxWidth: 480, color: 'rgba(236,225,200,0.78)' }}>
                Australia's flagship campaign for an honest national conversation about energy. Three pillars. Three years of research. Now open for signatures.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap', marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(236,225,200,0.18)' }}>
              <button className="btn btn-ochre" onClick={() => setPage('aea')}>Visit AEA ↗</button>
              <div style={{ display: 'flex', gap: 32 }}>
                <div>
                  <div className="display" style={{ fontSize: 24, color: 'var(--bone)', fontWeight: 300 }}>14,228</div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(236,225,200,0.55)', marginTop: 4, textTransform: 'uppercase' }}>Supporters</div>
                </div>
                <div>
                  <div className="display" style={{ fontSize: 24, color: 'var(--bone)', fontWeight: 300 }}>89/151</div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(236,225,200,0.55)', marginTop: 4, textTransform: 'uppercase' }}>Electorates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IssueAreas({ setPage }) {
  const areas = [
    { n: '01', slug: 'energy', title: 'Energy', body: 'Advanced nuclear, industrial solar, and the balanced grid Australia actually needs.', kind: 'coast' },
    { n: '02', slug: 'agriculture', title: 'Agriculture', body: 'Soil carbon, productivity gains, and adaptation strategies built with farmers, not for them.', kind: 'wheat' },
    { n: '03', slug: 'biodiversity', title: 'Biodiversity', body: 'Rainforest, reef, and habitat protection in partnership with Rainforest Reserves Australia.', kind: 'forest' },
    { n: '04', slug: 'industry', title: 'Heavy Industry', body: 'Decarbonisation pathways for steel, aluminium, cement and the manufacturers downstream.', kind: 'reef' },
  ];
  return (
    <section className="section umber-bg">
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96, marginBottom: 80, alignItems: 'flex-end' }}>
          <Eyebrow dark>What we work on · 02</Eyebrow>
          <div>
            <h2 className="h-1 display">Four areas. <span className="italic">One framework.</span></h2>
            <p className="lead" style={{ marginTop: 24, maxWidth: 600 }}>
              Every brief, every event, every submission maps back to one of these four — and back to one organising question: where does honest research applied to a real policy moment change a real outcome?
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {areas.map(a => (
            <div key={a.n} style={{ cursor: 'pointer' }}
              onClick={() => setPage('issue:' + a.slug)}>
              <Photo kind={a.kind} height={320} label={`Issue ${a.n}`} />
              <div style={{ paddingTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ochre)', letterSpacing: '0.14em' }}>{a.n} —</span>
                  <span style={{ fontSize: 18, color: 'rgba(236,225,200,0.6)' }}>↗</span>
                </div>
                <h3 className="display" style={{ fontSize: 36, marginTop: 16, fontWeight: 300, color: 'var(--bone)' }}>{a.title}</h3>
                <p className="body" style={{ fontSize: 14, marginTop: 16, color: 'rgba(236,225,200,0.72)' }}>{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedPolicy() {
  const items = [
    { type: 'Submission', date: '28 APR 2026', title: 'Capacity Investment Scheme — Round 4 Response', cite: '12pp · Treasury, Senate Standing Committee' },
    { type: 'Fact sheet', date: '12 APR 2026', title: 'A Low-Emissions Future: the Economic Case for Centre-Right Climate Action', cite: '24pp · C4C Research Unit' },
    { type: 'Op-ed', date: '02 APR 2026', title: 'Why farmers, not activists, will solve the methane question', cite: 'Published in The Australian · 1,180 words' },
  ];
  return (
    <section className="section">
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96, alignItems: 'flex-end' }}>
          <Eyebrow ochre>Featured policy · 03</Eyebrow>
          <div>
            <h2 className="h-1 display">The receipts.</h2>
          </div>
        </div>

        <div style={{ marginTop: 64, borderTop: '1px solid var(--ink)' }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 130px 1fr 220px 60px', gap: 32, padding: '40px 0', borderBottom: '1px solid var(--rule)', alignItems: 'flex-start', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--shade)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--ochre-2)', textTransform: 'uppercase', paddingTop: 10 }}>{it.type}</span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', paddingTop: 10 }}>{it.date}</span>
              <h3 className="display" style={{ fontSize: 30, lineHeight: 1.1, fontWeight: 400, letterSpacing: '-0.015em' }}>{it.title}</h3>
              <span className="small" style={{ paddingTop: 12 }}>{it.cite}</span>
              <span style={{ fontSize: 22, textAlign: 'right', paddingTop: 8 }}>↗</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerStrip() {
  const partners = [
    'Bill & Melinda Gates Foundation',
    'Rainforest Reserves Australia',
    'Conservative Environment Network',
    'ANSTO',
    'Menzies Research Centre',
  ];
  return (
    <section style={{ background: 'var(--paper-warm)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
      <div className="container-wide" style={{ padding: '48px var(--gutter)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 56, flexWrap: 'wrap' }}>
          <div className="eyebrow" style={{ flexShrink: 0 }}>In partnership with</div>
          <div style={{ display: 'flex', flex: 1, gap: 48, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            {partners.map(p => (
              <div key={p} className="display italic" style={{ fontSize: 18, color: 'var(--ink-2)', fontWeight: 400 }}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PressBand() {
  const press = [
    { masthead: 'The Australian', headline: 'C4C is the rare green group conservatives will sit down with.', when: 'May 2026' },
    { masthead: 'AFR', headline: 'Their nuclear submission was the most cited paper in the inquiry.', when: 'Apr 2026' },
    { masthead: 'ABC RN', headline: 'A grown-up environmental voice from the centre-right.', when: 'Mar 2026' },
  ];
  return (
    <section className="section dark">
      <div className="container-wide">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56 }}>
          <Eyebrow dark>C4C in the press · 04</Eyebrow>
          <a className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'rgba(236,225,200,0.7)', borderBottom: '1px solid rgba(236,225,200,0.3)', paddingBottom: 4 }}>VIEW ALL COVERAGE ↗</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
          {press.map((p, i) => (
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
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <Photo kind="forest" height={560} label="Hero · Daintree" credit="Photo: Rainforest Reserves Australia · QLD · 2025" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,17,11,0.85) 0%, rgba(20,17,11,0.55) 100%)', zIndex: 2 }} />
      <div className="container-wide" style={{ position: 'relative', zIndex: 4, padding: '128px var(--gutter)', minHeight: 560, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 96, alignItems: 'center', width: '100%' }}>
          <div>
            <Eyebrow dark ochre>Tax-deductible · DGR endorsed</Eyebrow>
            <h2 className="h-1 display" style={{ marginTop: 24, color: 'var(--bone)' }}>
              Funded by people who'd rather <span className="italic" style={{ color: '#e6c97a' }}>read a submission</span> than burn an effigy.
            </h2>
          </div>
          <div>
            <p className="lead" style={{ color: 'rgba(236,225,200,0.85)', marginBottom: 40 }}>
              Every dollar funds research, parliamentary engagement, and the legal work that keeps C4C independent. Donations over $2 are tax-deductible.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="btn btn-rust" onClick={() => setPage('donate')}>Make a donation ↗</button>
              <button className="btn btn-outline-paper">Recurring giving</button>
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
      <MissionStatement />
      <FlagshipCampaign setPage={setPage} />
      <IssueAreas setPage={setPage} />
      <FeaturedPolicy />
      <PressBand />
      <DonateBand setPage={setPage} />
    </React.Fragment>
  );
}

Object.assign(window, {
  Logo, Wordmark, Nav, Footer, Eyebrow, Photo,
  HomePage, HomeHero, PartnerStrip, MissionStatement, FlagshipCampaign,
  IssueAreas, FeaturedPolicy, PressBand, DonateBand,
});
