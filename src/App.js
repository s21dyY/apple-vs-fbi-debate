import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  TEAM,
  SOURCES,
  FBI_COUNT,
  PEW,
  PEW_SUBGROUPS,
  TRANSPARENCY,
  TIMELINE,
} from './data.js';
import { DEBATE_NOTES } from './debateNotes.js';

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

const W = 1280;
const H = 720;
const fmt = (n) => n.toLocaleString('en-US');

function Cite({ ids }) {
  return <span className="cite">({ids.join(', ')})</span>;
}

function SlideFrame({ section, title, children, num, total }) {
  return (
    <div className="slide">
      {section && <div className="section-tag">{section}</div>}
      {title && <h2 className="slide-title">{title}</h2>}
      <div className="slide-body">{children}</div>
      <footer className="slide-footer">
        <span>Team Privacy · Apple vs. FBI</span>
        {num != null && (
          <span>
            {num} / {total}
          </span>
        )}
      </footer>
    </div>
  );
}

function StatTile({ value, label, src }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">
        {label} {src && <Cite ids={src} />}
      </div>
    </div>
  );
}

// Shared hover tooltip for the SVG charts.
function useTip() {
  const [tip, setTip] = useState(null);
  const show = (e, text) => {
    const box = e.currentTarget.ownerSVGElement.getBoundingClientRect();
    const scale = box.width / e.currentTarget.ownerSVGElement.viewBox.baseVal.width;
    setTip({
      x: (e.clientX - box.left) / scale,
      y: (e.clientY - box.top) / scale,
      text,
    });
  };
  const hide = () => setTip(null);
  return { tip, show, hide };
}

function Tip({ tip, width }) {
  if (!tip) return null;
  const w = 230;
  const x = Math.min(tip.x + 12, width - w - 4);
  return (
    <g pointerEvents="none">
      <rect x={x} y={tip.y - 40} width={w} height={34} rx={6} className="tip-box" />
      <text x={x + 10} y={tip.y - 18} className="tip-text">
        {tip.text}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Exhibits (charts)                                                   */
/* ------------------------------------------------------------------ */

// Exhibit: FBI claimed vs. actual locked phones (S8)
function FbiCountChart() {
  const { tip, show, hide } = useTip();
  const width = 560;
  const height = 230;
  const left = 170;
  const max = 8000;
  const x = (v) => left + (v / max) * (width - left - 70);
  const bars = [
    {
      label: 'FBI public claim',
      sub: '2017 count',
      y: 40,
      from: 0,
      to: FBI_COUNT.claimed,
      text: `FBI claim: ${fmt(FBI_COUNT.claimed)} devices`,
      cls: 'bar-risk',
      value: fmt(FBI_COUNT.claimed),
    },
    {
      label: 'Estimated real',
      sub: 'Washington Post',
      y: 120,
      from: 0,
      to: FBI_COUNT.actualHigh,
      text: `Estimate: ${fmt(FBI_COUNT.actualLow)} to ${fmt(FBI_COUNT.actualHigh)} devices`,
      cls: 'bar-main',
      value: `${fmt(FBI_COUNT.actualLow)}–${fmt(FBI_COUNT.actualHigh)}`,
    },
  ];
  return (
    <figure className="exhibit">
      <figcaption>
        <b>Exhibit 2.</b> Locked phones the FBI said it could not open in 2017
      </figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} className="chart" role="img"
        aria-label="FBI claimed 7,775 locked devices; the real number was about 1,000 to 2,000">
        {[0, 2000, 4000, 6000, 8000].map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={24} y2={190} className="grid" />
            <text x={x(t)} y={210} className="axis" textAnchor="middle">
              {fmt(t)}
            </text>
          </g>
        ))}
        {bars.map((b) => (
          <g key={b.label}>
            <text x={left - 12} y={b.y + 22} className="bar-label" textAnchor="end">
              {b.label}
            </text>
            <text x={left - 12} y={b.y + 40} className="axis" textAnchor="end">
              {b.sub}
            </text>
            {b.cls === 'bar-main' && (
              <rect x={x(0)} y={b.y} width={x(FBI_COUNT.actualLow) - x(0)} height={44} rx={4}
                className="bar-main" />
            )}
            <rect
              x={b.cls === 'bar-main' ? x(FBI_COUNT.actualLow) + 2 : x(0)}
              y={b.y}
              width={b.cls === 'bar-main' ? x(b.to) - x(FBI_COUNT.actualLow) - 2 : x(b.to) - x(0)}
              height={44}
              rx={4}
              className={b.cls === 'bar-main' ? 'bar-main-light' : b.cls}
            />
            <rect x={x(0)} y={b.y - 6} width={width - left} height={56} fill="transparent"
              onMouseMove={(e) => show(e, b.text)} onMouseLeave={hide} />
            <text x={x(b.to) + 8} y={b.y + 28} className="bar-value">
              {b.value}
            </text>
          </g>
        ))}
        <Tip tip={tip} width={width} />
      </svg>
      <div className="exhibit-note">
        A programming error counted phones more than once. The light part of the bar is the
        range of the estimate. <Cite ids={['S8']} />
      </div>
    </figure>
  );
}

