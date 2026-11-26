import React, { useEffect, useMemo, useState } from 'react';
import { DEBATE_NOTES } from './debateNotes.js';

// Debate drill: a prompt, a 60-second clock, then reveal our prepared answer.
const CARDS = [
  ...DEBATE_NOTES.questions.map((q) => ({ kind: 'Facilitator question', prompt: q.q, answer: q.a })),
  ...DEBATE_NOTES.rebuttals.map((r) => ({ kind: 'Team Security says', prompt: `"${r.claim}"`, answer: r.answer })),
  ...DEBATE_NOTES.weakSpots.map((w) => ({ kind: 'Weak spot: admit and pivot', prompt: w.issue, answer: w.pivot })),
];

const LIMIT = 60;

export default function Practice({ onExit }) {
  const [order, setOrder] = useState(() => CARDS.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [left, setLeft] = useState(LIMIT);
  const [running, setRunning] = useState(false);
  const [reveal, setReveal] = useState(false);
  const card = CARDS[order[pos]];

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setLeft((l) => {
      if (l <= 1) { setRunning(false); return 0; }
      return l - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [running]);

  const move = (d) => {
    setPos((p) => (p + d + CARDS.length) % CARDS.length);
    setLeft(LIMIT);
    setRunning(false);
    setReveal(false);
  };
  const shuffle = () => {
    const o = [...order];
    for (let i = o.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [o[i], o[j]] = [o[j], o[i]];
    }
    setOrder(o);
    setPos(0);
    setLeft(LIMIT);
    setRunning(false);
    setReveal(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'd') onExit();
      else if (e.key === 'ArrowRight') move(1);
      else if (e.key === 'ArrowLeft') move(-1);
      else if (e.key === ' ') { e.preventDefault(); if (left === 0) setLeft(LIMIT); setRunning((r) => !r); }
      else if (e.key.toLowerCase() === 'a') setReveal((r) => !r);
      else if (e.key.toLowerCase() === 's') shuffle();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const R = 54;
  const C = 2 * Math.PI * R;
  const frac = left / LIMIT;
  const tone = left > 20 ? 'ok' : left > 10 ? 'warn' : 'late';
  const tags = useMemo(() => (card.answer.match(/S\d+/g) || []).filter((v, i, a) => a.indexOf(v) === i), [card]);

  return (
    <div className="practice">
      <header className="practice-top">
        <div>
          <div className="practice-kicker">Debate drill · Team Privacy</div>
          <div className="practice-sub">Answer in three beats: claim, one sourced fact, why it matters.</div>
        </div>
        <div className="practice-actions">
          <button onClick={shuffle}>Shuffle (S)</button>
          <button onClick={onExit}>Back to slides (Esc)</button>
        </div>
      </header>

      <main className="practice-main">
        <div className={`timer ${tone}`}>
          <svg viewBox="0 0 128 128" width="180" height="180">
            <circle cx="64" cy="64" r={R} className="timer-track" />
            <circle cx="64" cy="64" r={R} className="timer-arc"
              strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 64 64)" />
          </svg>
          <div className="timer-num">{left}<small>s</small></div>
          <button className="timer-btn" onClick={(e) => { e.currentTarget.blur(); if (left === 0) setLeft(LIMIT); setRunning((r) => !r); }}>
            {running ? 'Pause' : left === LIMIT ? 'Start (Space)' : left === 0 ? 'Restart' : 'Resume'}
          </button>
        </div>

        <section className="card-q">
          <div className="card-q-kind">{card.kind} · {pos + 1} of {CARDS.length}</div>
          <h2>{card.prompt}</h2>
          <div className={`card-q-answer ${reveal ? 'on' : ''}`}>
            {reveal ? (
              <>
                <p>{card.answer}</p>
                {tags.length > 0 && <div className="card-q-src">Sources to name: {tags.join(', ')}</div>}
              </>
            ) : (
              <button onClick={(e) => { e.currentTarget.blur(); setReveal(true); }}>Reveal our answer (A)</button>
            )}
          </div>
          <div className="card-q-nav">
            <button onClick={() => move(-1)}>‹ Previous</button>
            <button onClick={() => move(1)}>Next ›</button>
          </div>
        </section>
      </main>
    </div>
  );
}
