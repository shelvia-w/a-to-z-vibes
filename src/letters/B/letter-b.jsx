import { useState, useEffect, useRef, useCallback } from 'react';
import './letter-b.css';
import '../A/letter-a.css';

// ── Assets ────────────────────────────────────────────────────────────────────
const PUB = process.env.PUBLIC_URL;
const A = {
  audio:      `${PUB}/letters/B/audio/canon_in_d.mp3`,
  background: `${PUB}/letters/B/images/background.png`,
  backgroundGame: `${PUB}/letters/B/images/background_game.png`,
  title:      `${PUB}/letters/B/images/title.png`,
  start:      `${PUB}/letters/B/images/start.png`,
  playAgain:  `${PUB}/letters/B/images/play_again.png`,
  baseArrow:  `${PUB}/letters/B/images/base_arrow.png`,
  hitArrow:   `${PUB}/letters/B/images/hit_arrow.png`,
  belle:      `${PUB}/letters/B/images/Belle.png`,
  beast: {
    guarded:   `${PUB}/letters/B/images/beast_guarded.png`,
    softening: `${PUB}/letters/B/images/beast_softening.png`,
    warm:      `${PUB}/letters/B/images/beast_warm.png`,
  },
  beast_portrait: {
    guarded:   `${PUB}/letters/B/images/beast_guarded_portrait.png`,
    softening: `${PUB}/letters/B/images/beast_softening_portrait.png`,
    warm:      `${PUB}/letters/B/images/beast_warm_portrait.png`,
  },
  rose: {
    dim:    `${PUB}/letters/B/images/rose-dim.png`,
    mid:    `${PUB}/letters/B/images/rose-mid.png`,
    bright: `${PUB}/letters/B/images/rose-bright.png`,
  },
  heartCrystal: `${PUB}/letters/B/images/heart_crystal.png`,
  heartFrame:   `${PUB}/letters/B/images/heart_frame.png`,
  separator:    `${PUB}/letters/B/images/separator.png`,
};

// ── Constants ─────────────────────────────────────────────────────────────────
const FALLBACK_SONG_MS = 90000;
const TRACK_BPM = 87;
const BEAT_MS = 60000 / TRACK_BPM;
const DOWNBEAT_OFFSET_MS = 0;
const ROUND_BEATS = 4;
const W = 1935, H = 1080, LW = 380, RW = 380, BH = 375;
const OVERLAY_WIDTH_SCALE = 1;
const HUD_ASSET_X_OFFSET = 20;
const HEART_METER_TITLE_X_OFFSET = 30;
const HEART_METER_SUBTITLE_X_OFFSET = -50;
const HEART_METER_X_OFFSET = 50;


const DIRS    = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
const DIR_ROT = { ArrowLeft: 180, ArrowRight: 0, ArrowUp: 270, ArrowDown: 90 };
const ROUND_FEEDBACK_MS = 560;
const TARGET_CENTER = 0.75;
const TARGET_ZONE_WIDTH = 0.30;
const PERFECT_WINDOW = 0.025;
const GREAT_WINDOW = 0.055;
const GOOD_WINDOW = TARGET_ZONE_WIDTH / 2;
const HEART_DECAY_PER_SECOND = 0.65;
const HEART_DECAY_TICK_MS = 250;
const ROUND_SCHEDULE = [
  1, 2, 3,
  4, 4, 4,
  5, 5, 5, 5,
  6, 6, 6, 6, 6,
  7, 7, 7, 7, 7,
  8, 8, 8, 8, 8,
  9, 9, 9, 9, 9,
  10,
];
const HIGH_LEVEL_BREAK_MS = 700;

const heartState = p => p < 33 ? 'guarded' : p < 67 ? 'softening' : 'warm';
const roundMs    = () => BEAT_MS * ROUND_BEATS;
const genPat     = n => Array.from({ length: n }, () => DIRS[Math.floor(Math.random() * 4)]);
const fmtTime    = ms => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const audioMs    = audio => (audio?.currentTime || 0) * 1000;

// ── CrystalHeartMeter ─────────────────────────────────────────────────────────
const HEART_W = 200, HEART_H = 185;

const CrystalHeartMeter = ({ pct }) => {
  const fillH = HEART_H * pct / 100;
  return (
    <div style={{ position: 'relative', width: HEART_W, height: HEART_H }}>
      {/* Dim unfilled crystal hint */}
      <img src={A.heartCrystal} alt="" style={{
        position: 'absolute', top: 0, left: 0,
        width: HEART_W, height: HEART_H,
        objectFit: 'contain',
        opacity: 0.12,
        zIndex: 0,
      }} />
      {/* Crystal fill — revealed bottom to top via overflow clip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: HEART_W, height: fillH,
        overflow: 'hidden',
        transition: 'height 0.6s ease',
        zIndex: 1,
      }}>
        <img src={A.heartCrystal} alt="" style={{
          position: 'absolute', bottom: 0, left: 0,
          width: HEART_W, height: HEART_H,
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 10px rgba(180,120,255,0.55))',
        }} />
      </div>
      {/* Gold frame — always full opacity on top */}
      <img src={A.heartFrame} alt="" style={{
        position: 'absolute', top: 0, left: 0,
        width: HEART_W, height: HEART_H,
        objectFit: 'contain',
        zIndex: 2,
      }} />
    </div>
  );
};

// ── BeastStateList ────────────────────────────────────────────────────────────
const PORTRAIT = 80;
const ROW_GAP  = 60;

const STATE_ORDER = ['guarded', 'softening', 'warm'];

