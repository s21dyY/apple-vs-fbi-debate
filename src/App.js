import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TEAM, SOURCES, TIMELINE, ERAS } from './data.js';
import { DEBATE_NOTES } from './debateNotes.js';
import {
  StepCtx, NavCtx, Step, CountUp, Icon, Cite,
  PewChart, FbiCountChart, TransparencyChart, MasterKeyDemo, BruteForceDemo,
} from './interactive.js';
import Practice from './Practice.js';

const W = 1280;
const H = 720;
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/* ------------------------------------------------------------------ */
/* Slide chrome                                                        */
/* ------------------------------------------------------------------ */

function SlideFrame({ section, title, children, num, total, dark }) {
  return (
    <div className={`slide ${dark ? 'dark' : ''}`}>
      <header className="slide-head">
        {section && <div className="section-tag"><span>{section.split(' · ')[0]}</span>{section.split(' · ')[1]}</div>}
        {title && <h2 className="slide-title">{title}</h2>}
      </header>
      <div className="slide-body">{children}</div>
      <footer className="slide-footer">
        <span className="brand"><Icon name="shield" size={14} /> Team Privacy · Apple vs. FBI</span>
        {num != null && (
          <span className="foot-progress">
            <i style={{ width: `${(num / total) * 100}%` }} />
          </span>
        )}
        {num != null && <span>{String(num).padStart(2, '0')} / {total}</span>}
      </footer>
    </div>
  );
}

function CardHead({ icon, children }) {
  return (
    <div className="card-head">
      {icon && <span className="card-icon"><Icon name={icon} size={20} /></span>}
      {children}
    </div>
  );
}

function StatTile({ children, label, src, tone }) {
  return (
    <div className={`stat ${tone || ''}`}>
      <div className="stat-value">{children}</div>
      <div className="stat-label">{label} {src && <Cite ids={src} />}</div>
    </div>
  );
}