// Exhibit: Pew poll, 2016 (S9)
function PewChart() {
  const { tip, show, hide } = useTip();
  const width = 560;
  const height = 250;
  const left = 130;
  const full = width - left - 20;
  const cls = { unlock: 'seg-b', not: 'seg-a', none: 'seg-n' };
  let acc = 0;
  return (
    <figure className="exhibit">
      <figcaption>
        <b>Exhibit 1.</b> Public opinion, Feb 2016: should Apple unlock the phone?
      </figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} className="chart" role="img"
        aria-label="51% said Apple should unlock, 38% should not, 11% no opinion">
        <text x={left - 10} y={52} className="bar-label" textAnchor="end">
          All adults
        </text>
        {PEW.map((p) => {
          const x0 = left + (acc / 100) * full;
          const w = (p.value / 100) * full - 2;
          acc += p.value;
          return (
            <g key={p.key}>
              <rect x={x0} y={28} width={w} height={40} rx={4} className={cls[p.key]}
                onMouseMove={(e) => show(e, `${p.label}: ${p.value}%`)} onMouseLeave={hide} />
              <text x={x0 + w / 2} y={54} textAnchor="middle" className="seg-text">
                {p.value}%
              </text>
            </g>
          );
        })}
        {PEW_SUBGROUPS.slice(1).map((g, i) => {
          const y = 110 + i * 56;
          const wu = (g.unlock / 100) * full - 2;
          const wn = (g.not / 100) * full - 2;
          return (
            <g key={g.label}>
              <text x={left - 10} y={y + 22} className="bar-label" textAnchor="end">
                {g.label}
              </text>
              <rect x={left} y={y} width={wu} height={34} rx={4} className="seg-b"
                onMouseMove={(e) => show(e, `${g.label}, unlock: ${g.unlock}%`)} onMouseLeave={hide} />
              <text x={left + wu / 2} y={y + 22} textAnchor="middle" className="seg-text">
                {g.unlock}%
              </text>
              <rect x={left + wu + 2} y={y} width={wn} height={34} rx={4} className="seg-a"
                onMouseMove={(e) => show(e, `${g.label}, do not unlock: ${g.not}%`)} onMouseLeave={hide} />
              <text x={left + wu + 2 + wn / 2} y={y + 22} textAnchor="middle" className="seg-text">
                {g.not}%
              </text>
            </g>
          );
        })}
        <Tip tip={tip} width={width} />
      </svg>
      <div className="legend">
        <span><i className="sw seg-b" />Should unlock (FBI side)</span>
        <span><i className="sw seg-a" />Should not unlock (Apple side)</span>
        <span><i className="sw seg-n" />No opinion</span>
      </div>
      <div className="exhibit-note">
        1,002 U.S. adults, Feb 18–21, 2016. Young adults and iPhone owners were split almost evenly. <Cite ids={['S9']} />
      </div>
    </figure>
  );
}

// Exhibit: Apple's lawful cooperation, U.S. transparency report (S17)
function TransparencyChart() {
  const { tip, show, hide } = useTip();
  const width = 520;
  const height = 170;
  const left = 150;
  const full = width - left - 70;
  return (
    <figure className="exhibit">
      <figcaption>
        <b>Exhibit 4.</b> Share of U.S. government requests where Apple provided data, Jul–Dec 2024
      </figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} className="chart" role="img"
        aria-label="Apple provided data for 73% of device requests and 82% of account requests">
        {TRANSPARENCY.map((t, i) => {
          const y = 20 + i * 70;
          const w = (t.pct / 100) * full;
          return (
            <g key={t.label}>
              <text x={left - 12} y={y + 20} className="bar-label" textAnchor="end">
                {t.label}
              </text>
              <text x={left - 12} y={y + 38} className="axis" textAnchor="end">
                {fmt(t.received)} received
              </text>
              <rect x={left} y={y} width={full} height={42} rx={4} className="track" />
              <rect x={left} y={y} width={w} height={42} rx={4} className="bar-main"
                onMouseMove={(e) => show(e, `${t.label}: data provided in ${t.pct}%`)} onMouseLeave={hide} />
              <text x={left + full + 8} y={y + 27} className="bar-value">
                {t.pct}%
              </text>
            </g>
          );
        })}
        <Tip tip={tip} width={width} />
      </svg>
      <div className="exhibit-note">
        Apple already answers most lawful requests. What it refuses is building new code that breaks its own security. <Cite ids={['S17']} />
      </div>
    </figure>
  );
}