const BeastStateList = ({ pct }) => {
  const hs        = heartState(pct);
  const activeIdx = STATE_ORDER.indexOf(hs);
  const rows = [
    { k: 'guarded',   img: A.beast_portrait.guarded,   name: 'GUARDED' },
    { k: 'softening', img: A.beast_portrait.softening, name: 'SOFTENING' },
    { k: 'warm',      img: A.beast_portrait.warm,      name: 'WARM' },
  ];

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: ROW_GAP }}>

      {/* Continuous vertical connector */}
      <div style={{
        position: 'absolute',
        left: PORTRAIT / 2 - 0.5,
        top: PORTRAIT / 2,
        bottom: PORTRAIT / 2,
        width: 4,
        background: 'repeating-linear-gradient(180deg, rgba(201,168,76,0.75) 0px, rgba(201,168,76,0.75) 4px, transparent 4px, transparent 14px)',
        borderRadius: 2,
        zIndex: 0,
      }} />

      {rows.map((r, i) => {
        const isActive    = i === activeIdx;
        const isCompleted = i < activeIdx;
        const isLocked    = i > activeIdx;

        const imgFilter = isActive
          ? 'brightness(1.08) saturate(1.22) contrast(1.02)'
          : isCompleted
            ? 'brightness(1.04) saturate(1.1) sepia(0.18)'
            : 'brightness(0.72) saturate(0.55) hue-rotate(185deg)';

        const frameBorder = isActive
          ? '2px solid rgba(220,190,100,0.95)'
          : isCompleted
            ? '1.5px solid rgba(201,168,76,0.5)'
            : '1.5px solid rgba(75,105,165,0.45)';

        const frameGlow = isActive
          ? '0 0 10px rgba(201,168,76,0.45)'
          : isCompleted
            ? '0 0 5px rgba(201,168,76,0.18)'
            : 'none';

        const labelColor = isActive
          ? '#c9a84c'
          : isCompleted
            ? 'rgba(210,185,120,0.65)'
            : 'rgba(110,140,195,0.55)';

        return (
          <div key={r.k} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 30, zIndex: 1 }}>

            <div style={{ position: 'relative', flexShrink: 0, width: PORTRAIT, height: PORTRAIT }}>

              {/* Arrow beside portrait */}
              <div style={{
                position: 'absolute',
                right: -20, top: '50%', transform: 'translateY(-50%)',
                zIndex: 4,
                color: isLocked ? 'rgba(110,140,195,0.45)' : '#c9a84c',
                fontSize: 13, lineHeight: 1,
                textShadow: isLocked ? 'none' : '0 0 8px rgba(201,168,76,0.9), 0 0 18px rgba(201,168,76,0.4)',
                userSelect: 'none',
                transition: 'all 1.2s ease',
              }}>►</div>

              {/* Outer halo — active only */}
              {isActive && (
                <div style={{
                  position: 'absolute', inset: -8, borderRadius: '50%',
                  boxShadow: '0 0 0 1px rgba(201,168,76,0.18), 0 0 24px rgba(201,168,76,0.65), 0 0 52px rgba(201,168,76,0.2)',
                  transition: 'all 1.4s ease',
                }} />
              )}

              {/* Frame ring */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: frameBorder,
                boxShadow: frameGlow,
                zIndex: 3, pointerEvents: 'none',
                transition: 'all 1.2s ease',
              }} />

              {/* Portrait image */}
              <div style={{ width: PORTRAIT, height: PORTRAIT, borderRadius: '50%', overflow: 'hidden', background: 'rgba(6,10,24,1)' }}>
                <img src={r.img} alt="" style={{
                  width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%',
                  filter: imgFilter,
                  transition: 'filter 1.3s ease',
                }} />
              </div>
            </div>

            {/* Label */}
            <div style={{
              fontFamily: 'Cinzel', fontWeight: 800,
              fontSize: 18,
              letterSpacing: 1,
              color: labelColor,
              transition: 'all 1.2s ease',
            }}>{r.name}</div>
          </div>
        );
      })}
    </div>
  );
};

// ── LeftPanel ─────────────────────────────────────────────────────────────────
const LeftPanel = ({ pct }) => (
  <div style={{
    position: 'absolute', top: 0, left: 0, width: LW, height: H, zIndex: 12,
    background: 'linear-gradient(90deg,rgba(3,5,16,0.92) 60%,rgba(3,5,16,0) 100%)',
    padding: '50px 20px 28px 24px',
    display: 'flex', flexDirection: 'column',
  }}>
    <div style={{ transform: `translateX(${HUD_ASSET_X_OFFSET}px)` }}>
    <div style={{ fontFamily: 'Cinzel', color: '#c9a84c', fontSize: 25, fontWeight: 600, letterSpacing: 1, marginBottom: 5, transform: `translateX(${HEART_METER_TITLE_X_OFFSET}px)` }}>HEART METER</div>
    <div style={{ fontFamily: 'Winsel Norm Regular', color: 'rgba(210,195,165,0.72)', fontSize: 18, fontWeight: 100, lineHeight: 1.3, letterSpacing: 0.2, marginBottom: 20, textAlign: 'center', transform: `translateX(${HEART_METER_SUBTITLE_X_OFFSET}px)` }}>
      Fill the heart<br />to melt his heart
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ transform: `translateX(-${HEART_METER_X_OFFSET}px)` }}>
        <CrystalHeartMeter pct={pct} />
      </div>
      <div style={{ fontFamily: 'Cinzel', color: '#c9a84c', fontSize: 32, fontWeight: 700, textShadow: '0 0 20px rgba(201,168,76,0.5)', lineHeight: 1, marginTop: 8, transform: `translateX(-${HEART_METER_X_OFFSET}px)` }}>
        {Math.round(pct)}%
      </div>
    </div>
    <img src={A.separator} alt="" style={{ width: '70%', margin: '-15px 0 -20px', objectFit: 'contain' }} />
    <div style={{ fontFamily: 'Cinzel', color: '#c9a84c', fontSize: 25, fontWeight: 600, letterSpacing: 1, marginBottom: 5, marginTop: -20, transform: `translateX(${HEART_METER_TITLE_X_OFFSET}px)` }}>BEAST STATE</div>
    <div style={{ fontFamily: 'Winsel Norm Regular', color: 'rgba(210,195,165,0.72)', fontSize: 18, fontWeight: 100, lineHeight: 1.3, letterSpacing: 0.2, marginBottom: 40, textAlign: 'center', transform: `translateX(${HEART_METER_SUBTITLE_X_OFFSET}px)` }}>
      Emotional progression
    </div>
    <div style={{ transform: 'translateX(20px)' }}><BeastStateList pct={pct} /></div>
    </div>
  </div>
);