function Agenda() {
  const { goto } = useContext(NavCtx);
  const items = [
    ['The case and the stakeholders', 'case'],
    ['The problem: one phone or a master key?', 'problem-key'],
    ['Our solution: secure by default, lawful by design', 'solution'],
    ['How it works: technology and management', 'details'],
    ['Expected outcomes and ROI', 'outcomes'],
    ['Conclusion', 'conclusion'],
  ];
  return (
    <ol className="agenda">
      {items.map(([t, id], i) => (
        <li key={id}>
          <button onClick={(e) => { e.currentTarget.blur(); goto(id); }}>
            <span className="agenda-n">{String(i + 1).padStart(2, '0')}</span>
            {t}
            <span className="agenda-go">›</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

function TimelineEras() {
  return (
    <div className="eras">
      <div className="eras-rail" />
      {ERAS.map((era, e) => (
        <Step n={e} key={era} className={`era era-${e}`}>
          <div className="era-head">
            <span className="era-dot" />
            <span className="era-name">{era}</span>
          </div>
          {TIMELINE.filter((t) => t.era === e).map((t, i) => {
            const m = t.text.match(/^(.*?)\s*\(((?:S\d+(?:, )?)+)\)(.*)$/);
            return (
              <div className="tl-card" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="tl-date">{t.date}</div>
                <div className="tl-text">
                  {m ? <>{m[1]}{m[3]} <Cite ids={m[2].split(', ')} /></> : t.text}
                </div>
              </div>
            );
          })}
        </Step>
      ))}
    </div>
  );
}

function TitlePage() {
  return (
    <div className="slide slide-title-page">
      <div className="title-glow" />
      <div className="title-lock">
        <svg viewBox="0 0 200 240" width="300" height="360" aria-hidden="true">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7cb8ff" />
              <stop offset="1" stopColor="#2a6fd6" />
            </linearGradient>
          </defs>
          <path d="M55 105V72a45 45 0 0 1 90 0v33" fill="none" stroke="url(#lg)" strokeWidth="16" strokeLinecap="round" className="shackle" />
          <rect x="25" y="100" width="150" height="125" rx="24" fill="url(#lg)" opacity=".95" />
          <circle cx="100" cy="152" r="14" fill="#0b1220" />
          <rect x="94" y="158" width="12" height="32" rx="6" fill="#0b1220" />
        </svg>
      </div>
      <div className="title-content">
        <div className="title-kicker">Digital Transformation · Team Assignment</div>
        <h1>Data Privacy &amp; Security<br /><span>Apple vs. FBI</span></h1>
        <div className="title-sub">
          Our recommendation to Tim Cook: <b>do not build the backdoor.</b> Keep helping law enforcement lawfully.
        </div>
        <div className="side-badge"><Icon name="shield" size={18} /> Team Privacy</div>
        <div className="team">{TEAM.map((n) => <span key={n}>{n}</span>)}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slides                                                              */
/* ------------------------------------------------------------------ */

// Each slide: section (DT outline step), title, steps (clicks to build), body, notes (script), time (s)
const SLIDES = [
  {
    id: 'title',
    time: 30,
    steps: 0,
    render: () => <TitlePage />,
    notes:
      'Hi everyone, we are Team Privacy. Our client is Apple, and our audience is CEO Tim Cook. The question is whether Apple should obey the 2016 court order to help the FBI unlock the San Bernardino shooter\'s iPhone. Our answer: no. Apple should not build software that breaks its own security, but it should keep giving law enforcement every lawful kind of help it already gives.',
  },
  {
    id: 'agenda',
    section: '01 · Introduction',
    title: 'Our answer up front',
    time: 20,
    steps: 1,
    body: () => (
      <div className="bluf">
        <div className="bluf-main">
          <div className="bluf-label">Recommendation</div>
          Tim Cook should <b>refuse</b> the order. A tool that unlocks one iPhone is a master key
          for all of them, and the FBI has shown it can solve cases without one.
        </div>
        <Step n={1}><Agenda /></Step>
      </div>
    ),
    notes:
      'Here is our bottom line first: Apple should refuse. We will scope the case, show both sides fairly, explain why this is a master key and not a single key, lay out our solution, and finish with the outcomes for Apple, its users, and public safety.',
  },
  {
    id: 'case',
    section: '02 · Problem scoping',
    title: 'The case: San Bernardino and what followed',
    time: 45,
    steps: 2,
    body: () => <TimelineEras />,
    notes:
      'On December 2, 2015, two attackers killed 14 people in San Bernardino. The FBI recovered one shooter\'s work iPhone 5C, but it was locked. On February 16, 2016, a magistrate judge ordered Apple to help, using the All Writs Act from 1789. That same day Tim Cook published an open letter refusing. Six weeks later, the government dropped the case because an outside firm had already broken in. [click] Since then, the Inspector General found the FBI had not tried all its options, the FBI admitted its count of locked phones was inflated, and it opened the Pensacola shooter\'s phones on its own. [click] And in 2024 the FBI itself told Americans to use encryption after Chinese hackers broke into U.S. phone networks.',
  },
  {
    id: 'stakeholders',
    section: '02 · Problem scoping',
    title: 'Client, industry and stakeholders',
    time: 35,
    steps: 3,
    body: () => (
      <div className="grid-3">
        <div className="card">
          <CardHead icon="building">Client and industry</CardHead>
          <div className="mini-stat"><b><CountUp to={2.35} decimals={2} suffix="B+" /></b> <span>active Apple devices <Cite ids={['S18']} /></span></div>
          <ul>
            <li><b>Apple</b>: consumer electronics and services</li>
            <li>Rivals: Google and Samsung (Android), encrypted apps such as WhatsApp and Signal</li>
          </ul>
        </div>
        <Step n={1} className="card">
          <CardHead icon="users">Consumers (B2C and B2B)</CardHead>
          <ul>
            <li>Everyday users: photos, health, banking, location</li>
            <li>Businesses and governments that run on iPhones</li>
            <li>Journalists, activists and officials: top hacking targets</li>
          </ul>
        </Step>
        <Step n={2} className="card">
          <CardHead icon="scale">Supply chain and others</CardHead>
          <ul>
            <li>Law enforcement: FBI, local police, courts</li>
            <li>Forensic vendors that crack phones (Azimuth: ~$900,000 here) <Cite ids={['S7']} /></li>
            <li>Foreign governments watching the precedent, such as the UK <Cite ids={['S14']} /></li>
          </ul>
        </Step>
        <Step n={3} className="trend">
          <Icon name="chart" /> <span><b>Trend:</b> our lives moved into our phones while attacks on phones and networks grow.
          Privacy is now a reason people choose a brand.</span>
        </Step>
      </div>
    ),
    notes:
      'Our client is Apple, with more than 2.35 billion active devices. Its competitors are Android makers like Google and Samsung, and secure messaging apps. [click] Stakeholders include everyday users, businesses and governments that run on iPhones, and high-risk users like journalists. [click] On the other side are law enforcement and courts, and a supply chain of forensic companies that sell phone-cracking tools. [click] The big trend: our whole lives now live on our phones, so whoever can open a phone can open a life.',
  },
  {
    id: 'both-sides',
    section: '02 · Problem scoping',
    title: 'Both sides have real concerns',
    time: 50,
    steps: 2,
    body: () => (
      <div className="two-col">
        <div>
          <div className="card card-other">
            <CardHead icon="landmark">Team Security's strongest points</CardHead>
            <ul>
              <li>14 people were killed; families deserve answers <Cite ids={['S2']} /></li>
              <li>Courts can open a locked safe, so why not a phone?</li>
              <li>Pensacola, 2019: al-Qaeda links on the shooter's iPhones, found only after four months <Cite ids={['S10']} /></li>
            </ul>
          </div>
          <Step n={2} className="card card-main">
            <CardHead icon="shield">Why privacy still outweighs it</CardHead>
            <ul>
              <li>The FBI got into both phones without a backdoor <Cite ids={['S4', 'S10']} /></li>
              <li>A backdoor weakens every user, not just criminals</li>
            </ul>
          </Step>
        </div>
        <Step n={1}><PewChart /></Step>
      </div>
    ),
    notes:
      'We want to be fair. The FBI\'s concerns are real. 14 people died, and in the 2019 Pensacola shooting it took the FBI four months to open the shooter\'s iPhones, which then showed al-Qaeda links. [click] In 2016, 51% of Americans sided with the FBI. But [click the group buttons] young adults and iPhone owners were split almost evenly. [click] And in both cases, the FBI got in without Apple building a backdoor. So the question is not whether crime matters. It is whether weakening every iPhone is the right price.',
  },
  {
    id: 'problem-key',
    section: '02 · Problem / opportunity',
    title: 'Q1. One phone, or a master key?',
    time: 50,
    steps: 2,
    body: () => (
      <div className="key-layout">
        <div className="card">
          <CardHead icon="landmark">What the order asked for <Cite ids={['S3']} /></CardHead>
          <ol className="order-list">
            <li>Disable auto-erase after 10 wrong passcodes</li>
            <li>Let the FBI enter passcodes by computer</li>
            <li>Remove the delays between guesses</li>
            <li>Deliver it as new <b>Apple-signed</b> software, tied to one phone's ID</li>
          </ol>
        </div>
        <MasterKeyDemo oneAt={1} cascadeAt={2} />
        <Step n={2} className="callout quote">
          "Once created, the technique could be used over and over again, on any number of devices."
          <span className="quote-by">Tim Cook, open letter <Cite ids={['S1']} /></span>
        </Step>
      </div>
    ),
    notes:
      'First question: is this about one phone? On paper, yes. The order asked Apple to write a new version of iOS that turns off auto-erase, lets the FBI guess passcodes by computer, and removes the delays between guesses, and to sign it so the phone trusts it. [click] It was supposed to be tied to this one phone\'s ID. [click] But once that code exists, changing one number makes it work on the next phone, and the next. Cook called it a master key. The Inspector General\'s report quotes an FBI official calling this case the "poster child" for the "going dark" problem, which tells us the goal was a precedent, not one phone.',
  },
  {
    id: 'brute-force',
    section: '02 · Problem / opportunity',
    title: 'Why those protections matter',
    time: 35,
    steps: 1,
    body: () => <BruteForceDemo revealAt={1} />,
    notes:
      'Why do those protections matter so much? Every passcode guess on an iPhone costs about 80 milliseconds of hardware math. As Apple ships it, you get ten guesses, with forced waits of up to an hour, and then the phone can erase itself. For a 4-digit code, that is a one-in-a-thousand chance. [click] With the tool the FBI asked for, a computer guesses non-stop: every 4-digit code in about 13 minutes, every 6-digit code in under a day. On the iPhone 5C those limits lived in software, so an Apple-signed update could switch them off. That is the lock the order asked Apple to break.',
  },
  {
    id: 'precedent-criminals',
    section: '02 · Problem / opportunity',
    title: 'Q2. Does strong encryption let criminals "go dark"?',
    time: 45,
    steps: 2,
    body: () => (
      <div className="two-col">
        <FbiCountChart />
        <div>
          <Step n={1} className="card">
            <CardHead icon="eye">The evidence says the threat was overstated</CardHead>
            <ul>
              <li>Inspector General: the FBI had not tried all its options before suing; one vendor was "90 percent" done <Cite ids={['S5', 'S6']} /></li>
              <li>Azimuth unlocked the phone for about $900,000; it reportedly held "nothing of value" <Cite ids={['S7']} /></li>
              <li>The FBI's locked-phone count was inflated about 4 to 8 times <Cite ids={['S8']} /></li>
            </ul>
          </Step>
          <Step n={2} className="callout small">
            Criminals can still be investigated through cloud data, metadata, informants and
            lawful hacking of a single device.
          </Step>
        </div>
      </div>
    ),
    notes:
      'Second question: does encryption create a safe haven for criminals? The FBI said in 2017 it had 7,775 phones it could not open. Then it admitted a programming error had counted phones more than once, and the Washington Post estimated the real number was 1,000 to 2,000. [click] In San Bernardino, the Inspector General found the FBI went to court before checking with all its own experts, and a vendor was 90 percent done. An Australian firm opened the phone for about $900,000, and reportedly found nothing useful. [click] Encryption makes some cases harder, but the FBI is far from blind.',
  },
  {
    id: 'precedent-forced',
    section: '02 · Problem / opportunity',
    title: 'Q3. What if tech companies are forced to help?',
    time: 45,
    steps: 2,
    body: () => (
      <div className="grid-3 domino">
        <div className="card card-num">
          <div className="big-num">1789</div>
          <CardHead icon="landmark">An old law, used in a new way</CardHead>
          <p>
            The order relied on the All Writs Act <Cite ids={['S2']} />. If it works here, a judge could
            order any company to write code that spies on its own users, without Congress ever voting.
          </p>
        </div>
        <Step n={1} className="card card-num">
          <div className="big-num">2025</div>
          <CardHead icon="globe">Other governments follow</CardHead>
          <p>
            The UK secretly ordered Apple to open encrypted iCloud data. Apple pulled its strongest
            iCloud protection from UK users rather than build it <Cite ids={['S14']} />.
          </p>
        </Step>
        <Step n={2} className="card card-num">
          <div className="big-num">15</div>
          <CardHead icon="users">Experts agree</CardHead>
          <p>
            Leading security experts warned that government "exceptional access" would cause even
            greater damage than in the past <Cite ids={['S15']} />.
          </p>
        </Step>
      </div>
    ),
    notes:
      'Third question: what precedent is set if Apple is forced to help? The order used a law from 1789, written long before computers. If that works, any judge could order any company to write surveillance code, without Congress ever voting. [click] And it does not stay in America. In 2025 the UK secretly ordered Apple to open encrypted iCloud data. Apple chose to pull its strongest iCloud protection from UK users instead, and the UK later dropped its demand for American users\' data. [click] Fifteen of the world\'s top cryptographers, in a paper called Keys Under Doormats, warned that government access requirements would do even more damage today.',
  },
  {
    id: 'impact',
    section: '02 · Problem / opportunity',
    title: 'Q4. Impact on security, privacy and public safety',
    time: 45,
    steps: 2,
    body: () => (
      <>
        <div className="stats">
          <StatTile label="Average cost of a data breach worldwide, 2025" src={['S16']}>
            <CountUp to={4.44} decimals={2} prefix="$" suffix="M" />
          </StatTile>
          <StatTile label="Average cost of a U.S. data breach, a record" src={['S16']} tone="risk">
            <CountUp to={10.22} decimals={2} prefix="$" suffix="M" />
          </StatTile>
          <StatTile label="Major U.S. carriers hacked by Salt Typhoon, possibly including wiretap systems" src={['S12']} tone="risk">
            <CountUp to={3} />
          </StatTile>
        </div>
        <Step n={1} className="callout quote">
          "Encryption is your friend."
          <span className="quote-by">CISA official, after the FBI and CISA urged Americans to use encrypted apps <Cite ids={['S13']} /></span>
        </Step>
        <Step n={2} className="lesson">
          <Icon name="key" size={28} />
          <span><b>Lesson:</b> a door built for the police can be opened by criminals and foreign spies.
          Real public safety <i>needs</i> strong encryption.</span>
        </Step>
      </>
    ),
    notes:
      'Fourth question: what does this mean for public safety? In 2024, Chinese hackers called Salt Typhoon broke into AT&T, Verizon and Lumen, and may have reached the systems these carriers use for court-ordered wiretaps. That is exactly what a backdoor is: a door built for police that someone else walked through. Breaches already cost U.S. companies over 10 million dollars each on average. [click] Afterward, the FBI and CISA told Americans to use encrypted apps. A CISA official said: "Encryption is your friend." [click] So privacy and public safety are not opposites. Strong encryption is public safety.',
  },
  {
    id: 'solution',
    section: '03 · Recommended solution',
    title: 'Our solution: secure by default, lawful by design',
    time: 50,
    steps: 3,
    body: () => (
      <div className="pillars">
        {[
          ['shield', 'Refuse the backdoor', <>Challenge the order in court. Never write or sign code that weakens iPhone security.</>],
          ['bolt', 'Help lawfully, fast', <>Keep answering warrants with the data Apple holds: iCloud backups, account and transaction data <Cite ids={['S11']} />.</>],
          ['eye', 'Be transparent', <>Publish every request and response, as in Apple's transparency report <Cite ids={['S17']} />.</>],
          ['landmark', 'Let Congress decide', <>Ask for a public law and debate, not a 1789 statute, and fund police forensics training.</>],
        ].map(([icon, head, text], i) => (
          <Step n={i} key={head} className="pillar">
            <div className="pillar-top">
              <span className="pillar-num">{i + 1}</span>
              <Icon name={icon} size={26} />
            </div>
            <div className="pillar-head">{head}</div>
            <p>{text}</p>
          </Step>
        ))}
        <Step n={3} className="will-wont">
          <div className="ww will">
            <div className="ww-head"><Icon name="check" size={20} /> Apple will</div>
            <div>Hand over the data it holds · respond within hours · publish every request</div>
          </div>
          <div className="ww wont">
            <div className="ww-head"><Icon name="lock" size={20} /> Apple won't</div>
            <div>Write, sign or ship code that weakens every iPhone</div>
          </div>
        </Step>
      </div>
    ),
    notes:
      'Our recommendation has four parts. One, refuse the order and challenge it in court: Apple should never write or sign code that weakens iPhone security. [click] Two, keep helping lawfully and quickly. In Pensacola, Apple responded within hours and gave the FBI iCloud backups, account information and transaction data. [click] Three, be transparent, publishing every request so users can trust Apple. [click] Four, move the decision to Congress, where it belongs, and support police training in digital forensics that does not need a backdoor.',
  },
  {
    id: 'details',
    section: '04 · Details of the solution',
    title: 'How it works: technology and management',
    time: 50,
    steps: 2,
    body: () => (
      <div className="two-col compact">
        <div>
          <div className="card card-main">
            <CardHead icon="lock">Technology</CardHead>
            <ul>
              <li>Passcode-based encryption: Apple itself cannot unlock the phone <Cite ids={['S11', 'S19']} /></li>
              <li>Guess limits, delays and auto-erase stop brute force (Exhibit 3)</li>
              <li>Expand end-to-end encryption to more iCloud data, so stolen servers reveal nothing</li>
            </ul>
          </div>
          <Step n={1} className="card">
            <CardHead icon="users">Management</CardHead>
            <ul>
              <li>A 24/7 law enforcement response team with clear rules</li>
              <li>Legal team to fight overbroad orders in the U.S. and abroad</li>
              <li>Partnerships: industry groups, security researchers, police training</li>
            </ul>
          </Step>
        </div>
        <Step n={2}><TransparencyChart /></Step>
      </div>
    ),
    notes:
      'How does this work? On the tech side, the iPhone\'s data is locked with a key built from the user\'s passcode, so even Apple cannot open it, and the guess limits we just saw stop brute force. Apple should keep expanding end-to-end encryption to more iCloud data. [click] On the management side, Apple runs a law enforcement response team, a legal team ready to fight overbroad orders, and partnerships with industry groups and police trainers. [click] And the numbers show it works: in the second half of 2024 Apple gave U.S. agencies data in 73% of device requests and 82% of account requests.',
  },
  {
    id: 'outcomes',
    section: '05 · Expected outcomes',
    title: 'Expected outcomes and ROI',
    time: 50,
    steps: 2,
    body: () => (
      <div className="grid-3">
        <div className="card card-main">
          <CardHead icon="chart">For Apple (ROI)</CardHead>
          <div className="mini-stat"><b><CountUp to={2.35} decimals={2} suffix="B+" /></b> <span>devices whose trust is protected <Cite ids={['S18']} /></span></div>
          <ul>
            <li>Privacy is a brand advantage over data-driven rivals</li>
            <li>Avoids liability if a leaked tool causes breaches ($10.22M each in the U.S.) <Cite ids={['S16']} /></li>
          </ul>
        </div>
        <Step n={1} className="card">
          <CardHead icon="users">For users and society</CardHead>
          <ul>
            <li>Every user stays protected, not just those who can pay for security</li>
            <li>Journalists, officials and businesses stay safe from spies</li>
            <li>Rules for access are set openly by Congress</li>
          </ul>
        </Step>
        <Step n={2} className="card">
          <CardHead icon="landmark">For law enforcement</CardHead>
          <ul>
            <li>Still gets cloud data, metadata and fast Apple support</li>
            <li>Builds its own forensic skills, as in San Bernardino and Pensacola <Cite ids={['S4', 'S10']} /></li>
            <li>No backdoor for hackers to steal from them</li>
          </ul>
        </Step>
      </div>
    ),
    notes:
      'What are the expected outcomes? For Apple, the return on investment is trust. Apple has more than 2.35 billion active devices, and privacy is a big part of why people choose it over data-driven rivals. It also avoids the huge liability of a leaked unlocking tool. [click] For users, everyone stays protected, including journalists, officials and businesses. [click] For law enforcement, it still gets cloud data and fast help, and it has already shown it can build its own forensic tools. This is exactly what Apple asked of us: protect the customer and still be a responsible partner to the public.',
  },
  {
    id: 'conclusion',
    section: '06 · Conclusion',
    title: 'Privacy is security',
    dark: true,
    time: 45,
    steps: 2,
    body: () => (
      <div className="conclusion">
        <div className="concl-main">
          Tim Cook should <b>not</b> comply with the order to build a backdoor.
          Apple should keep helping lawfully, openly, and fast.
        </div>
        <div className="grid-3">
          {[
            ['clock', 'Now', 'The FBI solved both major cases without a backdoor, and now tells Americans to use encryption.'],
            ['bolt', 'Future', 'More of life moves onto phones and AI assistants. A master key built today unlocks even more tomorrow.'],
            ['shield', 'Engagement', 'Users stay with Apple because they trust it. Every refusal of a backdoor renews that promise.'],
          ].map(([icon, head, text]) => (
            <Step n={1} key={head} className="card">
              <CardHead icon={icon}>{head}</CardHead>
              <p>{text}</p>
            </Step>
          ))}
        </div>
        <Step n={2} className="closing-quote">
          "There is no such thing as a backdoor just for the good guys." <Cite ids={['S11']} />
        </Step>
      </div>
    ),
    notes:
      'To conclude: Tim Cook should not build the backdoor. [click] The FBI solved San Bernardino and Pensacola without one, its own claims about going dark were inflated, and in 2024 it told Americans to use encryption. Looking ahead, our phones and AI assistants will hold even more of our lives, so a master key built today would open even more tomorrow. Apple keeps its users by keeping its promise. [click] As Apple said in 2020: there is no such thing as a backdoor just for the good guys. Thank you.',
  },
  {
    id: 'sources',
    section: 'References',
    title: 'Sources',
    time: 0,
    steps: 0,
    body: () => (
      <ol className="sources">
        {SOURCES.map((s) => (
          <li key={s.id}>
            <b>{s.id}</b> {s.cite}{' '}
            <a href={s.url} target="_blank" rel="noreferrer">{s.url.replace(/^https?:\/\/(www\.)?/, '')}</a>
          </li>
        ))}
      </ol>
    ),
    notes: 'Not presented aloud. All sources are listed here and in the printed debate notes.',
  },
];

// ?built shows every slide fully built (handy for exporting stills)
const BUILT = window.location.search.includes('built');
const TOTAL_SECONDS = SLIDES.reduce((a, s) => a + s.time, 0);
const START_AT = SLIDES.map((_, i) => SLIDES.slice(0, i).reduce((a, s) => a + s.time, 0));

function renderSlide(slide, i) {
  if (slide.render) return slide.render();
  return (
    <SlideFrame section={slide.section} title={slide.title} num={i + 1} total={SLIDES.length} dark={slide.dark}>
      {slide.body()}
    </SlideFrame>
  );
}

// A slide rendered with every build step visible and no animation (print, overview).
function StaticSlide({ slide, i, scale }) {
  return (
    <div className="static-slide" style={{ width: W * scale, height: H * scale }}>
      <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <StepCtx.Provider value={{ step: 99, all: true }}>{renderSlide(slide, i)}</StepCtx.Provider>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scaled slide viewport                                               */
/* ------------------------------------------------------------------ */

function ScaledSlide({ children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    const update = () => el && setScale(Math.min(el.clientWidth / W, el.clientHeight / H));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
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

function PrintView({ onExit }) {
  return (
    <div className="print-view">
      <div className="print-toolbar no-print">
        <button onClick={() => window.print()}>Print / Save as PDF</button>
        <button onClick={onExit}>Back to slides</button>
        <span>Print in portrait. Each slide prints fully built, with its script, then the debate notes.</span>
      </div>

      <section className="print-page">
        <h1>Apple vs. FBI · Team Privacy · Printed notes</h1>
        <p className="muted">{TEAM.join(' · ')}</p>
        <p>
          Video length target: {Math.floor(TOTAL_SECONDS / 60)} min {TOTAL_SECONDS % 60} s of script
          across {SLIDES.length - 1} slides. No devices are allowed in the debate, so bring this printout.
          "[click]" in the script marks where to advance the next build step.
        </p>
      </section>

      {SLIDES.map((s, i) => (
        <section className="print-page print-slide-page" key={s.id}>
          <StaticSlide slide={s} i={i} scale={0.55} />
          <div className="print-notes">
            <div className="print-notes-head">
              Slide {i + 1}: {s.title || 'Title'} {s.time > 0 && <span>· about {s.time} s · starts {mmss(START_AT[i])}</span>}
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
          <li key={s.id}><b>{s.id}.</b> {s.cite} {s.url}</li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Overlays: overview grid and keyboard help                           */
/* ------------------------------------------------------------------ */

function Overview({ current, onPick, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="overview" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-head">
          <b>All slides</b> <span>Click a slide to jump · Esc to close</span>
        </div>
        <div className="overview-grid">
          {SLIDES.map((s, i) => (
            <button key={s.id} className={`thumb ${i === current ? 'on' : ''}`} onClick={() => onPick(i)}>
              <StaticSlide slide={s} i={i} scale={0.2} />
              <span className="thumb-cap">{i + 1}. {s.title || 'Title'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const KEYS = [
  ['→  Space', 'Next build step / slide'],
  ['←', 'Previous'],
  ['O', 'Overview of all slides'],
  ['N', 'Speaker script and timing'],
  ['T', 'Start / reset the talk timer'],
  ['F', 'Fullscreen (for recording)'],
  ['D', 'Debate drill with a 60 s clock'],
  ['P', 'Print view with notes'],
  ['?', 'This help'],
];

function Help({ onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="help" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-head"><b>Keyboard shortcuts</b></div>
        <table>
          <tbody>
            {KEYS.map(([k, v]) => (
              <tr key={k}><td><kbd>{k}</kbd></td><td>{v}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const initial = Math.max(0, Math.min(SLIDES.length - 1, (parseInt(window.location.hash.slice(1), 10) || 1) - 1));
  const [pos, setPos] = useState({ i: initial, s: 0 });
  const [showNotes, setShowNotes] = useState(false);
  const [overlay, setOverlay] = useState(null); // 'overview' | 'help' | null
  const [mode, setMode] = useState(() => {
    const q = window.location.search;
    return q.includes('print') ? 'print' : q.includes('drill') ? 'drill' : 'present';
  });
  const [talkStart, setTalkStart] = useState(null);
  const [, setTick] = useState(0);

  const next = useCallback(() => setPos(({ i, s }) => {
    if (s < SLIDES[i].steps) return { i, s: s + 1 };
    if (i < SLIDES.length - 1) return { i: i + 1, s: 0 };
    return { i, s };
  }), []);
  const prev = useCallback(() => setPos(({ i, s }) => {
    if (s > 0) return { i, s: s - 1 };
    if (i > 0) return { i: i - 1, s: SLIDES[i - 1].steps };
    return { i, s };
  }), []);
  const gotoIndex = useCallback((i) => setPos({ i, s: 0 }), []);
  const nav = { goto: (id) => gotoIndex(Math.max(0, SLIDES.findIndex((s) => s.id === id))) };

  useEffect(() => {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${pos.i + 1}`);
  }, [pos.i]);

  useEffect(() => {
    if (talkStart == null) return undefined;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [talkStart]);

  useEffect(() => {
    if (mode !== 'present') return undefined;
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (overlay) {
        if (e.key === 'Escape' || k === 'o' || e.key === '?') setOverlay(null);
        return;
      }
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
      else if (e.key === 'Home') gotoIndex(0);
      else if (e.key === 'End') gotoIndex(SLIDES.length - 1);
      else if (k === 'n') setShowNotes((v) => !v);
      else if (k === 'o') setOverlay('overview');
      else if (e.key === '?') setOverlay('help');
      else if (k === 't') setTalkStart((t) => (t == null ? Date.now() : null));
      else if (k === 'f') {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.();
      } else if (k === 'd') setMode('drill');
      else if (k === 'p') setMode('print');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, gotoIndex, mode, overlay]);

  // Export helpers: ?export#n renders one bare, fully built slide; ?notes lists the speaker notes as JSON.
  if (window.location.search.includes('export')) {
    return <div className="export-view"><StaticSlide slide={SLIDES[pos.i]} i={pos.i} scale={1} /></div>;
  }
  if (window.location.search.includes('notes')) {
    return <pre id="notes-json">{JSON.stringify(SLIDES.map((s) => ({ title: s.title || 'Title', notes: s.notes })))}</pre>;
  }
  if (mode === 'print') return <PrintView onExit={() => setMode('present')} />;
  if (mode === 'drill') return <Practice onExit={() => setMode('present')} />;

  const slide = SLIDES[pos.i];
  const elapsed = talkStart == null ? null : (Date.now() - talkStart) / 1000;
  const drift = elapsed == null ? 0 : elapsed - START_AT[pos.i];
  const nextSlide = SLIDES[pos.i + 1];

  return (
    <NavCtx.Provider value={nav}>
      <div className={`app ${showNotes ? 'with-notes' : ''}`}>
        <ScaledSlide>
          <StepCtx.Provider value={{ step: pos.s, all: BUILT }}>
            <div className="slide-enter" key={pos.i}>{renderSlide(slide, pos.i)}</div>
          </StepCtx.Provider>
        </ScaledSlide>

        {showNotes && (
          <aside className="notes-panel">
            <div className="notes-meta">
              <span>Slide {pos.i + 1}/{SLIDES.length}</span>
              <span>Build step {pos.s}/{slide.steps}</span>
              <span>~{slide.time}s · planned start {mmss(START_AT[pos.i])} of {mmss(TOTAL_SECONDS)}</span>
              {elapsed != null && (
                <span className={Math.abs(drift) < 15 ? 'pace-ok' : drift > 0 ? 'pace-late' : 'pace-early'}>
                  {Math.abs(drift) < 15 ? 'On pace' : drift > 0 ? `${Math.round(drift)}s behind` : `${Math.round(-drift)}s ahead`}
                </span>
              )}
              {nextSlide && <span className="notes-next">Next: {nextSlide.title}</span>}
            </div>
            <p>{slide.notes.split('[click]').map((part, k) => (
              <React.Fragment key={k}>{k > 0 && <mark>click</mark>}{part}</React.Fragment>
            ))}</p>
          </aside>
        )}

        <nav className="controls" onMouseUp={() => document.activeElement?.blur()}>
          <div className="ctl-group">
            <button onClick={prev} disabled={pos.i === 0 && pos.s === 0} aria-label="Previous">‹</button>
            <span className="ctl-pos">
              {pos.i + 1} / {SLIDES.length}
              {slide.steps > 0 && (
                <span className="dots">
                  {Array.from({ length: slide.steps + 1 }, (_, k) => <i key={k} className={k <= pos.s ? 'on' : ''} />)}
                </span>
              )}
            </span>
            <button onClick={next} disabled={pos.i === SLIDES.length - 1 && pos.s === slide.steps} aria-label="Next">›</button>
          </div>
          <div className="ctl-progress"><i style={{ width: `${(START_AT[pos.i] / TOTAL_SECONDS) * 100}%` }} /></div>
          <div className="ctl-group">
            <button onClick={() => setTalkStart((t) => (t == null ? Date.now() : null))} className={talkStart ? 'live' : ''}>
              {elapsed == null ? 'Timer (T)' : `● ${mmss(elapsed)}`}
            </button>
            <button onClick={() => setShowNotes((v) => !v)}>{showNotes ? 'Hide notes' : 'Notes (N)'}</button>
            <button onClick={() => setOverlay('overview')}>Overview (O)</button>
            <button onClick={() => setMode('drill')}>Drill (D)</button>
            <button onClick={() => setMode('print')}>Print (P)</button>
            <button onClick={() => setOverlay('help')} aria-label="Keyboard shortcuts">?</button>
          </div>
        </nav>

        {overlay === 'overview' && (
          <Overview current={pos.i} onClose={() => setOverlay(null)}
            onPick={(i) => { gotoIndex(i); setOverlay(null); }} />
        )}
        {overlay === 'help' && <Help onClose={() => setOverlay(null)} />}
      </div>
    </NavCtx.Provider>
  );
}