// Exhibit: one phone vs. a master key (S1, S3)
function KeyDiagram() {
  return (
    <div className="two-col compare">
      <div className="card">
        <div className="card-head">What the order asked for <Cite ids={['S3']} /></div>
        <ul>
          <li>Disable auto-erase after 10 wrong passcodes</li>
          <li>Let the FBI enter passcodes electronically, by cable or wireless</li>
          <li>Remove the delays between guesses</li>
          <li>Deliver it as new, <b>Apple-signed</b> software, tied to this one phone's ID</li>
        </ul>
      </div>
      <div className="arrow">→</div>
      <div className="card card-risk">
        <div className="card-head">What that really creates</div>
        <ul>
          <li>A tool that removes the iPhone's brute-force protection</li>
          <li>Signed by Apple, so every iPhone trusts it</li>
          <li>Changing one ID number makes it work on the next phone</li>
          <li>
            "Once created, the technique could be used over and over again, on any number of
            devices." <Cite ids={['S1']} />
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slides                                                              */
/* ------------------------------------------------------------------ */

// Each slide: section (DT outline step), title, body, notes (spoken script), time (seconds)
const SLIDES = [
  {
    id: 'title',
    time: 30,
    render: () => (
      <div className="slide slide-title-page">
        <div className="title-kicker">Digital Transformation · Team Assignment</div>
        <h1>
          Data Privacy &amp; Security:
          <br />
          Apple vs. FBI
        </h1>
        <div className="title-sub">
          Recommendation to Tim Cook: <b>do not build the backdoor.</b> Keep helping lawfully.
        </div>
        <div className="side-badge">Team Privacy</div>
        <div className="team">
          {TEAM.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </div>
    ),
    notes:
      'Hi everyone, we are Team Privacy. Our client is Apple, and our audience is CEO Tim Cook. The question is whether Apple should obey the 2016 court order to help the FBI unlock the San Bernardino shooter\'s iPhone. Our answer: no. Apple should not build software that breaks its own security, but it should keep giving law enforcement every lawful kind of help it already gives.',
  },
  {
    id: 'agenda',
    section: '1 · Introduction',
    title: 'Our answer up front',
    time: 30,
    body: () => (
      <div className="bluf">
        <div className="bluf-main">
          Tim Cook should <b>refuse</b> the order. A tool that unlocks one iPhone is a master key
          for all of them, and the FBI has shown it can solve cases without one.
        </div>
        <ol className="agenda">
          <li>The case and the stakeholders</li>
          <li>The problem: one phone or a master key?</li>
          <li>Our solution: "Secure by default, lawful by design"</li>
          <li>How it works: technology and management</li>
          <li>Expected outcomes and ROI</li>
          <li>Conclusion</li>
        </ol>
      </div>
    ),
    notes:
      'Here is our bottom line first. Apple should refuse. In the next nine minutes we will scope the case, show both sides fairly, explain why this is a master key and not a single key, lay out our solution, and finish with the outcomes for Apple, its users, and public safety.',
  },
  {
    id: 'case',
    section: '2 · Problem scoping',
    title: 'The case: San Bernardino, 2015–2016',
    time: 50,
    body: () => (
      <div className="timeline">
        {TIMELINE.map((t, i) => (
          <div className="tl-item" key={i}>
            <div className="tl-date">{t.date}</div>
            <div className="tl-dot" />
            <div className="tl-text">{t.text}</div>
          </div>
        ))}
      </div>
    ),
    notes:
      'On December 2, 2015, two attackers killed 14 people in San Bernardino. The FBI recovered one shooter\'s work iPhone 5C, but it was locked. On February 16, 2016, a magistrate judge ordered Apple to help, using the All Writs Act from 1789. That same day Tim Cook published an open letter refusing. Six weeks later, the government dropped the case because an outside firm had already broken in. Since then, the Inspector General found the FBI had not tried all its options, the FBI admitted its count of locked phones was inflated, and in 2024 the FBI itself told Americans to use encryption after Chinese hackers broke into U.S. phone networks.',
  },
  {
    id: 'stakeholders',
    section: '2 · Problem scoping',
    title: 'Client, industry and stakeholders',
    time: 40,
    body: () => (
      <div className="grid-3">
        <div className="card">
          <div className="card-head">Client and industry</div>
          <ul>
            <li><b>Apple</b>, consumer electronics and services</li>
            <li>Over <b>2.35 billion</b> active devices <Cite ids={['S18']} /></li>
            <li>Competitors: Google and Samsung (Android), plus encrypted apps such as WhatsApp and Signal</li>
          </ul>
        </div>
        <div className="card">
          <div className="card-head">Consumers (B2C and B2B)</div>
          <ul>
            <li>Everyday users: photos, health, banking, location</li>
            <li>Businesses and governments that run on iPhones</li>
            <li>Journalists, activists and officials, who are top hacking targets</li>
          </ul>
        </div>
        <div className="card">
          <div className="card-head">Supply chain and others</div>
          <ul>
            <li>Law enforcement: FBI, local police, courts</li>
            <li>Forensic vendors that crack phones (Azimuth was paid about $900,000 here) <Cite ids={['S7']} /></li>
            <li>Foreign governments watching the precedent, such as the UK <Cite ids={['S14']} /></li>
          </ul>
        </div>
        <div className="trend">
          <b>Trend:</b> our lives moved into our phones, and attacks on phones and networks are
          growing. Privacy is now a reason people choose a brand.
        </div>
      </div>
    ),
    notes:
      'Our client is Apple, with more than 2.35 billion active devices. Its competitors are Android makers like Google and Samsung, and secure messaging apps. Stakeholders include everyday users, businesses and governments that run on iPhones, and high-risk users like journalists. On the other side are law enforcement and courts, and a supply chain of forensic companies that sell phone-cracking tools. The big trend is that our whole lives now live on our phones, so whoever can open a phone can open a life.',
  },
  {
    id: 'both-sides',
    section: '2 · Problem scoping',
    title: 'Both sides have real concerns',
    time: 50,
    body: () => (
      <div className="two-col">
        <div>
          <div className="card">
            <div className="card-head">Team Security's strongest points</div>
            <ul>
              <li>14 people were killed; families deserve answers <Cite ids={['S2']} /></li>
              <li>Courts can open a locked safe, so why not a phone?</li>
              <li>
                Pensacola, 2019: the FBI found al-Qaeda links on the shooter's iPhones, but only
                after four months <Cite ids={['S10']} />
              </li>
            </ul>
          </div>
          <div className="card card-main">
            <div className="card-head">Why privacy still outweighs it</div>
            <ul>
              <li>The FBI got into both phones without a backdoor <Cite ids={['S4', 'S10']} /></li>
              <li>A backdoor weakens every user, not just criminals</li>
            </ul>
          </div>
        </div>
        <PewChart />
      </div>
    ),
    notes:
      'We want to be fair. The FBI\'s concerns are real. 14 people died, and in the 2019 Pensacola shooting it took the FBI four months to open the shooter\'s iPhones, which then showed al-Qaeda links. In 2016, 51% of Americans sided with the FBI. But notice two things. Young adults and iPhone owners were split almost evenly. And in both cases, the FBI got in without Apple building a backdoor. So the question is not whether crime matters. It is whether weakening every iPhone is the right price.',
  },
  {
    id: 'problem-key',
    section: '2 · Problem / opportunity',
    title: 'Q1. One phone, or a master key?',
    time: 50,
    body: () => (
      <>
        <KeyDiagram />
        <div className="callout">
          Cook: "it would be the equivalent of a master key, capable of opening hundreds of
          millions of locks." <Cite ids={['S1']} />
        </div>
      </>
    ),
    notes:
      'First question: is this about one phone? On paper, yes. The order asked Apple to write a new version of iOS that turns off auto-erase, lets the FBI guess passcodes by computer, and removes the delays between guesses, and to sign it so the phone trusts it. It was supposed to be tied to this phone\'s ID. But once that code exists, changing one number makes it work on the next phone. Cook called it a master key. The Inspector General\'s report quotes an FBI official calling this case the "poster child" for the "going dark" problem, which tells us the goal was a precedent, not one phone.',
  },
  {
    id: 'precedent-criminals',
    section: '2 · Problem / opportunity',
    title: 'Q2. Does strong encryption let criminals "go dark"?',
    time: 45,
    body: () => (
      <div className="two-col">
        <FbiCountChart />
        <div>
          <div className="card">
            <div className="card-head">The evidence says the threat was overstated</div>
            <ul>
              <li>Inspector General: the FBI had not tried all its options before suing; one vendor was "90 percent" done <Cite ids={['S5', 'S6']} /></li>
              <li>Azimuth unlocked the phone for about $900,000; it reportedly held "nothing of value" <Cite ids={['S7']} /></li>
              <li>FBI's count of locked phones was inflated by about 4 to 8 times <Cite ids={['S8']} /></li>
            </ul>
          </div>
          <div className="callout small">
            Criminals can still be investigated through cloud data, metadata, informants and
            lawful hacking of a single device.
          </div>
        </div>
      </div>
    ),
    notes:
      'Second question: does encryption create a safe haven for criminals? The FBI said in 2017 it had 7,775 phones it could not open. Then it admitted a programming error had counted phones more than once, and the Washington Post estimated the real number was 1,000 to 2,000. In San Bernardino, the Inspector General found the FBI went to court before checking with all its own experts, and a vendor was 90 percent done. An Australian firm opened the phone for about $900,000, and reportedly found nothing useful. Encryption makes some cases harder, but the FBI is far from blind.',
  },
  {
    id: 'precedent-forced',
    section: '2 · Problem / opportunity',
    title: 'Q3. What if tech companies are forced to help?',
    time: 45,
    body: () => (
      <div className="grid-3">
        <div className="card">
          <div className="card-head">A 1789 law, used in a new way</div>
          <p>
            The order relied on the All Writs Act of 1789 <Cite ids={['S2']} />. If it works here, a judge
            could order any company to write code that spies on its own users, without Congress
            ever voting on it.
          </p>
        </div>
        <div className="card">
          <div className="card-head">Other governments follow</div>
          <p>
            In 2025 the UK secretly ordered Apple to open encrypted iCloud data. Apple pulled its
            strongest iCloud protection from UK users rather than build it <Cite ids={['S14']} />.
            Once the U.S. demands a backdoor, every government can ask for the same.
          </p>
        </div>
        <div className="card">
          <div className="card-head">Experts agree</div>
          <p>
            15 leading security experts warned that government "exceptional access" would cause
            even greater damage than in the past <Cite ids={['S15']} />.
          </p>
        </div>
      </div>
    ),
    notes:
      'Third question: what precedent is set if Apple is forced to help? The order used a law from 1789, written long before computers. If that works, any judge could order any company to write surveillance code, without Congress ever voting. And it does not stay in America. In 2025 the UK secretly ordered Apple to open encrypted iCloud data. Apple chose to pull its strongest iCloud protection from UK users instead, and the UK later dropped its demand for American users\' data. Fifteen of the world\'s top cryptographers, in a paper called Keys Under Doormats, warned that government access requirements would do even more damage today.',
  },
  {
    id: 'impact',
    section: '2 · Problem / opportunity',
    title: 'Q4. Impact on security, privacy and public safety',
    time: 45,
    body: () => (
      <>
        <div className="stats">
          <StatTile value="$4.44M" label="Average cost of a data breach worldwide, 2025" src={['S16']} />
          <StatTile value="$10.22M" label="Average cost of a U.S. data breach, a record" src={['S16']} />
          <StatTile value="3" label="Major U.S. carriers hacked by Salt Typhoon, possibly including wiretap systems" src={['S12']} />
        </div>
        <div className="callout">
          After the hack, a CISA official told Americans: "Encryption is your friend." The FBI
          and CISA urged people to use encrypted apps. <Cite ids={['S13']} />
        </div>
        <div className="lesson">
          <b>Lesson:</b> a door built for the police can be opened by criminals and foreign spies.
          Real public safety <i>needs</i> strong encryption.
        </div>
      </>
    ),
    notes:
      'Fourth question: what does this mean for public safety? In 2024, Chinese hackers called Salt Typhoon broke into AT&T, Verizon and Lumen, and may have reached the systems these carriers use for court-ordered wiretaps. That is exactly what a backdoor is: a door built for police that someone else walked through. Afterward, the FBI and CISA told Americans to use encrypted apps. A CISA official said: "Encryption is your friend." Breaches already cost U.S. companies over 10 million dollars each on average. Weaker phones would make that worse. So privacy and public safety are not opposites. Strong encryption is public safety.',
  },
  {
    id: 'solution',
    section: '3 · Recommended solution',
    title: 'Our solution: "Secure by default, lawful by design"',
    time: 50,
    body: () => (
      <div className="pillars">
        <div className="pillar">
          <div className="pillar-num">1</div>
          <div className="pillar-head">Refuse the backdoor</div>
          <p>Challenge the order in court. Never write or sign code that weakens iPhone security.</p>
        </div>
        <div className="pillar">
          <div className="pillar-num">2</div>
          <div className="pillar-head">Help lawfully, fast</div>
          <p>Keep answering warrants with the data Apple holds: iCloud backups, account and transaction data <Cite ids={['S11']} />.</p>
        </div>
        <div className="pillar">
          <div className="pillar-num">3</div>
          <div className="pillar-head">Be transparent</div>
          <p>Publish every request and response, like Apple's transparency report <Cite ids={['S17']} />.</p>
        </div>
        <div className="pillar">
          <div className="pillar-num">4</div>
          <div className="pillar-head">Let Congress decide</div>
          <p>Ask for a public law and debate, not a 1789 statute, and support training for police forensics.</p>
        </div>
      </div>
    ),
    notes:
      'Our recommendation has four parts. One, refuse the order and challenge it in court: Apple should never write or sign code that weakens iPhone security. Two, keep helping lawfully and quickly. In Pensacola, Apple responded within hours and gave the FBI iCloud backups, account information and transaction data. Three, be transparent, publishing every request so users can trust Apple. Four, move the decision to Congress, where it belongs, and support police training in digital forensics that does not need a backdoor.',
  },
  {
    id: 'details',
    section: '4 · Details of the solution',
    title: 'How it works: technology and management',
    time: 50,
    body: () => (
      <div className="two-col">
        <div>
          <div className="card">
            <div className="card-head">Technology</div>
            <ul>
              <li>Passcode-based encryption: Apple itself cannot unlock the phone <Cite ids={['S11']} /></li>
              <li>Auto-erase and delays stop brute-force guessing</li>
              <li>Expand end-to-end encryption to more iCloud data, so stolen servers reveal nothing</li>
            </ul>
          </div>
          <div className="card">
            <div className="card-head">Management</div>
            <ul>
              <li>A 24/7 law enforcement response team with clear rules</li>
              <li>Legal team to fight overbroad orders in the U.S. and abroad</li>
              <li>Partnerships: industry groups, security researchers, police training</li>
            </ul>
          </div>
        </div>
        <TransparencyChart />
      </div>
    ),
    notes:
      'How does this work? On the tech side, the iPhone\'s data is locked with a key built from the user\'s passcode, so even Apple cannot open it. Auto-erase and time delays stop anyone from guessing passcodes. Apple should keep expanding end-to-end encryption to more iCloud data. On the management side, Apple runs a law enforcement response team, and the numbers show it works: in the second half of 2024 Apple gave U.S. agencies data in 73% of device requests and 82% of account requests. Apple also needs a legal team ready to fight overbroad orders, and partnerships with industry groups and police trainers.',
  },
  {
    id: 'outcomes',
    section: '5 · Expected outcomes',
    title: 'Expected outcomes and ROI',
    time: 50,
    body: () => (
      <div className="grid-3">
        <div className="card card-main">
          <div className="card-head">For Apple (ROI)</div>
          <ul>
            <li>Trust protects a base of over 2.35 billion devices <Cite ids={['S18']} /></li>
            <li>Privacy is a brand advantage over data-driven rivals</li>
            <li>Avoids liability if a leaked tool causes breaches costing $10.22M each in the U.S. <Cite ids={['S16']} /></li>
          </ul>
        </div>
        <div className="card">
          <div className="card-head">For users and society</div>
          <ul>
            <li>Every user stays protected, not just the ones who can pay for security</li>
            <li>Journalists, officials and businesses stay safe from spies</li>
            <li>Rules for access are set openly by Congress</li>
          </ul>
        </div>
        <div className="card">
          <div className="card-head">For law enforcement</div>
          <ul>
            <li>Still gets cloud data, metadata and fast Apple support</li>
            <li>Builds its own forensic skills, as in San Bernardino and Pensacola <Cite ids={['S4', 'S10']} /></li>
            <li>No backdoor for hackers to steal from them</li>
          </ul>
        </div>
      </div>
    ),
    notes:
      'What are the expected outcomes? For Apple, the return on investment is trust. Apple has more than 2.35 billion active devices, and privacy is a big part of why people choose it over data-driven rivals. It also avoids the huge liability of a leaked unlocking tool. For users, everyone stays protected, including journalists, officials and businesses. For law enforcement, it still gets cloud data and fast help, and it has already shown it can build its own forensic tools. This is exactly what Apple asked of us: protect the customer and still be a responsible partner to the public.',
  },
  {
    id: 'conclusion',
    section: '6 · Conclusion',
    title: 'Conclusion: privacy is security',
    time: 45,
    body: () => (
      <div className="conclusion">
        <div className="concl-main">
          Tim Cook should <b>not</b> comply with the order to build a backdoor. Apple should keep
          helping lawfully, openly, and fast.
        </div>
        <div className="grid-3">
          <div className="card">
            <div className="card-head">Now</div>
            <p>The FBI solved both major cases without a backdoor. The FBI itself now says to use encryption.</p>
          </div>
          <div className="card">
            <div className="card-head">Future</div>
            <p>More of life moves onto phones and AI assistants. A master key built today would unlock even more tomorrow.</p>
          </div>
          <div className="card">
            <div className="card-head">Engagement</div>
            <p>Users stay with Apple because they trust it. Every refusal of a backdoor renews that promise.</p>
          </div>
        </div>
        <div className="closing-quote">
          "There is no such thing as a backdoor just for the good guys." <Cite ids={['S11']} />
        </div>
      </div>
    ),
    notes:
      'To conclude: Tim Cook should not build the backdoor. The FBI solved San Bernardino and Pensacola without one, its own claims about going dark were inflated, and in 2024 it told Americans to use encryption. Looking ahead, our phones and AI assistants will hold even more of our lives, so a master key built today would open even more tomorrow. Apple keeps its users by keeping its promise. As Apple said in 2020: there is no such thing as a backdoor just for the good guys. Thank you.',
  },
  {
    id: 'sources',
    section: 'References',
    title: 'Sources',
    time: 0,
    body: () => (
      <ol className="sources">
        {SOURCES.map((s) => (
          <li key={s.id}>
            <b>{s.id}.</b> {s.cite}{' '}
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.url}
            </a>
          </li>
        ))}
      </ol>
    ),
    notes: 'Not presented aloud. All sources are listed here and in the printed debate notes.',
  },
];

const TOTAL_SECONDS = SLIDES.reduce((a, s) => a + s.time, 0);

function renderSlide(slide, i) {
  if (slide.render) return slide.render();
  return (
    <SlideFrame section={slide.section} title={slide.title} num={i + 1} total={SLIDES.length}>
      {slide.body()}
    </SlideFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Scaled slide viewport                                               */
/* ------------------------------------------------------------------ */

function ScaledSlide({ children, maxW, maxH }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const w = maxW ?? el.clientWidth;
      const h = maxH ?? el.clientHeight;
      setScale(Math.min(w / W, h / H));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [maxW, maxH]);
  return (
    <div className="stage" ref={ref}>
      <div className="stage-inner" style={{ width: W * scale, height: H * scale }}>
        <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Print / debate notes view                                           */
/* ------------------------------------------------------------------ */

function PrintSlide({ children }) {
  // Fixed scale for letter paper
  const s = 0.55;
  return (
    <div className="print-slide" style={{ width: W * s, height: H * s }}>
      <div style={{ width: W, height: H, transform: `scale(${s})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  );
}

function PrintView({ onExit }) {
  return (
    <div className="print-view">
      <div className="print-toolbar no-print">
        <button onClick={() => window.print()}>Print / Save as PDF</button>
        <button onClick={onExit}>Back to slides</button>
        <span>Tip: print in portrait. Each slide prints with its script, then the debate notes.</span>
      </div>

      <section className="print-page">
        <h1>Apple vs. FBI · Team Privacy · Printed notes</h1>
        <p className="muted">
          {TEAM.join(' · ')}
        </p>
        <p>
          Video length target: {Math.floor(TOTAL_SECONDS / 60)} min {TOTAL_SECONDS % 60} s of script
          across {SLIDES.length - 1} slides. No devices are allowed in the debate, so bring this printout.
        </p>
      </section>

      {SLIDES.map((s, i) => (
        <section className="print-page print-slide-page" key={s.id}>
          <PrintSlide>{renderSlide(s, i)}</PrintSlide>
          <div className="print-notes">
            <div className="print-notes-head">
              Slide {i + 1}: {s.title || 'Title'} {s.time > 0 && <span>· about {s.time} s</span>}
            </div>
            <p>{s.notes}</p>
          </div>
        </section>
      ))}

      <DebateNotes />
    </div>
  );
}

function DebateNotes() {
  return (
    <section className="print-page debate">
      <h1>Debate notes (60-second answers)</h1>
      <p className="muted">{DEBATE_NOTES.intro}</p>

      <h2>Our position in one sentence</h2>
      <p className="one-liner">{DEBATE_NOTES.oneLiner}</p>

      <h2>Numbers to remember</h2>
      <table className="numbers">
        <tbody>
          {DEBATE_NOTES.numbers.map((n) => (
            <tr key={n.fact}>
              <td className="num">{n.value}</td>
              <td>{n.fact}</td>
              <td className="src">{n.src}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Likely questions from the facilitator</h2>
      {DEBATE_NOTES.questions.map((q) => (
        <div className="qa" key={q.q}>
          <div className="q">Q: {q.q}</div>
          <div className="a">{q.a}</div>
        </div>
      ))}

      <h2>Rebuttals to Team Security</h2>
      {DEBATE_NOTES.rebuttals.map((r) => (
        <div className="qa" key={r.claim}>
          <div className="q">They say: "{r.claim}"</div>
          <div className="a">{r.answer}</div>
        </div>
      ))}

      <h2>Weak spots: admit and pivot</h2>
      {DEBATE_NOTES.weakSpots.map((w) => (
        <div className="qa" key={w.issue}>
          <div className="q">{w.issue}</div>
          <div className="a">{w.pivot}</div>
        </div>
      ))}

      <h2>Sources</h2>
      <ol className="sources print-sources">
        {SOURCES.map((s) => (
          <li key={s.id}>
            <b>{s.id}.</b> {s.cite} {s.url}
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const initial = Math.max(0, Math.min(SLIDES.length - 1, parseInt(window.location.hash.slice(1) || '1', 10) - 1 || 0));
  const [index, setIndex] = useState(initial);
  const [showNotes, setShowNotes] = useState(false);
  const [mode, setMode] = useState(window.location.search.includes('print') ? 'print' : 'present');

  const go = useCallback(
    (d) => setIndex((i) => Math.max(0, Math.min(SLIDES.length - 1, i + d))),
    []
  );

  useEffect(() => {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${index + 1}`);
  }, [index]);

  useEffect(() => {
    if (mode !== 'present') return undefined;
    const onKey = (e) => {
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1); }
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1); }
      else if (e.key === 'Home') setIndex(0);
      else if (e.key === 'End') setIndex(SLIDES.length - 1);
      else if (e.key.toLowerCase() === 'n') setShowNotes((v) => !v);
      else if (e.key.toLowerCase() === 'p') setMode('print');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, mode]);

  if (mode === 'print') return <PrintView onExit={() => setMode('present')} />;

  const slide = SLIDES[index];
  const elapsed = SLIDES.slice(0, index).reduce((a, s) => a + s.time, 0);

  return (
    <div className={`app ${showNotes ? 'with-notes' : ''}`}>
      <ScaledSlide key={showNotes ? 'n' : 'f'}>{renderSlide(slide, index)}</ScaledSlide>

      {showNotes && (
        <aside className="notes-panel">
          <div className="notes-meta">
            Slide {index + 1} of {SLIDES.length} · about {slide.time} s · starts at{' '}
            {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')} of{' '}
            {Math.floor(TOTAL_SECONDS / 60)}:{String(TOTAL_SECONDS % 60).padStart(2, '0')}
          </div>
          <p>{slide.notes}</p>
        </aside>
      )}

      <nav className="controls">
        <button onClick={() => go(-1)} disabled={index === 0} aria-label="Previous slide">‹</button>
        <span>
          {index + 1} / {SLIDES.length}
        </span>
        <button onClick={() => go(1)} disabled={index === SLIDES.length - 1} aria-label="Next slide">›</button>
        <button onClick={() => setShowNotes((v) => !v)}>{showNotes ? 'Hide notes' : 'Notes (N)'}</button>
        <button onClick={() => setMode('print')}>Print notes (P)</button>
      </nav>
    </div>
  );
}