// ── RoseProgression ───────────────────────────────────────────────────────────
const RoseProgression = ({ pct }) => {
  const hs    = heartState(pct);
  const lvl   = hs === 'guarded' ? 0 : hs === 'softening' ? 1 : 2;
  const roseI = { guarded: A.rose.dim, softening: A.rose.mid, warm: A.rose.bright };
  const marks = [{ l: 'BRIGHT', i: 2 }, { l: 'GLOWING', i: 1 }, { l: 'DIM', i: 0 }];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ fontFamily: 'Cinzel', color: 'rgba(245,240,232,0.5)', fontSize: 10, letterSpacing: 3 }}>ROSE PROGRESSION</div>
      <div style={{ fontFamily: 'Cinzel', color: 'rgba(245,240,232,0.25)', fontSize: 9, letterSpacing: 1 }}>Belle's light grows</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 6 }}>
        <div style={{ position: 'relative', height: 160, width: 90 }}>
          {['guarded', 'softening', 'warm'].map(s => (
            <img key={s} src={roseI[s]} alt="" style={{
              position: 'absolute', bottom: 0, left: 0, height: 160, width: 90, objectFit: 'contain',
              opacity: hs === s ? 1 : 0,
              transition: 'opacity 1.8s ease',
              filter: s === 'warm' ? 'drop-shadow(0 0 18px rgba(255,200,50,0.5))' : 'none',
            }} />
          ))}
        </div>
        <div style={{ height: 155, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {marks.map(m => {
            const on = lvl >= m.i, cur = lvl === m.i;
            return (
              <div key={m.l} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{
                  width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
                  background: cur ? '#ffd700' : on ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.12)',
                  boxShadow: cur ? '0 0 10px #ffd700' : 'none',
                  transition: 'all 1.5s ease',
                }} />
                <div style={{
                  fontFamily: 'Cinzel', fontSize: 9, letterSpacing: 2,
                  color: cur ? '#c9a84c' : on ? 'rgba(201,168,76,0.45)' : 'rgba(255,255,255,0.18)',
                  fontWeight: cur ? 700 : 400, transition: 'color 1.5s ease',
                }}>{m.l}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── RightPanel ────────────────────────────────────────────────────────────────
const RightPanel = ({ score, combo, pct }) => {
  const mult = (1 + Math.min(combo, 100) * 0.002).toFixed(2);
  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, width: RW, height: H, zIndex: 12,
      background: 'linear-gradient(270deg,rgba(3,5,16,0.92) 60%,rgba(3,5,16,0) 100%)',
      padding: '28px 24px 28px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
    }}>
      <div style={{ fontFamily: 'Cinzel', color: 'rgba(245,240,232,0.5)', fontSize: 10, letterSpacing: 4, marginBottom: 4 }}>SCORE</div>
      <div style={{ fontFamily: 'Cinzel', color: '#c9a84c', fontSize: 40, fontWeight: 700, lineHeight: 1, textShadow: '0 0 24px rgba(201,168,76,0.5)', textAlign: 'right' }}>
        {score.toLocaleString()}
      </div>
      <div style={{ margin: '16px 0 12px' }} />
      <div style={{ fontFamily: 'Cinzel', color: 'rgba(245,240,232,0.5)', fontSize: 10, letterSpacing: 4, marginBottom: 4 }}>COMBO</div>
      <div style={{
        fontFamily: 'Cinzel', color: '#f5f0e8', fontSize: 46, fontWeight: 700, lineHeight: 1, textAlign: 'right',
        textShadow: combo > 0 ? '0 0 20px rgba(255,255,255,0.3)' : 'none',
        animation: combo > 0 ? 'heartbeat 0.6s ease' : 'none',
      }}>{combo}</div>
      {combo > 0 && <div style={{ fontFamily: 'Cinzel', color: '#c9a84c', fontSize: 14, letterSpacing: 2, marginTop: 3 }}>×{mult}</div>}
      <div style={{ margin: '20px 0 16px' }} />
      <RoseProgression pct={pct} />
    </div>
  );
};

// ── ArrowNote ─────────────────────────────────────────────────────────────────
const ArrowNote = ({ dir, state }) => {
  const rot   = DIR_ROT[dir];
  const isHit  = state === 'hit';
  return (
    <div style={{
      width: 80, height: 80, flexShrink: 0,
      transition: 'opacity 0.15s',
    }}>
      <img src={isHit ? A.hitArrow : A.baseArrow} alt="" style={{
        width: '100%', height: '100%',
        transform: `rotate(${rot}deg)`,
        filter: 'brightness(1.35)',
      }} />
    </div>
  );
};

// ── TimingBar ─────────────────────────────────────────────────────────────────
const TimingBar = ({ active, pos }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
    <div style={{ fontFamily: 'Cinzel', color: 'rgba(201,168,76,0.55)', fontSize: 10, letterSpacing: 6 }}>TIMING ZONE</div>
    <div style={{ position: 'relative', width: 660, height: 42 }}>
      {/* Track */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: 'rgba(10,14,35,0.8)', border: '1px solid rgba(201,168,76,0.2)' }} />
      {/* Good zone */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '22%', right: '22%', background: 'rgba(140,160,200,0.1)', borderRadius: 4 }} />
      {/* Great zone */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '36%', right: '36%', background: 'rgba(150,90,180,0.18)', borderRadius: 4 }} />
      {/* Perfect zone */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '44%', right: '44%', background: 'rgba(201,168,76,0.28)', borderRadius: 4, boxShadow: '0 0 12px rgba(201,168,76,0.25)' }} />
      {/* Centre tick */}
      <div style={{ position: 'absolute', top: 4, bottom: 4, left: 'calc(50% - 1px)', width: 2, background: 'rgba(255,215,0,0.5)', borderRadius: 1 }} />
      {/* Cursor */}
      <div style={{
        position: 'absolute', top: '50%', left: `${pos * 100}%`,
        width: 24, height: 24, borderRadius: '50%',
        background: active ? '#ffd700' : '#445577',
        transform: 'translate(-50%,-50%)',
        boxShadow: active ? '0 0 20px #ffd700,0 0 40px rgba(255,215,0,0.4)' : 'none',
        animation: active ? 'glowRing 0.75s ease infinite' : 'none',
        transition: 'background 0.2s', zIndex: 2,
      }} />
      {/* Zone labels */}
      <div style={{
        position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'Cinzel', fontSize: 8, letterSpacing: 3,
        color: 'rgba(201,168,76,0.3)', whiteSpace: 'nowrap',
      }}>← GOOD · ← GREAT · ◆ PERFECT ◆ · GREAT → · GOOD →</div>
    </div>
  </div>
);

