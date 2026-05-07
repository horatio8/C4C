// About + What we do + Issue page (v2 — earthy / photographic)

function AboutPage({ setPage }) {
  const team = [
    { name: 'Cristina Talacko', role: 'Chair & Founder', bio: 'Two-decade veteran of climate diplomacy. Founded C4C in 2017.', tag: 'GOVERNANCE', kind: 'portrait' },
    { name: 'Chris Walsh', role: 'Executive Director', bio: 'Former adviser to the Federal Environment Minister; ANU economics.', tag: 'EXECUTIVE', kind: 'portrait' },
    { name: 'The Hon. Trent Zimmerman', role: 'Patron', bio: 'Former federal MP for North Sydney; long-time advocate for moderate climate policy.', tag: 'PATRON', kind: 'portrait' },
    { name: 'Hon. Bridget McKenzie', role: 'Advisory Council', bio: 'Senator for Victoria; former Federal Agriculture Minister.', tag: 'ADVISORY', kind: 'portrait' },
    { name: 'Dr. Helen Catanchin', role: 'Director, Research', bio: 'PhD energy systems, Cambridge. Leads the C4C policy unit.', tag: 'RESEARCH', kind: 'portrait' },
    { name: 'Dr. Ian Cohen', role: 'Director, Biodiversity', bio: 'Marine ecologist; 14 years with Rainforest Reserves Australia.', tag: 'PROGRAMS', kind: 'portrait' },
  ];

  return (
    <React.Fragment>
      {/* Hero — landscape photo with overlaid title */}
      <section style={{ position: 'relative' }}>
        <Photo kind="wheat" label="Wheat country, Riverina" credit="Photo: Lyndon Mechielsen · NSW · 2025" height={620}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 var(--gutter) 80px' }}>
            <div>
              <Eyebrow dark>About · Our story</Eyebrow>
              <h1 className="h-display display" style={{ color: 'var(--bone)', marginTop: 28 }}>
                Grown-up<br /><span className="italic" style={{ color: '#e6c97a' }}>environmentalism.</span>
              </h1>
            </div>
          </div>
        </Photo>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 96 }}>
            <Eyebrow ochre>Founded 2017 · Sydney</Eyebrow>
            <div>
              <p className="lead" style={{ marginBottom: 32 }}>
                C4C was founded on a simple proposition: that the centre-right of Australian politics had been written out of the climate conversation, and that this was bad for the climate, bad for politics, and bad for the country.
              </p>
              <p className="body" style={{ fontSize: 17 }}>
                Nine years later, we're a registered charity with deductible-gift status, a board of senior Australians, partners on three continents, and a record of policy submissions to every parliamentary inquiry that touches our remit. We are not activists. We don't chain ourselves to anything. We do the slow, expensive, often boring work of changing how people in power think about the natural world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission triad — warmer, less newspapery */}
      <section className="section umber-bg">
        <div className="container-wide">
          <Eyebrow dark>How we work</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 56, marginTop: 56 }}>
            {[
              { num: '01', word: 'Inform', body: 'We brief policymakers, journalists, and the broader public with research grounded in evidence — not advocacy framed as evidence.' },
              { num: '02', word: 'Connect', body: 'We bring scientists, MPs, primary producers and industry to the same table. The conversations that move policy happen in rooms, not on platforms.' },
              { num: '03', word: 'Advocate', body: 'We file submissions, run campaigns, and argue — publicly, on the record, with a name attached — for practical climate and conservation outcomes.' },
            ].map(m => (
              <div key={m.num}>
                <div className="mono" style={{ fontSize: 11, color: '#e6c97a', letterSpacing: '0.14em', marginBottom: 40 }}>{m.num} —</div>
                <div className="display italic" style={{ fontSize: 88, lineHeight: 0.92, color: 'var(--bone)', fontWeight: 300, letterSpacing: '-0.04em' }}>We {m.word}.</div>
                <p className="body" style={{ marginTop: 32, fontSize: 16, color: 'rgba(236,225,200,0.78)' }}>{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="section">
        <div className="container-wide">
          <Eyebrow ochre>By the numbers · 2025</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 48, borderTop: '1px solid var(--ink)' }}>
            {[
              { n: '$2.4m', l: 'Funded research disbursed' },
              { n: '42', l: 'Parliamentary submissions filed' },
              { n: '187', l: 'Briefings to ministers and advisers' },
              { n: '14,228', l: 'Active supporters across 89 electorates' },
            ].map((s, i) => (
              <div key={s.l} style={{ padding: '48px 32px 0 0', borderRight: i < 3 ? '1px solid var(--rule)' : 'none', paddingLeft: i > 0 ? 32 : 0 }}>
                <div className="numeral">{s.n}</div>
                <div className="small" style={{ marginTop: 24, maxWidth: 200 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section warm-bg" style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96, marginBottom: 80, alignItems: 'flex-end' }}>
            <Eyebrow ochre>Governance · Board · Patrons</Eyebrow>
            <div>
              <h2 className="h-1 display">Senior Australians, <span className="italic">on the record.</span></h2>
              <p className="lead" style={{ marginTop: 24, maxWidth: 600 }}>
                Every board member, patron and advisor is named, photographed, and accountable. We publish a conflicts register and audited financials annually.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {team.map(t => (
              <div key={t.name}>
                <Photo kind={t.kind} height={360} label={t.tag} />
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

      {/* Financials */}
      <section className="section">
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 96 }}>
            <div>
              <Eyebrow ochre>Financial transparency</Eyebrow>
              <h2 className="h-2 display" style={{ marginTop: 24 }}>Our books are <span className="italic">open.</span></h2>
              <p className="body" style={{ marginTop: 24 }}>
                C4C is audited annually by Pitcher Partners. Our Annual Report, audited financial statements, and ACNC charity profile are public. Donors over $25,000 are named in the annual report, with consent.
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--ink)' }}>
              {[
                { y: '2025', name: 'Annual Report & Audited Financials', size: 'PDF · 4.2 MB · 64pp' },
                { y: '2024', name: 'Annual Report & Audited Financials', size: 'PDF · 3.8 MB · 58pp' },
                { y: '2023', name: 'Annual Report & Audited Financials', size: 'PDF · 3.6 MB · 52pp' },
                { y: '—', name: 'Conflicts of Interest Register (rolling)', size: 'PDF · 220 KB · 6pp' },
                { y: '—', name: 'ACNC Charity Profile', size: 'External link → ACNC.gov.au' },
              ].map((d, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 220px 40px', gap: 24, padding: '28px 0', borderBottom: '1px solid var(--rule)', alignItems: 'center', cursor: 'pointer' }}>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--ochre-2)', letterSpacing: '0.1em' }}>{d.y}</span>
                  <div className="display" style={{ fontSize: 22, fontWeight: 400 }}>{d.name}</div>
                  <span className="mono small">{d.size}</span>
                  <span style={{ fontSize: 18, textAlign: 'right' }}>↓</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

// ---------------- WHAT WE DO ----------------
function WorkPage({ setPage }) {
  const areas = [
    { slug: 'energy', n: '01', title: 'Energy', kind: 'coast',
      tagline: 'Affordable, reliable, low-emission. Pick three.',
      body: 'Australia needs a grid that survives 2050. That means advanced nuclear in the mix, industrial-scale solar in the right places, and an honest conversation about firming, transmission, and household cost.',
      meta: 'AEA · NUCLEAR · SOLAR · GRID' },
    { slug: 'agriculture', n: '02', title: 'Agriculture', kind: 'wheat',
      tagline: 'Productivity is the climate strategy.',
      body: 'Soil carbon, methane reduction, and adaptation tooling — built with farmers, not for them. We work with family-farm representatives across NSW and QLD on practical methodologies that pay.',
      meta: 'SOIL · METHANE · WATER · ADAPTATION' },
    { slug: 'biodiversity', n: '03', title: 'Biodiversity', kind: 'forest',
      tagline: "Conservation is conservatism's oldest job.",
      body: 'Rainforest, reef, and habitat protection — in partnership with Rainforest Reserves Australia. Every dollar of biodiversity funding produces an outsized return on outcome.',
      meta: 'RAINFOREST · MARINE · SPECIES' },
    { slug: 'industry', n: '04', title: 'Heavy Industry', kind: 'reef',
      tagline: 'Decarbonise without de-industrialising.',
      body: 'Steel, aluminium, cement, and the manufacturers downstream. Australia has the natural resources to be a clean-industrial superpower; we work on the policy that gets us there.',
      meta: 'STEEL · ALUMINIUM · CEMENT · HYDROGEN' },
  ];

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind="forest" label="Daintree canopy" credit="Photo: Rainforest Reserves Australia · QLD" height={560}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.7) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 var(--gutter) 72px' }}>
            <div>
              <Eyebrow dark>What we do</Eyebrow>
              <h1 className="h-display display" style={{ color: 'var(--bone)', marginTop: 28 }}>
                Four issues.<br /><span className="italic" style={{ color: '#e6c97a' }}>One framework.</span>
              </h1>
            </div>
          </div>
        </Photo>
      </section>

      {areas.map((a, i) => (
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
                  <button className="btn btn-outline" onClick={() => setPage('issue:' + a.slug)}>Explore {a.title.toLowerCase()} ↗</button>
                  {a.slug === 'energy' && <button className="btn-ghost" onClick={() => setPage('aea')}>See AEA campaign</button>}
                </div>
              </div>
              <div style={{ order: i % 2 === 0 ? 2 : 1 }}>
                <Photo kind={a.kind} height={520} label={a.title} credit={`Field reporting · 2026`} />
              </div>
            </div>
          </div>
        </section>
      ))}
    </React.Fragment>
  );
}

// ---------------- ISSUE PAGE ----------------
function IssuePage({ slug, setPage }) {
  const map = {
    energy: { title: 'Energy', tag: '01', kind: 'coast', tagline: 'Affordable, reliable, low-emission. Pick three.', position: 'Australia needs a grid that survives 2050. That requires technology-neutral policy: advanced nuclear in the mix, industrial-scale solar in the right places, firming for the duration that matters, and a transmission build-out that respects the people who live along the lines.' },
    agriculture: { title: 'Agriculture', tag: '02', kind: 'wheat', tagline: 'Productivity is the climate strategy.', position: 'Australian agriculture is one of the world\'s most efficient. The policy task is not to penalise it; it is to make it pay for the carbon it sequesters and the methane it eliminates.' },
    biodiversity: { title: 'Biodiversity', tag: '03', kind: 'forest', tagline: "Conservation is conservatism's oldest job.", position: 'We partner with Rainforest Reserves Australia to fund habitat protection where the marginal dollar buys the most outcome — and we work the policy that locks those gains in for generations.' },
    industry: { title: 'Heavy Industry', tag: '04', kind: 'reef', tagline: 'Decarbonise without de-industrialising.', position: 'Australia has the iron ore, the bauxite, the gas and the engineers. The question is whether we let other countries refine those resources or whether we build the clean industrial base ourselves.' },
  };
  const a = map[slug] || map.energy;

  return (
    <React.Fragment>
      <section style={{ position: 'relative' }}>
        <Photo kind={a.kind} height={620} label={`${a.title} · field reporting`} credit="Photo: Jack Atley · 2026">
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,11,0.2) 0%, rgba(20,17,11,0.75) 100%)', zIndex: 2 }} />
          <div className="container-wide" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 var(--gutter) 80px' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 13, color: 'rgba(236,225,200,0.7)', marginBottom: 32 }}>
              <a onClick={() => setPage('work')} style={{ cursor: 'pointer', borderBottom: '1px solid rgba(236,225,200,0.3)' }}>What we do</a>
              <span>/</span>
              <span>{a.title}</span>
            </div>
            <div className="mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: '#e6c97a', marginBottom: 24 }}>
              {a.tag} · ISSUE AREA · {a.title.toUpperCase()}
            </div>
            <h1 className="h-display display" style={{ maxWidth: 1200, color: 'var(--bone)' }}>
              {a.tagline.split('.')[0]}.<br />
              <span className="italic" style={{ color: '#e6c97a' }}>{a.tagline.split('.')[1] && a.tagline.split('.')[1].trim() + '.'}</span>
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
              <Eyebrow ochre>Why this matters</Eyebrow>
              <h2 className="h-2 display" style={{ marginTop: 24 }}>The slow problem nobody else is willing to solve.</h2>
            </div>
            <div>
              <p className="body" style={{ fontSize: 18, marginBottom: 24 }}>
                {slug === 'energy' && 'Australia\'s electricity sector accounts for roughly a third of national emissions. Closing it down without a plan is fantasy; running it forever on coal is irresponsible. The middle path requires technology choices that progressives have ruled out and conservatives have been told they can\'t support — and that\'s where C4C lives.'}
                {slug === 'agriculture' && 'Australian farmers manage about half the continent. They are the most consequential land-use decision-makers in the country. If we cannot build climate policy that pays them for stewardship, we cannot build climate policy at all.'}
                {slug === 'biodiversity' && 'Australia has the worst mammal extinction record on Earth. The species at risk live on private land more than public — and the policy levers that protect them are conservation easements, biodiversity offsets, and partnerships with Indigenous rangers. None of those are progressive policies. All of them work.'}
                {slug === 'industry' && 'Heavy industry produces a fifth of Australia\'s emissions and employs hundreds of thousands of Australians, most of them outside the capital cities. Every plausible decarbonisation path runs through technology that doesn\'t exist at scale yet — which means the policy has to fund the build, not just price the emissions.'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 56, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
                {[
                  { n: '32%', l: 'of national emissions originate in this sector' },
                  { n: '$54bn', l: 'annual value to the Australian economy' },
                  { n: '14', l: 'parliamentary inquiries we\'ve submitted to since 2022' },
                ].map(s => (
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
            <Eyebrow ochre>Our work · Active</Eyebrow>
            <div>
              {[
                { type: 'Submission', t: 'Capacity Investment Scheme — Round 4 Response', d: '28 APR 2026' },
                { type: 'Event', t: 'The Nuclear Question — Closed-door briefing for federal MPs', d: '14 MAY 2026 · Parliament House' },
                { type: 'Partnership', t: 'ANSTO joint research programme on small modular reactors', d: 'Ongoing · 2025–2027' },
                { type: 'Op-ed', t: 'Why farmers, not activists, will solve the methane question', d: '02 APR 2026 · The Australian' },
                { type: 'Submission', t: 'Safeguard Mechanism Review — industry transition pathways', d: '11 MAR 2026' },
              ].map((it, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 240px 40px', gap: 24, padding: '28px 0', borderBottom: '1px solid var(--rule)', borderTop: i === 0 ? '1px solid var(--ink)' : 'none', alignItems: 'baseline', cursor: 'pointer' }}>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--ochre-2)', textTransform: 'uppercase' }}>{it.type}</span>
                  <div className="display" style={{ fontSize: 22, lineHeight: 1.2, fontWeight: 400 }}>{it.t}</div>
                  <span className="mono small">{it.d}</span>
                  <span style={{ fontSize: 18, textAlign: 'right' }}>↗</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section umber-bg">
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'flex-start' }}>
            <div>
              <Eyebrow dark>Quarterly briefing</Eyebrow>
              <h2 className="h-1 display" style={{ marginTop: 24, color: 'var(--bone)' }}>
                Get the {a.title.toLowerCase()} <span className="italic" style={{ color: '#e6c97a' }}>briefing.</span>
              </h2>
              <p className="lead" style={{ color: 'rgba(236,225,200,0.78)', marginTop: 24 }}>
                A long-form digest of what's moving in Canberra, what we're working on, and what's worth your attention. Sent four times a year. No fluff.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div><label className="label" style={{ color: 'rgba(236,225,200,0.6)' }}>First name</label><input className="input" style={{ borderBottomColor: 'rgba(236,225,200,0.3)', color: 'var(--bone)' }} /></div>
              <div><label className="label" style={{ color: 'rgba(236,225,200,0.6)' }}>Last name</label><input className="input" style={{ borderBottomColor: 'rgba(236,225,200,0.3)', color: 'var(--bone)' }} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label className="label" style={{ color: 'rgba(236,225,200,0.6)' }}>Email</label><input className="input" style={{ borderBottomColor: 'rgba(236,225,200,0.3)', color: 'var(--bone)' }} /></div>
              <div><label className="label" style={{ color: 'rgba(236,225,200,0.6)' }}>Postcode</label><input className="input" style={{ borderBottomColor: 'rgba(236,225,200,0.3)', color: 'var(--bone)' }} /></div>
              <div><label className="label" style={{ color: 'rgba(236,225,200,0.6)' }}>Electorate (auto)</label><input className="input" style={{ borderBottomColor: 'rgba(236,225,200,0.3)', color: 'rgba(236,225,200,0.5)' }} placeholder="From postcode" disabled /></div>
              <div style={{ gridColumn: '1 / -1', marginTop: 24 }}>
                <button className="btn btn-ochre" style={{ width: '100%' }}>Subscribe to the {a.title.toLowerCase()} briefing ↗</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { AboutPage, WorkPage, IssuePage });
