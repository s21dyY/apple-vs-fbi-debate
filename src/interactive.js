import React, { createContext, useContext, useEffect, useState } from 'react';
import { FBI_COUNT, PEW, PEW_SUBGROUPS, TRANSPARENCY, PASSCODE } from './data.js';

export const fmt = (n) => n.toLocaleString('en-US');

/* ------------------------------------------------------------------ */
/* Build steps: content appears one click at a time                    */
/* ------------------------------------------------------------------ */

// step = how many clicks into the current slide; all = show everything (print, overview)
export const StepCtx = createContext({ step: 99, all: true });
export const useStep = () => useContext(StepCtx);
export const NavCtx = createContext({ goto: () => {} });

export function Step({ n = 1, as: Tag = 'div', className = '', children, ...rest }) {
  const { step, all } = useStep();
  const on = all || step >= n;
  return (
    <Tag className={`step ${on ? 'on' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

// Buttons inside slides drop focus after a click so Space/arrow keys keep driving the deck.
const blurAfter = (fn) => (e) => {
  e.currentTarget.blur();
  fn(e);
};

/* ------------------------------------------------------------------ */
/* Animated numbers                                                    */
/* ------------------------------------------------------------------ */

export function CountUp({ to, decimals = 0, prefix = '', suffix = '', duration = 1300, active = true }) {
  const { all } = useStep();
  const [v, setV] = useState(all ? to : 0);
  useEffect(() => {
    if (all) return setV(to);
    if (!active) return setV(0);
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, active, all, duration]);
  return (
    <>
      {prefix}
      {v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Icons (simple line icons, inherit currentColor)                     */
/* ------------------------------------------------------------------ */

const ICONS = {
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  unlock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 7.8-1.2" /></>,
  shield: <><path d="M12 21s7.5-3.6 7.5-9.5V5.2L12 2.5 4.5 5.2v6.3C4.5 17.4 12 21 12 21z" /><path d="m9 11.5 2 2 4-4" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6" /></>,
  building: <><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" /></>,
  scale: <><path d="M12 3v18M7 21h10M4 7h16" /><path d="m7 7-3 6.5a3 3 0 0 0 6 0zM17 7l-3 6.5a3 3 0 0 0 6 0z" /></>,
  key: <><circle cx="7.5" cy="15.5" r="4" /><path d="M10.5 12.5 20 3M16 7l2.5 2.5M18.5 4.5 21 7" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></>,
  alert: <><path d="M10.3 4 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0z" /><path d="M12 9.5v4M12 17h.01" /></>,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  landmark: <><path d="M3 21h18M5 17.5h14M6 17V10M10 17v-7M14 17v-7M18 17v-7M3 9l9-5.5L21 9z" /></>,
  chart: <><path d="M4 4v16h16" /><path d="m8 15 3.5-4 3 2.5L19 8" /></>,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  phone: <><rect x="6" y="2" width="12" height="20" rx="2.5" /><path d="M11 18.5h2" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
};

export function Icon({ name, size = 22, className = '' }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export function Cite({ ids }) {
  return <span className="cite">{ids.join(' · ')}</span>;
}

/* ------------------------------------------------------------------ */
/* Chart tooltip                                                       */
/* ------------------------------------------------------------------ */

function useTip() {
  const [tip, setTip] = useState(null);
  const show = (e, text) => {
    const svg = e.currentTarget.ownerSVGElement;
    const box = svg.getBoundingClientRect();
    const scale = box.width / svg.viewBox.baseVal.width;
    setTip({ x: (e.clientX - box.left) / scale, y: (e.clientY - box.top) / scale, text });
  };
  return { tip, show, hide: () => setTip(null) };
}

function Tip({ tip, width }) {
  if (!tip) return null;
  const w = Math.max(150, tip.text.length * 7.2 + 20);
  const x = Math.min(tip.x + 12, width - w - 4);
  return (
    <g pointerEvents="none">
      <rect x={x} y={tip.y - 40} width={w} height={30} rx={7} className="tip-box" />
      <text x={x + 10} y={tip.y - 20} className="tip-text">{tip.text}</text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Exhibit 1: Pew poll (S9), with a group switcher                     */
/* ------------------------------------------------------------------ */

export function PewChart() {
  const { tip, show, hide } = useTip();
  const [group, setGroup] = useState(0);
  const width = 560;
  const full = width - 20;
  const g = PEW_SUBGROUPS[group];
  const segs = [
    { key: 'unlock', label: 'Should unlock', value: g.unlock, cls: 'seg-b' },
    { key: 'not', label: 'Should not unlock', value: g.not, cls: 'seg-a' },
    { key: 'none', label: 'No opinion', value: 100 - g.unlock - g.not, cls: 'seg-n' },
  ];
  let acc = 0;
  return (
    <figure className="exhibit">
      <figcaption><b>Exhibit 1</b> Feb 2016 poll: should Apple unlock the phone?</figcaption>
      <div className="seg-control" role="tablist">
        {PEW_SUBGROUPS.map((s, i) => (
          <button key={s.label} className={i === group ? 'on' : ''} onClick={blurAfter(() => setGroup(i))}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="pew-big">
        <div><span className="pew-num fbi">{g.unlock}%</span><span>side with the FBI</span></div>
        <div className="pew-gap">
          <span>{g.unlock - g.not}</span> pt gap
        </div>
        <div className="right"><span className="pew-num apple">{g.not}%</span><span>side with Apple</span></div>
      </div>
      <svg viewBox={`0 0 ${width} 56`} className="chart" role="img"
        aria-label={`${g.label}: ${g.unlock}% unlock, ${g.not}% do not unlock`}>
        {segs.map((p) => {
          const x0 = 10 + (acc / 100) * full;
          const w = Math.max(0, (p.value / 100) * full - 3);
          acc += p.value;
          return (
            <g key={p.key}>
              <rect x={x0} y={6} width={w} height={44} rx={6} className={`${p.cls} morph`}
                onMouseMove={(e) => show(e, `${p.label}: ${p.value}%`)} onMouseLeave={hide} />
              {p.value >= 8 && (
                <text x={x0 + w / 2} y={34} textAnchor="middle" className="seg-text">{p.value}%</text>
              )}
            </g>
          );
        })}
        <Tip tip={tip} width={width} />
      </svg>
      <div className="legend">
        <span><i className="sw seg-b" />Unlock (FBI side)</span>
        <span><i className="sw seg-a" />Do not unlock (Apple side)</span>
        <span><i className="sw seg-n" />No opinion</span>
      </div>
      <div className="exhibit-note">
        1,002 U.S. adults, Feb 18–21, 2016. Click a group: young adults and iPhone owners were nearly split. <Cite ids={['S9']} />
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Exhibit 2: FBI claimed vs. actual locked phones (S8)                */
/* ------------------------------------------------------------------ */

export function FbiCountChart() {
  const { tip, show, hide } = useTip();
  const width = 560;
  const height = 240;
  const left = 150;
  const max = 8000;
  const x = (v) => left + (v / max) * (width - left - 80);
  return (
    <figure className="exhibit">
      <figcaption><b>Exhibit 2</b> Locked phones the FBI said it could not open (2017)</figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} className="chart" role="img"
        aria-label="FBI claimed 7,775 locked devices; the real number was about 1,000 to 2,000">
        {[0, 2000, 4000, 6000, 8000].map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={20} y2={196} className="grid" />
            <text x={x(t)} y={216} className="axis" textAnchor="middle">{fmt(t)}</text>
          </g>
        ))}
        <text x={left - 14} y={58} className="bar-label" textAnchor="end">FBI claim</text>
        <text x={left - 14} y={76} className="axis" textAnchor="end">public figure</text>
        <rect x={x(0)} y={36} width={x(FBI_COUNT.claimed) - x(0)} height={52} rx={6} className="bar-risk grow"
          onMouseMove={(e) => show(e, `FBI claim: ${fmt(FBI_COUNT.claimed)} devices`)} onMouseLeave={hide} />
        <text x={x(FBI_COUNT.claimed) + 8} y={69} className="bar-value">{fmt(FBI_COUNT.claimed)}</text>

        <text x={left - 14} y={146} className="bar-label" textAnchor="end">Real estimate</text>
        <text x={left - 14} y={164} className="axis" textAnchor="end">Washington Post</text>
        <rect x={x(0)} y={124} width={x(FBI_COUNT.actualLow) - x(0)} height={52} rx={6} className="bar-main grow"
          style={{ animationDelay: '.35s' }}
          onMouseMove={(e) => show(e, `At least ${fmt(FBI_COUNT.actualLow)} devices`)} onMouseLeave={hide} />
        <rect x={x(FBI_COUNT.actualLow) + 2} y={124} width={x(FBI_COUNT.actualHigh) - x(FBI_COUNT.actualLow) - 2}
          height={52} rx={6} className="bar-main-light grow" style={{ animationDelay: '.6s' }}
          onMouseMove={(e) => show(e, `Up to ${fmt(FBI_COUNT.actualHigh)} devices`)} onMouseLeave={hide} />
        <text x={x(FBI_COUNT.actualHigh) + 8} y={157} className="bar-value">
          {fmt(FBI_COUNT.actualLow)}–{fmt(FBI_COUNT.actualHigh)}
        </text>
        <g className="fade-late">
          <path d={`M ${x(FBI_COUNT.claimed) - 2} 96 Q ${x(5200)} 118 ${x(FBI_COUNT.actualHigh) + 120} 132`}
            className="annot-line" />
          <text x={x(5600)} y={128} className="annot" textAnchor="middle">4–8× too high</text>
        </g>
        <Tip tip={tip} width={width} />
      </svg>
      <div className="exhibit-note">
        A programming error counted phones more than once. Light segment = range of the estimate. <Cite ids={['S8']} />
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Exhibit 4: Apple's lawful cooperation (S17)                         */
/* ------------------------------------------------------------------ */

export function TransparencyChart() {
  const { tip, show, hide } = useTip();
  const width = 520;
  const left = 160;
  const full = width - left - 70;
  return (
    <figure className="exhibit">
      <figcaption><b>Exhibit 4</b> U.S. government requests where Apple provided data, Jul–Dec 2024</figcaption>
      <svg viewBox={`0 0 ${width} 160`} className="chart" role="img"
        aria-label="Apple provided data for 73% of device requests and 82% of account requests">
        {TRANSPARENCY.map((t, i) => {
          const y = 16 + i * 72;
          return (
            <g key={t.label}>
              <text x={left - 14} y={y + 22} className="bar-label" textAnchor="end">{t.label}</text>
              <text x={left - 14} y={y + 40} className="axis" textAnchor="end">{fmt(t.received)} received</text>
              <rect x={left} y={y} width={full} height={46} rx={6} className="track" />
              <rect x={left} y={y} width={(t.pct / 100) * full} height={46} rx={6} className="bar-main grow"
                style={{ animationDelay: `${i * 0.25}s` }}
                onMouseMove={(e) => show(e, `${t.label}: data provided in ${t.pct}%`)} onMouseLeave={hide} />
              <text x={left + full + 10} y={y + 30} className="bar-value">{t.pct}%</text>
            </g>
          );
        })}
        <Tip tip={tip} width={width} />
      </svg>
      <div className="exhibit-note">
        Apple already answers most lawful requests. What it refuses is writing code that breaks its own security. <Cite ids={['S17']} />
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Master key demo: one signed tool, change one ID, every phone opens  */
/* ------------------------------------------------------------------ */

function PhoneGlyph({ open, target }) {
  return (
    <div className={`phone ${open ? 'open' : ''} ${target ? 'target' : ''}`}>
      <Icon name={open ? 'unlock' : 'lock'} size={20} />
    </div>
  );
}

export function MasterKeyDemo({ oneAt = 1, cascadeAt = 2 }) {
  const { step, all } = useStep();
  const N = 30;
  const [opened, setOpened] = useState(all ? N : 0);

  useEffect(() => {
    if (all) return setOpened(N);
    if (step < oneAt) return setOpened(0);
    if (step < cascadeAt) return setOpened(1);
    let i = 1;
    setOpened(1);
    const id = setInterval(() => {
      i += 1;
      setOpened(i);
      if (i >= N) clearInterval(id);
    }, 70);
    return () => clearInterval(id);
  }, [step, all, oneAt, cascadeAt]);

  const label =
    opened === 0 ? 'Every iPhone is locked'
      : opened === 1 ? 'Tool runs on the one phone named in the order'
        : opened < N ? `Changed the device ID ${opened - 1}× · ${opened} phones open`
          : 'Same Apple-signed tool, every phone open';

  return (
    <div className={`keydemo ${opened > 1 ? 'spread' : ''}`}>
      <div className="keydemo-head">
        <div className="keychip"><Icon name="key" size={18} /> Apple-signed unlocking tool</div>
        <div className="keydemo-count"><b>{opened}</b> / {N} unlocked</div>
      </div>
      <div className="phone-grid">
        {Array.from({ length: N }, (_, i) => (
          <PhoneGlyph key={i} open={i < opened} target={i === 0} />
        ))}
      </div>
      <div className="keydemo-foot">
        <span className="keydemo-label">{label}</span>
        <span className="keydemo-btns">
          <button onClick={blurAfter(() => setOpened((o) => Math.min(N, Math.max(1, o + 1))))}>Change device ID ›</button>
          <button className="ghost" onClick={blurAfter(() => setOpened(0))}>Reset</button>
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Exhibit 3: passcode guessing calculator (S19)                       */
/* ------------------------------------------------------------------ */

function humanTime(sec) {
  if (sec < 90) return { v: Math.round(sec), u: 'seconds' };
  if (sec < 5400) return { v: Math.round(sec / 60), u: 'minutes' };
  if (sec < 172800) return { v: Math.round(sec / 3600), u: 'hours' };
  if (sec < 86400 * 400) return { v: Math.round(sec / 86400), u: 'days' };
  return { v: (sec / (86400 * 365)).toFixed(1), u: 'years' };
}

function pct(p) {
  if (p >= 1e-5) return `${parseFloat((p * 100).toPrecision(2))}%`;
  return `1 in ${fmt(Math.round(1 / p / 1e6))} million`;
}

function GuessTicker({ digits, alpha, running }) {
  const [code, setCode] = useState('');
  useEffect(() => {
    const chars = alpha ? 'abcdefghijklmnopqrstuvwxyz0123456789' : '0123456789';
    const make = () => Array.from({ length: digits }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setCode(make());
    if (!running) return undefined;
    const id = setInterval(() => setCode(make()), 80);
    return () => clearInterval(id);
  }, [digits, alpha, running]);
  return <div className="ticker">{code.split('').map((c, i) => <span key={i}>{c}</span>)}</div>;
}

export function BruteForceDemo({ revealAt = 1 }) {
  const { step, all } = useStep();
  const [typeId, setTypeId] = useState('4d');
  const t = PASSCODE.types.find((x) => x.id === typeId);
  const delayMin = PASSCODE.delayMinutes.reduce((a, b) => a + b, 0);
  const chance = PASSCODE.maxGuesses / t.space;
  const crack = humanTime((t.space * PASSCODE.msPerGuess) / 1000);
  const revealed = all || step >= revealAt;

  return (
    <div className="brute">
      <div className="brute-controls">
        <span>Passcode type</span>
        <div className="seg-control">
          {PASSCODE.types.map((x) => (
            <button key={x.id} className={x.id === typeId ? 'on' : ''} onClick={blurAfter(() => setTypeId(x.id))}>
              {x.label}
            </button>
          ))}
        </div>
        <span className="muted-s">{fmt(t.space)} possible codes</span>
      </div>
      <div className="brute-panels">
        <div className="brute-panel safe">
          <div className="bp-head"><Icon name="shield" /> iPhone as Apple ships it</div>
          <div className="bp-big">{pct(chance)}</div>
          <div className="bp-unit">chance a thief guesses the code</div>
          <ul className="bp-list">
            <li><Icon name="check" size={16} /> Only {PASSCODE.maxGuesses} guesses, typed by hand</li>
            <li><Icon name="check" size={16} /> Forced waits of up to 1 hour (~{Math.round(delayMin / 6) / 10} h total)</li>
            <li><Icon name="check" size={16} /> Then the phone can erase its data</li>
          </ul>
        </div>
        <div className={`brute-panel danger step ${revealed ? 'on' : ''}`}>
          <div className="bp-head"><Icon name="alert" /> With the tool the FBI ordered</div>
          <div className="bp-big">{crack.v} <small>{crack.u}</small></div>
          <div className="bp-unit">to try every possible code</div>
          <GuessTicker digits={typeId === '4d' ? 4 : 6} alpha={typeId === '6a'} running={revealed && !all} />
          <ul className="bp-list">
            <li><Icon name="bolt" size={16} /> Unlimited guesses, fed in by computer</li>
            <li><Icon name="bolt" size={16} /> No delays, no erase: ~{PASSCODE.msPerGuess} ms per guess</li>
          </ul>
        </div>
      </div>
      <div className="exhibit-note">
        <b>Exhibit 3.</b> Each guess costs ~80 ms of hardware math on any iPhone. On the iPhone 5C the limits
        lived in iOS software, which is why Apple-signed software could switch them off. <Cite ids={['S3', 'S19']} />
      </div>
    </div>
  );
}