// ── FeedbackText ──────────────────────────────────────────────────────────────
const SequenceBar = ({ phase, pattern, noteStates, feedback, cursorPos, targetPulse, currentLevel }) => (
  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 900, height: 136 }}>
    <div style={{
      position: 'absolute', top: -15, left: 130, zIndex: 6,
      fontFamily: 'Cinzel', fontSize: 20, fontWeight: 800, letterSpacing: 2,
      color: '#ffe875',
      textShadow: '0 0 10px rgba(255,232,117,0.7), 0 0 20px rgba(255,232,117,0.28)',
    }}>
      LEVEL <span style={{ fontSize: 30, lineHeight: 1 }}>{currentLevel}</span>
    </div>
    {feedback && (
      <div style={{
        position: 'absolute', top: -86, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 8,
      }}>
        <FeedbackText text={feedback} />
      </div>
    )}
    <div style={{
      position: 'absolute', top: -15, left: '50%',
      width: 360, height: 35, borderRadius: 14,
      transform: 'translateX(-50%)',
      background: 'linear-gradient(180deg, rgba(15,20,30,0.86), rgba(3,6,15,0.72))',
      border: '2px solid rgba(190,210,170,0.34)',
      boxShadow: 'inset 0 0 10px rgba(255,255,255,0.09), 0 0 14px rgba(0,0,0,0.42)',
      overflow: 'hidden',
      zIndex: 4,
    }}>
      <div style={{
          position: 'absolute',
          left: 16,
          right: 16,
          top: '50%',
          height: 12,
          transform: 'translateY(-50%)',
          borderRadius: 8,
        }}
      />
      <div style={{
          position: 'absolute',
          top: '50%',
          left: `${TARGET_CENTER * 100}%`,
          width: 100,
          height: 20,
          transform: `translate(-50%, -50%) scaleX(${targetPulse ? 1.5 : 1})`,
          transformOrigin: 'center center',
          background: 'linear-gradient(90deg, rgba(17,247,204,0.34) 0%, rgba(17,247,204,0.58) 12%, rgba(105,255,232,0.88) 24%, rgba(255,255,255,0.98) 36%, rgba(255,255,255,0.98) 64%, rgba(105,255,232,0.88) 76%, rgba(17,247,204,0.58) 88%, rgba(17,247,204,0.34) 100%)',
          animation: 'targetBlink 0.69s ease-in-out infinite',
          transition: 'transform 0.12s ease-out',
          zIndex: 4,
        }}
      />
      {(phase === 'input' || phase === 'timing') && (
        <div style={{
          position: 'absolute', top: '50%', left: `${cursorPos * 100}%`,
          width: 20, height: 20, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #fff4cc, #ff7b45 48%, #8b2318 100%)',
          border: '2px solid rgba(255,226,186,0.96)',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 12px rgba(255,102,61,0.9), 0 0 22px rgba(255,244,214,0.42)',
          zIndex: 5,
        }} />
      )}
    </div>
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height: 92,
    }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0,
        padding: '0 96px',
      }}>
        {(phase === 'input' || phase === 'timing') && pattern.map((dir, i) => (
          <ArrowNote key={i} dir={dir} state={noteStates[i] || 'pending'} />
        ))}
      </div>
    </div>
  </div>
);

const FeedbackText = ({ text }) => {
  if (!text) return <div style={{ height: 48 }} />;
  const cfg = {
    Perfect: { col: '#ffd700', size: 44, label: '◆ PERFECT ◆' },
    Great:   { col: '#c9a84c', size: 36, label: 'GREAT' },
    Good:    { col: '#8899bb', size: 32, label: 'GOOD' },
    Miss:    { col: '#cc3355', size: 32, label: 'MISS' },
  };
  const c = cfg[text] || cfg.Good;
  return (
    <div style={{
      fontFamily: 'Cinzel Decorative', color: c.col, fontSize: c.size, fontWeight: 700,
      letterSpacing: 4, textShadow: `0 0 30px ${c.col},0 0 60px ${c.col}55`,
      animation: 'fadeUp 1s ease forwards', pointerEvents: 'none',
      whiteSpace: 'nowrap', textAlign: 'center', minHeight: 48,
    }}>{c.label}</div>
  );
};

// ── BottomPanel ───────────────────────────────────────────────────────────────
const BottomPanel = ({ phase, pattern, noteStates, feedback, cursorPos, targetPulse, songElapsed, songDuration, beatDebug, currentLevel }) => {
  const progress = Math.min(1, songElapsed / songDuration);
  const timingActive = false;
  const beatErrorAbs = Math.abs(beatDebug.nearestBeatErrorMs);
  const judgments = [
    { label: 'PERFECT', col: '#ffd700', desc: '+ Great Increase' },
    { label: 'GREAT',   col: '#c9a84c', desc: '+ Medium Increase' },
    { label: 'GOOD',    col: '#8899bb', desc: '+ Small Increase' },
    { label: 'MISS',    col: '#cc3355', desc: 'No Increase · Breaks Combo' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: BH, zIndex: 10,
      background: 'linear-gradient(0deg,rgba(2,4,14,0.97) 60%,rgba(2,4,14,0) 100%)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 54 }}>
        <SequenceBar
          phase={phase}
          pattern={pattern}
          noteStates={noteStates}
          feedback={feedback}
          cursorPos={cursorPos}
          targetPulse={targetPulse}
          currentLevel={currentLevel}
        />
      </div>
      {/* TOP ROW: steps + arrows + space */}
      <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', gap: 20, paddingTop: 22 }}>
        {/* Step 1 */}
        <div style={{ textAlign: 'right', width: 160, flexShrink: 0 }}>
          <div style={{ fontFamily: 'Cinzel', color: '#c9a84c', fontSize: 11, letterSpacing: 3, fontWeight: 700 }}>STEP 1</div>
          <div style={{ fontFamily: 'Cinzel', color: 'rgba(245,240,232,0.4)', fontSize: 9, letterSpacing: 1, marginTop: 2 }}>Follow the arrow sequence</div>
        </div>

        {/* Arrow lane */}
        <div style={{
          display: 'flex', gap: 10, alignItems: 'center',
          background: 'rgba(6,10,28,0.6)',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: 14, padding: '10px 18px',
          minWidth: 360, minHeight: 84, justifyContent: 'center',
          backdropFilter: 'blur(6px)',
        }}>
          {phase === 'idle' && (
            <div style={{ fontFamily: 'Cinzel', color: 'rgba(201,168,76,0.3)', fontSize: 12, letterSpacing: 4 }}>◆ AWAITING ◆</div>
          )}
          {(phase === 'input' || phase === 'timing') && pattern.map((dir, i) => (
            <ArrowNote key={i} dir={dir} state={noteStates[i] || 'pending'} />
          ))}
          {phase === 'feedback' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 64 }}>
              <FeedbackText text={feedback} />
            </div>
          )}
        </div>

        <div style={{ color: 'rgba(201,168,76,0.45)', fontSize: 22, flexShrink: 0 }}>→</div>

        {/* SPACE target */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
          background: 'radial-gradient(circle at 35% 35%, rgba(80,60,20,0.9), rgba(20,15,5,0.95))',
          border: `2px solid ${timingActive ? '#ffd700' : 'rgba(201,168,76,0.45)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: timingActive ? 'spaceActive 0.75s ease-in-out infinite' : 'spaceIdle 2s ease-in-out infinite',
          transition: 'border-color 0.3s',
        }}>
          <span style={{ fontFamily: 'Cinzel', color: timingActive ? '#ffd700' : 'rgba(201,168,76,0.7)', fontSize: 11, letterSpacing: 2, fontWeight: 700, transition: 'color 0.3s' }}>SPACE</span>
        </div>

        {/* Step 2 */}
        <div style={{ textAlign: 'left', width: 160, flexShrink: 0 }}>
          <div style={{ fontFamily: 'Cinzel', color: '#c9a84c', fontSize: 11, letterSpacing: 3, fontWeight: 700 }}>STEP 2</div>
          <div style={{ fontFamily: 'Cinzel', color: 'rgba(245,240,232,0.4)', fontSize: 9, letterSpacing: 1, marginTop: 2 }}>Press SPACE on the beat</div>
        </div>
      </div>

      {/* TIMING BAR */}
      <div style={{ display: 'none', justifyContent: 'center', marginTop: 24 }}>
        <TimingBar active={timingActive} pos={cursorPos} />
      </div>

      {/* BOTTOM STRIP */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 64,
        borderTop: '1px solid rgba(201,168,76,0.12)',
        display: 'flex', alignItems: 'center',
        padding: `0 28px 0 ${28 + HUD_ASSET_X_OFFSET}px`,
      }}>
        {/* Judgment legend */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {judgments.map(j => (
            <div key={j.label} style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ fontFamily: 'Cinzel', color: j.col, fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>{j.label}</span>
              <span style={{ fontFamily: 'Cinzel', color: 'rgba(245,240,232,0.3)', fontSize: 8, letterSpacing: 1 }}>{j.desc}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginLeft: 18 }}>
          <span style={{ fontFamily: 'Cinzel', color: '#7effe7', fontSize: 10, letterSpacing: 2, fontWeight: 700 }}>87 BPM</span>
          <span style={{ fontFamily: 'Cinzel', color: 'rgba(245,240,232,0.34)', fontSize: 8, letterSpacing: 1 }}>
            beat {beatDebug.beatIndex}
          </span>
          <span style={{
            fontFamily: 'Cinzel',
            color: beatErrorAbs < 12 ? 'rgba(126,255,231,0.86)' : beatErrorAbs < 28 ? 'rgba(255,215,0,0.72)' : 'rgba(204,51,85,0.72)',
            fontSize: 8,
            letterSpacing: 1,
          }}>
            {beatDebug.nearestBeatErrorMs >= 0 ? '+' : ''}{beatDebug.nearestBeatErrorMs.toFixed(1)}ms
          </span>
          <span style={{ fontFamily: 'Cinzel', color: 'rgba(245,240,232,0.28)', fontSize: 8, letterSpacing: 1 }}>
            offset {DOWNBEAT_OFFSET_MS}ms
          </span>
        </div>
        <div style={{ flex: 1 }} />
        {/* Song progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontFamily: 'Cinzel', color: 'rgba(245,240,232,0.4)', fontSize: 10, letterSpacing: 2 }}>{fmtTime(songElapsed)}</div>
          <div style={{ position: 'relative', width: 200, height: 4 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(201,168,76,0.15)', borderRadius: 2 }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${progress * 100}%`, background: 'linear-gradient(90deg,#5566aa,#c9a84c)', borderRadius: 2, transition: 'width 0.12s linear' }} />
            <div style={{ position: 'absolute', top: '50%', left: `${progress * 100}%`, transform: 'translate(-50%,-50%)', width: 8, height: 8, borderRadius: '50%', background: '#c9a84c', boxShadow: '0 0 8px #c9a84c' }} />
          </div>
          <div style={{ fontFamily: 'Cinzel', color: 'rgba(245,240,232,0.4)', fontSize: 10, letterSpacing: 2 }}>{fmtTime(songDuration)}</div>
          <img src={A.rose.bright} alt="" style={{ height: 28, objectFit: 'contain', opacity: 0.7, filter: 'saturate(0.7)' }} />
          <div style={{ fontFamily: 'Cinzel', color: 'rgba(245,240,232,0.35)', fontSize: 10, letterSpacing: 3, marginLeft: 4 }}>SONG PROGRESS</div>
        </div>
      </div>
    </div>
  );
};

// ── Particles ─────────────────────────────────────────────────────────────────
const Particles = ({ list }) => (
  <>
    {list.map(p => (
      <div key={p.id} style={{
        position: 'absolute', left: p.x, top: p.y,
        width: 5, height: 5, borderRadius: '50%',
        background: p.color, boxShadow: `0 0 7px ${p.color}`,
        animation: 'particleRise 0.9s ease forwards',
        pointerEvents: 'none', zIndex: 50,
      }} />
    ))}
  </>
);

// ── Game ──────────────────────────────────────────────────────────────────────
export default function LetterB({ onBack }) {
  const [screen,       setScreen]       = useState('intro');
  const [heartPct,     setHeartPct]     = useState(0);
  const [score,        setScore]        = useState(0);
  const [combo,        setCombo]        = useState(0);
  const [songElapsed,  setSongElapsed]  = useState(0);
  const [songDuration, setSongDuration] = useState(FALLBACK_SONG_MS);
  const [pattern,      setPattern]      = useState([]);
  const [noteStates,   setNoteStates]   = useState([]);
  const [inputIdx,     setInputIdx]     = useState(0);
  const [phase,        setPhase]        = useState('idle');
  const [cursorPos,    setCursorPos]    = useState(0);
  const [feedback,     setFeedback]     = useState(null);
  const [particles,    setParticles]    = useState([]);
  const [targetPulse,  setTargetPulse]  = useState(false);
  const [beatDebug,    setBeatDebug]    = useState({ beatIndex: 0, nearestBeatErrorMs: 0 });
  const [currentLevel, setCurrentLevel] = useState(1);
  const [stageScale,   setStageScale]   = useState({ x: 1, y: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mutable refs — safe to read inside RAF / event callbacks
  const screenRef = useRef('intro');
  const phaseRef  = useRef('idle');
  const patRef    = useRef([]);
  const idxRef    = useRef(0);
  const heartRef  = useRef(0);
  const comboRef  = useRef(0);
  const songRef   = useRef(0);
  const curRef    = useRef(0);
  const roundStartRef = useRef(0);
  const roundDurationRef = useRef(ROUND_FEEDBACK_MS);
  const lastDebugBeatRef = useRef(-1);
  const targetCrossedRef = useRef(false);
  const targetPulseTimer = useRef(null);
  const roundIndexRef = useRef(0);
  const currentLevelRef = useRef(1);
  const roundJudgedRef = useRef(false);

  const nextTimer = useRef(null);
  const songInt   = useRef(null);
  const decayInt  = useRef(null);
  const rafId     = useRef(null);
  const pidRef    = useRef(0);
  const audioRef  = useRef(null);

  // Keep refs in sync
  useEffect(() => { screenRef.current = screen;     }, [screen]);
  useEffect(() => { phaseRef.current  = phase;      }, [phase]);
  useEffect(() => { patRef.current    = pattern;    }, [pattern]);
  useEffect(() => { idxRef.current    = inputIdx;   }, [inputIdx]);
  useEffect(() => { heartRef.current  = heartPct;   }, [heartPct]);
  useEffect(() => { comboRef.current  = combo;      }, [combo]);
  useEffect(() => { songRef.current   = songElapsed;}, [songElapsed]);
  useEffect(() => { curRef.current    = cursorPos;  }, [cursorPos]);

  const containerRef = useRef(null);

  // Scale the overlay to the background frame.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateScale = ({ width, height }) => setStageScale({ x: width / W, y: height / H });
    const ro = new ResizeObserver(([entry]) => updateScale(entry.contentRect));
    updateScale(el.getBoundingClientRect());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setStageScale({ x: width / W, y: height / H });
  }, [screen]);

  useEffect(() => {
    const onFullscreenChange = () => {
      const isNowFullscreen = document.fullscreenElement === containerRef.current;
      setIsFullscreen(isNowFullscreen);
      const el = containerRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      setStageScale({ x: width / W, y: height / H });
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // ── Callbacks ────────────────────────────────────────────────────────────────

  const addParticles = useCallback((q) => {
    if (q === 'Miss') return;
    const col = q === 'Perfect' ? '#ffd700' : q === 'Great' ? '#c9a84c' : '#8899bb';
    const n   = q === 'Perfect' ? 8 : q === 'Great' ? 5 : 2;
    const cx  = W / 2, cy = H - BH - 30;
    const ps  = Array.from({ length: n }, () => ({
      id: pidRef.current++,
      x: cx + (Math.random() - .5) * 240,
      y: cy + (Math.random() - .5) * 40,
      color: col,
    }));
    setParticles(p => [...p.slice(-18), ...ps]);
    setTimeout(() => setParticles(p => p.filter(x => !ps.find(n => n.id === x.id))), 950);
  }, []);

  const doNextPat = useCallback(() => {
    const level = ROUND_SCHEDULE[roundIndexRef.current];
    if (!level) {
      setFeedback(null);
      phaseRef.current = 'idle'; setPhase('idle');
      setPattern([]); patRef.current = [];
      setNoteStates([]);
      setInputIdx(0); idxRef.current = 0;
      setCursorPos(0); curRef.current = 0;
      roundJudgedRef.current = false;
      return;
    }
    roundIndexRef.current++;
    currentLevelRef.current = level;
    setCurrentLevel(level);
    const p = genPat(level);
    const nowMs = audioMs(audioRef.current);
    patRef.current = p; setPattern(p);
    setNoteStates(p.map(() => 'pending'));
    setInputIdx(0); idxRef.current = 0;
    setCursorPos(0); curRef.current = 0;
    targetCrossedRef.current = false;
    roundJudgedRef.current = false;
    setTargetPulse(false);
    roundDurationRef.current = roundMs();
    roundStartRef.current = nowMs;
    phaseRef.current = 'input'; setPhase('input');
  }, []);

  const doFeedback = useCallback((q) => {
    const pts = { Perfect: 300, Great: 200, Good: 80, Miss: 0 }[q];
    const hd  = { Perfect: 10,  Great: 6,   Good: 2,  Miss: -5 }[q];
    setFeedback(q);
    addParticles(q);
    const nh = Math.max(0, Math.min(100, heartRef.current + hd));
    heartRef.current = nh; setHeartPct(nh);
    setScore(s => s + pts * Math.max(1, Math.floor(comboRef.current / 4) + 1));
    setPattern([]); patRef.current = [];
    setNoteStates([]);
    setInputIdx(0); idxRef.current = 0;
    if (q === 'Miss') {
      comboRef.current = 0; setCombo(0);
    } else {
      comboRef.current++; setCombo(c => c + 1);
    }
    roundJudgedRef.current = true;
  }, [addParticles]);

  const finishRound = useCallback(() => {
    phaseRef.current = 'feedback'; setPhase('feedback');
    if (roundIndexRef.current >= ROUND_SCHEDULE.length) {
      nextTimer.current = setTimeout(() => {
        setFeedback(null);
        phaseRef.current = 'idle'; setPhase('idle');
        setPattern([]); patRef.current = [];
        setNoteStates([]);
        setInputIdx(0); idxRef.current = 0;
        setCursorPos(0); curRef.current = 0;
        targetCrossedRef.current = false;
        roundJudgedRef.current = false;
        setTargetPulse(false);
      }, ROUND_FEEDBACK_MS);
      return;
    }
    nextTimer.current = setTimeout(() => {
      setFeedback(null);
      phaseRef.current = 'idle'; setPhase('idle');
      setPattern([]); patRef.current = [];
      setNoteStates([]);
      setInputIdx(0); idxRef.current = 0;
      setCursorPos(0); curRef.current = 0;
      targetCrossedRef.current = false;
      roundJudgedRef.current = false;
      setTargetPulse(false);
      const nextDelay = currentLevelRef.current >= 6 ? HIGH_LEVEL_BREAK_MS : 0;
      nextTimer.current = setTimeout(() => {
        if (screenRef.current === 'playing') doNextPat();
      }, nextDelay);
    }, ROUND_FEEDBACK_MS);
  }, [doNextPat]);

  // ── RAF cursor oscillator ────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'playing') return;
    const tick = () => {
      const nowMs = audioMs(audioRef.current);
      const beatPos = (nowMs - DOWNBEAT_OFFSET_MS) / BEAT_MS;
      const nearestBeat = Math.round(beatPos);
      if (nearestBeat !== lastDebugBeatRef.current) {
        lastDebugBeatRef.current = nearestBeat;
        setBeatDebug({
          beatIndex: nearestBeat,
          nearestBeatErrorMs: nowMs - (DOWNBEAT_OFFSET_MS + nearestBeat * BEAT_MS),
        });
      }
      if (phaseRef.current === 'input' || phaseRef.current === 'timing') {
        const prevPos = curRef.current;
        const pos = Math.min(1, Math.max(0, (nowMs - roundStartRef.current) / roundDurationRef.current));
        setCursorPos(pos); curRef.current = pos;
        if (!targetCrossedRef.current && prevPos < TARGET_CENTER && pos >= TARGET_CENTER) {
          targetCrossedRef.current = true;
          setTargetPulse(true);
          clearTimeout(targetPulseTimer.current);
          targetPulseTimer.current = setTimeout(() => setTargetPulse(false), 160);
        }
        if (pos >= 1) {
          if (!roundJudgedRef.current) {
            setNoteStates(patRef.current.map((_, i) => i < idxRef.current ? 'hit' : 'miss'));
            doFeedback('Miss');
          }
          finishRound();
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [screen, doFeedback, finishRound]);

  // ── Song timer ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'playing') return;
    songInt.current = setInterval(() => {
      const el = audioMs(audioRef.current);
      setSongElapsed(el); songRef.current = el;
    }, 100);
    return () => clearInterval(songInt.current);
  }, [screen]);

  useEffect(() => {
    if (screen !== 'playing') return;
    decayInt.current = setInterval(() => {
      if (screenRef.current !== 'playing') return;
      const nextHeart = Math.max(0, heartRef.current - HEART_DECAY_PER_SECOND * (HEART_DECAY_TICK_MS / 1000));
      heartRef.current = nextHeart;
      setHeartPct(nextHeart);
    }, HEART_DECAY_TICK_MS);
    return () => clearInterval(decayInt.current);
  }, [screen]);

  // ── Keyboard ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = e => {
      const sc = screenRef.current;
      if (sc === 'intro') {
        return;
      }
      if (sc === 'win' || sc === 'lose') return;
      if (sc !== 'playing') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if ((phaseRef.current === 'input' || phaseRef.current === 'timing') && !roundJudgedRef.current) {
          const d = Math.abs(curRef.current - TARGET_CENTER);
          const isInsideTarget = d <= TARGET_ZONE_WIDTH / 2;
          const q = phaseRef.current === 'input'
            ? 'Miss'
            : !isInsideTarget ? 'Miss' : d <= PERFECT_WINDOW ? 'Perfect' : d <= GREAT_WINDOW ? 'Great' : d <= GOOD_WINDOW ? 'Good' : 'Miss';
          doFeedback(q);
          phaseRef.current = 'timing'; setPhase('timing');
        }
        return;
      }
      if (!DIRS.includes(e.code) || phaseRef.current !== 'input') return;
      e.preventDefault();
      const cur = idxRef.current, pat = patRef.current;
      if (!pat.length) return;
      if (e.code === pat[cur]) {
        const ni = cur + 1;
        setNoteStates(pat.map((_, i) => i < ni ? 'hit' : 'pending'));
        setInputIdx(ni); idxRef.current = ni;
        if (ni >= pat.length) {
          phaseRef.current = 'timing'; setPhase('timing');
        }
      } else {
        setNoteStates(pat.map(() => 'pending'));
        setInputIdx(0); idxRef.current = 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doFeedback]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── startGame ─────────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    clearTimeout(nextTimer.current);
    clearTimeout(targetPulseTimer.current);
    clearInterval(songInt.current);
    clearInterval(decayInt.current);
    if (rafId.current) cancelAnimationFrame(rafId.current);

    if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().catch(() => {}); }

    setScreen('playing');
    setHeartPct(0); heartRef.current = 0;
    setScore(0);
    setCombo(0); comboRef.current = 0;
    setSongElapsed(0); songRef.current = 0;
    setBeatDebug({ beatIndex: 0, nearestBeatErrorMs: 0 });
    lastDebugBeatRef.current = -1;
    roundIndexRef.current = 0;
    currentLevelRef.current = 1;
    setCurrentLevel(1);
    setPattern([]); setNoteStates([]);
    setCursorPos(0); curRef.current = 0;
    targetCrossedRef.current = false;
    roundJudgedRef.current = false;
    setTargetPulse(false);
    setPhase('idle'); phaseRef.current = 'idle';
    setFeedback(null); setParticles([]);

    nextTimer.current = setTimeout(() => {
      if (screenRef.current === 'playing') doNextPat();
    }, 1400);
  }, [doNextPat]);

  const goIntro = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    clearTimeout(nextTimer.current);
    clearTimeout(targetPulseTimer.current);
    clearInterval(songInt.current);
    clearInterval(decayInt.current);
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setScreen('intro');
    setSongElapsed(0);
  }, []);

  const handleAudioLoadedMetadata = useCallback(() => {
    const duration = audioRef.current?.duration;
    if (Number.isFinite(duration) && duration > 0) {
      setSongDuration(duration * 1000);
    }
  }, []);

  const handleAudioEnded = useCallback(() => {
    clearInterval(songInt.current);
    if (screenRef.current === 'playing') {
      setSongElapsed(audioMs(audioRef.current));
      setScreen(heartRef.current > 0 ? 'win' : 'lose');
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    if (document.fullscreenElement === el) {
      document.exitFullscreen?.();
      return;
    }

    el.requestFullscreen?.();
  }, []);

  // ── Derived visuals ───────────────────────────────────────────────────────────
  const warmth       = heartPct / 100;
  const overlayAlpha = 0;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <main className="sky-page b-page-shell">
      <audio
        ref={audioRef}
        src={A.audio}
        preload="auto"
        onLoadedMetadata={handleAudioLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      <div className="sky-outer-header">
        <div className="sky-studio-topbar">
          <button className="sky-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m12 5-7 7 7 7"/></svg>
            Back to Home
          </button>
        </div>
        <div className="sky-studio-header">
          <h1>Beauty and a Beat</h1>
          <p className="sky-subtitle">Complete each full arrow sequence before the beat marker reaches the end.</p>
        </div>
      </div>

      <div className="b-game-container" ref={containerRef}>
      <img className="b-frame-background" src={screen === 'playing' ? A.backgroundGame : A.background} alt="" />
      <button
        type="button"
        className="b-fullscreen-button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 3v5H3" /><path d="M21 8h-5V3" /><path d="M3 16h5v5" /><path d="M16 21v-5h5" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8V3h5" /><path d="M16 3h5v5" /><path d="M21 16v5h-5" /><path d="M8 21H3v-5" />
          </svg>
        )}
      </button>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: W,
        height: H,
        overflow: 'hidden',
        transformOrigin: 'center center',
        transform: `translate(-50%, -50%) scale(${stageScale.x * OVERLAY_WIDTH_SCALE}, ${stageScale.y})`,
        zIndex: 1,
      }}>

        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: `rgba(3,5,16,${overlayAlpha})`, transition: 'background 2.5s ease' }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: `radial-gradient(ellipse 90% 55% at 50% 100%,rgba(180,120,40,${warmth * 0.14}) 0%,transparent 65%)`,
          transition: 'background 2s ease',
        }} />

        {/* Belle — shown during gameplay */}
        {false && screen !== 'intro' && screen !== 'playing' && (
          <img src={A.belle} alt="" style={{
            position: 'absolute', right: -10, bottom: BH + 10,
            height: '55%', objectFit: 'contain',
            opacity: 0.22 + warmth * 0.32,
            filter: `drop-shadow(0 0 40px rgba(201,168,76,${0.06 + warmth * 0.16})) saturate(0.5)`,
            transition: 'opacity 2s ease', zIndex: 3,
          }} />
        )}

        {/* Beast — crossfade between states */}
        {/* Title bar — playing only */}
        {screen === 'playing' && (
          <div style={{
            position: 'absolute', top: 0, left: LW, right: RW, height: 88, zIndex: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(180deg,rgba(3,5,16,0.88) 0%,rgba(3,5,16,0) 100%)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 60, height: 1, background: 'rgba(201,168,76,0.4)' }} />
              <div style={{ fontFamily: 'Cormorant Garamond', color: '#c9a84c', fontSize: 32, fontWeight: 700, letterSpacing: 6, textShadow: '0 0 24px rgba(201,168,76,0.5)', animation: 'pulseGold 4s ease-in-out infinite' }}>
                BEAUTY AND A BEAT
              </div>
              <div style={{ width: 60, height: 1, background: 'rgba(201,168,76,0.4)' }} />
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond', color: 'rgba(201,168,76,0.5)', fontSize: 17, letterSpacing: 8, marginTop: 3 }}>RHYTHM OF LOVE</div>
          </div>
        )}

        {/* HUD */}
        {screen === 'playing' && (
          <>
            <LeftPanel pct={heartPct} />
            <RightPanel score={score} combo={combo} pct={heartPct} />
            <BottomPanel
              phase={phase} pattern={pattern} noteStates={noteStates}
              feedback={feedback} cursorPos={cursorPos} targetPulse={targetPulse}
              songElapsed={songElapsed} songDuration={songDuration} beatDebug={beatDebug} currentLevel={currentLevel}
            />
            <Particles list={particles} />
          </>
        )}

        {/* ── INTRO SCREEN ── */}
        {screen === 'intro' && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
            paddingTop: 104,
          }}>
            <div style={{ animation: 'introFade 1s ease', textAlign: 'center' }}>
              <img src={A.title} alt="Beauty and a Beat" style={{
                width: 1050,
                maxWidth: '82vw',
                display: 'block',
                filter: 'drop-shadow(0 0 34px rgba(201,168,76,0.5))',
                animation: 'pulseGold 3s ease-in-out infinite',
              }} />
            </div>
            <img src={A.belle} alt="" style={{
              height: '55%', objectFit: 'contain',
              filter: 'drop-shadow(0 0 50px rgba(201,168,76,0.45))',
              animation: 'floatY 3.5s ease-in-out infinite',
              marginTop: 30,
              marginBottom: 38,
            }} />
            <button
              type="button"
              onClick={startGame}
              aria-label="Start game"
              className="b-start-button"
              style={{
                width: 400,
                maxWidth: '100%',
                aspectRatio: '1536 / 1024',
                marginTop: -120,
                padding: 0,
                border: 0,
                borderRadius: 12,
                background: 'transparent',
                overflow: 'hidden',
                cursor: 'pointer',
                filter: 'drop-shadow(0 0 26px rgba(201,168,76,0.45))',
              }}
            >
              <img className="b-start-button-image" src={A.start} alt="" />
            </button>
          </div>
        )}

        {/* ── WIN SCREEN ── */}
        {screen === 'win' && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(201,140,40,0.16) 0%,rgba(3,5,16,0.65) 70%)',
            animation: 'introFade 0.8s ease',
          }}>
            <div style={{ fontFamily: 'Cinzel Decorative', color: '#ffd700', fontSize: 62, fontWeight: 700, textShadow: '0 0 60px rgba(255,215,0,0.85),0 0 120px rgba(201,168,76,0.3)', animation: 'heartbeat 1.3s ease-in-out infinite' }}>
              ◆ Heart Unlocked ◆
            </div>
            <div style={{ fontFamily: 'Cinzel', color: 'rgba(245,240,232,0.75)', fontSize: 21, letterSpacing: 5 }}>The Beast's heart has opened to love</div>
            <div style={{ fontFamily: 'Cinzel', color: '#c9a84c', fontSize: 28, marginTop: 6 }}>{score.toLocaleString()} pts</div>
            <button
              type="button"
              onClick={goIntro}
              aria-label="Play again"
              className="b-start-button"
              style={{
                width: 400,
                maxWidth: '70%',
                padding: 0,
                border: 0,
                background: 'transparent',
                cursor: 'pointer',
                marginTop: 12,
                filter: 'drop-shadow(0 0 18px rgba(201,168,76,0.42))',
              }}
            >
              <img className="b-start-button-image" src={A.playAgain} alt="" />
            </button>
          </div>
        )}

        {/* ── LOSE SCREEN ── */}
        {screen === 'lose' && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
            background: 'rgba(3,5,16,0.7)', animation: 'introFade 0.8s ease',
          }}>
            <div style={{ fontFamily: 'Cinzel Decorative', color: '#7788aa', fontSize: 50, textShadow: '0 0 40px rgba(100,120,180,0.5)' }}>The Rose Has Faded</div>
            <div style={{ fontFamily: 'Cinzel', color: 'rgba(245,240,232,0.5)', fontSize: 19, letterSpacing: 4 }}>His heart remained guarded…</div>
            <div style={{ fontFamily: 'Cinzel', color: '#c9a84c', fontSize: 28, marginTop: 6 }}>{score.toLocaleString()} pts</div>
            <button
              type="button"
              onClick={goIntro}
              aria-label="Play again"
              className="b-start-button"
              style={{
                width: 400,
                maxWidth: '70%',
                padding: 0,
                border: 0,
                background: 'transparent',
                cursor: 'pointer',
                marginTop: 12,
                filter: 'drop-shadow(0 0 18px rgba(201,168,76,0.42))',
              }}
            >
              <img className="b-start-button-image" src={A.playAgain} alt="" />
            </button>
          </div>
        )}

      </div>
      </div>
    </main>
  );
}
