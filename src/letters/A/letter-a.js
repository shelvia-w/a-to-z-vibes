import { useEffect, useMemo, useRef, useState } from "react";
import "./letter-a.css";

const CONSTELLATIONS = [
  {
    id: "orion",
    name: "Orion",
    pronunciation: "oh-RY-un",
    meaning: "The Hunter",
    myth: "In Greek mythology, Orion was a giant huntsman placed among the stars by Zeus. His belt — three perfectly aligned stars — has guided navigators for millennia and points toward Sirius, the brightest star in the sky.",
    season: "Winter",
    bestStars: ["Rigel", "Betelgeuse", "Bellatrix", "Alnilam"],
    stars: [
      { name: "Meissa",     x: 50, y: 13, size: 3.2,  note: "Orion's head" },
      { name: "Betelgeuse", x: 35, y: 32, size: 5.5,  note: "Red supergiant — left shoulder", color: "#ff9966" },
      { name: "Bellatrix",  x: 64, y: 30, size: 3.8,  note: "Right shoulder" },
      { name: "Mintaka",    x: 40, y: 53, size: 3.0,  note: "Belt — westernmost star" },
      { name: "Alnilam",    x: 50, y: 55, size: 3.4,  note: "Belt — center star" },
      { name: "Alnitak",    x: 60, y: 57, size: 3.2,  note: "Belt — easternmost star" },
      { name: "Saiph",      x: 37, y: 76, size: 3.2,  note: "Left foot" },
      { name: "Rigel",      x: 66, y: 78, size: 6.0,  note: "Brightest star — blue supergiant, right foot", color: "#cce8ff" },
    ],
    lines: [[0,1],[0,2],[1,3],[2,5],[3,4],[4,5],[3,6],[5,7],[6,7]],
  },
  {
    id: "cassiopeia",
    name: "Cassiopeia",
    pronunciation: "kas-ee-oh-PEE-uh",
    meaning: "The Vain Queen",
    myth: "Cassiopeia was an Ethiopian queen who boasted her daughter was more beautiful than the sea nymphs. As punishment, Poseidon set a sea monster upon her kingdom. She was placed in the sky to circle the north pole forever — sometimes hanging upside down as a reminder of her hubris.",
    season: "All year (circumpolar)",
    bestStars: ["Schedar", "Caph", "Navi"],
    stars: [
      { name: "Segin",   x: 12, y: 20, size: 3.0,  note: "Epsilon Cas - hot blue-white star" },
      { name: "Ruchbah", x: 28, y: 47, size: 3.2,  note: "Delta Cas - eclipsing binary" },
      { name: "Navi",    x: 46, y: 43, size: 3.8,  note: "Gamma Cas - an eruptive variable star" },
      { name: "Schedar", x: 60, y: 70, size: 4.2,  note: "Alpha Cas - the brightest, orange giant" , color: "#ffbb88" },
      { name: "Caph",    x: 82, y: 52, size: 3.5,  note: "Beta Cas - part of the W's western edge" },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4]],
  },
  {
    id: "ursa-major",
    name: "Ursa Major",
    pronunciation: "UR-suh MAY-jer",
    meaning: "The Great Bear",
    myth: "Zeus transformed the nymph Callisto into a bear to protect her from Hera's wrath. Her son Arcas nearly hunted her before Zeus placed them both in the stars. The Big Dipper's outer bowl stars, Dubhe and Merak, point directly to Polaris — the North Star.",
    season: "Spring",
    bestStars: ["Alioth", "Dubhe", "Mizar", "Alkaid"],
    stars: [
      { name: "Dubhe",   x: 84, y: 45, size: 4.2,  note: "Bowl — outer top, points to Polaris", color: "#ffcc99" },
      { name: "Merak",   x: 76, y: 64, size: 3.4,  note: "Bowl — outer bottom, pointer star" },
      { name: "Phecda",  x: 55, y: 58, size: 3.2,  note: "Bowl — inner bottom" },
      { name: "Megrez",  x: 53, y: 42, size: 2.8,  note: "Junction of bowl and handle — faintest" },
      { name: "Alioth",  x: 39, y: 33, size: 4.5,  note: "Handle — brightest star in Ursa Major" },
      { name: "Mizar",   x: 26, y: 25, size: 3.8,  note: "Handle middle — famous double star with Alcor" },
      { name: "Alkaid",  x: 11, y: 26, size: 3.4,  note: "Handle tip — also called Eta Ursae Majoris" },
    ],
    lines: [[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]],
  },
  {
    id: "leo",
    name: "Leo",
    pronunciation: "LEE-oh",
    meaning: "The Lion",
    myth: "Leo represents the Nemean Lion slain by Heracles as the first of his twelve labors. The lion's skin was impervious to weapons, so Heracles strangled it with his bare hands and wore its golden pelt as armor.",
    season: "Spring",
    bestStars: ["Regulus", "Denebola", "Algieba"],
    stars: [
      { name: "Regulus",     x: 76, y: 55, size: 5.5,  note: "Heart of the lion - 4th brightest in Leo", color: "#cce4ff" },
      { name: "Al Jabhah",   x: 70, y: 45, size: 2.8,  note: "Part of the Sickle asterism" },
      { name: "Algieba",     x: 58, y: 42, size: 4.0,  note: "Double star - the lion's mane, golden hue", color: "#ffdd99" },
      { name: "Adhafera",    x: 55, y: 31, size: 3.0,  note: "The Sickle - forehead of the lion" },
      { name: "Ras Elased",  x: 63, y: 17, size: 2.8,  note: "Top bend of the lion's head" },
      { name: "Algenubi",    x: 70, y: 20, size: 2.7,  note: "Star in the lion's head" },
      { name: "Zosma",       x: 28, y: 56, size: 3.2,  note: "Hip of the lion" },
      { name: "Chertan",     x: 35, y: 69, size: 3.0,  note: "Thigh" },
      { name: "Denebola",    x: 18, y: 82, size: 3.8,  note: "Tail of the lion - receding from us" },
    ],
    lines: [[8,6],[6,7],[7,8],[7,0],[0,1],[1,2],[2,6],[2,3],[3,4],[4,5]],
  },
  {
    id: "cygnus",
    name: "Cygnus",
    pronunciation: "SIG-nus",
    meaning: "The Swan",
    myth: "The swan soars along the Milky Way with wings spread wide. Some say it is Zeus disguised as a swan, others that it is Orpheus transformed after death. Its cruciform shape earned it the name the Northern Cross.",
    season: "Summer",
    bestStars: ["Deneb", "Sadr", "Albireo", "Fawaris"],
    stars: [
      { name: "Deneb",   x: 37, y: 36, size: 5.2,  note: "Tail - one of the most luminous stars known" },
      { name: "Sadr",    x: 47, y: 52, size: 3.8,  note: "Breast - center of the Northern Cross" },
      { name: "Aljanah", x: 29, y: 73, size: 3.2,  note: "Wing star in Cygnus" },
      { name: "Fawaris", x: 70, y: 43, size: 3.4,  note: "Right wing tip - Delta Cygni" },
      { name: "Albireo", x: 80, y: 88, size: 3.4,  note: "Beak - a stunning gold and blue double star", color: "#ffe0a0" },
    ],
    lines: [[0,1],[1,4],[1,2],[1,3]],
  },
  {
    id: "lyra",
    name: "Lyra",
    pronunciation: "LY-ruh",
    meaning: "The Lyre",
    myth: "The lyre of Orpheus, whose music could charm rocks and rivers and even halt the flow of the underworld. After his death, the Muses placed his lyre among the stars so his song would never be forgotten.",
    season: "Summer",
    bestStars: ["Vega", "Sheliak", "Sulafat", "Epsilon Lyrae"],
    stars: [
      { name: "Sulafat",       x: 25, y: 67, size: 6.5, note: "One corner of the lyre" },
      { name: "Delta Lyrae",   x: 40, y: 44, size: 3.2, note: "Star on the left side of the lyre figure" },
      { name: "Sheliak",       x: 35, y: 69, size: 3.2, note: "Eclipsing binary - varies in brightness" },
      { name: "Zeta Lyrae",    x: 51, y: 46, size: 3.2, note: "Star near the center of the lyre figure" },
      { name: "Epsilon Lyrae", x: 58, y: 31, size: 2.8, note: "The famous double-double star system" },
      { name: "Vega",          x: 66, y: 43, size: 2.8, note: "The brightest star in Lyra and one of the brightest stars in the night sky" },
    ],
    lines: [[0,1],[0,2],[2,3],[3,1],[1,3],[3,4],[4,5],[5,3]],
  },
];

const BG_STAR_COUNT = 130;
const PARTICLE_COUNT = 28;

const makeBgStars = () =>
  Array.from({ length: BG_STAR_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.8 + Math.random() * 2.2,
    delay: Math.random() * 5,
    duration: 2.5 + Math.random() * 4,
    opacity: 0.2 + Math.random() * 0.6,
  }));

const makeParticles = () =>
  Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 4 + Math.random() * 12,
    delay: Math.random() * 12,
    duration: 16 + Math.random() * 14,
  }));

const Toggle = ({ checked, onChange, label }) => (
  <label className="toggle-row">
    <span>{label}</span>
    <span className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-track" />
    </span>
  </label>
);

export default function LetterA({ onBack }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.4);

  const [selectedId, setSelectedId] = useState("orion");
  const [showLines, setShowLines] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showArt, setShowArt] = useState(true);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [revealedLines, setRevealedLines] = useState(0);
  const [pointer, setPointer] = useState({ x: 50, y: 46 });

  const bgStars = useMemo(makeBgStars, []);
  const particles = useMemo(makeParticles, []);
  const audioSrc = `${process.env.PUBLIC_URL}/letters/A/audio/universe.mp3`;
  const orionImageSrc = `${process.env.PUBLIC_URL}/letters/A/images/orion.png`;
  const cassiopeiaImageSrc = `${process.env.PUBLIC_URL}/letters/A/images/cassiopeia.png`;
  const ursamajorImageSrc = `${process.env.PUBLIC_URL}/letters/A/images/ursa_major.png`;
  const leoImageSrc = `${process.env.PUBLIC_URL}/letters/A/images/leo.png`;
  const cygnusImageSrc = `${process.env.PUBLIC_URL}/letters/A/images/cygnus.png`;
  const lyraImageSrc = `${process.env.PUBLIC_URL}/letters/A/images/lyra.png`;

  const constellation = CONSTELLATIONS.find((c) => c.id === selectedId);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, volume]);

  useEffect(() => {
    setHoveredStar(null);
    setShowLines(true);
    setRevealedLines(0);

    const traceTimers = constellation.lines.map((_, i) =>
      window.setTimeout(() => {
        setRevealedLines(i + 1);
      }, (i + 1) * 480)
    );

    return () => {
      traceTimers.forEach(window.clearTimeout);
    };
  }, [constellation.lines, selectedId]);

  const handlePointerMove = (event) => {
    setPointer({
      x: (event.clientX / window.innerWidth) * 100,
      y: (event.clientY / window.innerHeight) * 100,
    });
  };

  const sceneStyle = {
    "--glow-x": `${pointer.x}%`,
    "--glow-y": `${pointer.y}%`,
  };


  return (
    <main className="sky-page" style={sceneStyle} onPointerMove={handlePointerMove}>
      <audio ref={audioRef} src={audioSrc} autoPlay loop preload="auto" />
      <div className="sky-outer-header">
        <div className="sky-studio-topbar">
          <button className="sky-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m12 5-7 7 7 7"/></svg>
            Back to Home
          </button>
        </div>

        <div className="sky-studio-header">
          <h1>A Sky Full of Stars</h1>
          <p className="sky-subtitle">
            Select a constellation, trace its shape, and discover the myths written in light.
          </p>
        </div>
      </div>

      <div className="sky-studio-grid">
          <aside className="sky-controls" aria-label="Constellation controls">
            <div className="control-group">
              <p className="control-section-label">Constellation</p>
              <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                {CONSTELLATIONS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} — {c.meaning}</option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <p className="control-section-label">Display</p>
              <div className="toggle-list">
                <Toggle label="Constellation Lines" checked={showLines} onChange={(e) => setShowLines(e.target.checked)} />
                <Toggle label="Star Labels" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />
                <Toggle label="Background Art" checked={showArt} onChange={(e) => setShowArt(e.target.checked)} />
              </div>
            </div>

            <div className="audio-player">
              <button
                className="audio-play-btn"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? "Pause music" : "Play music"}
              >
                {isPlaying ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                )}
              </button>
              <div className="audio-track-info">
                <span className="audio-track-name">Music</span>
                <span className="audio-track-status">{isPlaying ? "playing" : "paused"}</span>
              </div>
              <input
                type="range"
                className="audio-volume"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume"
              />
            </div>

            <div className="info-card">
              <div className="info-card-header">
                <h2 className="info-name">{constellation.name}</h2>
                <p className="info-pronunciation">/{constellation.pronunciation}/</p>
                <div className="info-badges">
                  <span className="info-badge">{constellation.meaning}</span>
                  <span className="info-badge">{constellation.season}</span>
                </div>
              </div>
              <p className="info-myth">{constellation.myth}</p>
              <div className="info-stars-section">
                <p className="info-stars-label">Notable Stars</p>
                <ul className="info-stars-list">
                  {constellation.bestStars.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <section className="sky-scene-card" aria-label="Interactive constellation view">
            <div className="bg-star-field" aria-hidden="true">
              {bgStars.map((star) => (
                <span
                  key={star.id}
                  className="bg-star"
                  style={{
                    "--x": `${star.x}%`,
                    "--y": `${star.y}%`,
                    "--size": `${star.size}px`,
                    "--delay": `${star.delay}s`,
                    "--duration": `${star.duration}s`,
                    "--opacity": star.opacity,
                  }}
                />
              ))}
            </div>

            <div className="soft-particles" aria-hidden="true">
              {particles.map((p) => (
                <span
                  key={p.id}
                  className="particle"
                  style={{
                    "--x": `${p.x}%`,
                    "--y": `${p.y}%`,
                    "--size": `${p.size}px`,
                    "--delay": `${p.delay}s`,
                    "--duration": `${p.duration}s`,
                  }}
                />
              ))}
            </div>

            <div className="moon-glow" aria-hidden="true" />
            <div className="horizon-glow" aria-hidden="true" />
            <div className="aurora-layer" aria-hidden="true" />

            {showArt && constellation.id === "orion" && (
              <div className="mythic-figure-layer" aria-hidden="true">
                <img src={orionImageSrc} alt="" className="mythic-figure-image" />
              </div>
            )}

            {showArt && constellation.id === "cassiopeia" && (
              <div className="mythic-figure-layer" aria-hidden="true">
                <img src={cassiopeiaImageSrc} alt="" className="mythic-figure-image" />
              </div>
            )}

            {showArt && constellation.id === "ursa-major" && (
              <div className="mythic-figure-layer" aria-hidden="true">
                <img src={ursamajorImageSrc} alt="" className="mythic-figure-image" />
              </div>
            )}

            {showArt && constellation.id === "leo" && (
              <div className="mythic-figure-layer" aria-hidden="true">
                <img src={leoImageSrc} alt="" className="mythic-figure-image" />
              </div>
            )}

            {showArt && constellation.id === "cygnus" && (
              <div className="mythic-figure-layer" aria-hidden="true">
                <img src={cygnusImageSrc} alt="" className="mythic-figure-image" />
              </div>
            )}

            {showArt && constellation.id === "lyra" && (
              <div className="mythic-figure-layer" aria-hidden="true">
                <img src={lyraImageSrc} alt="" className="mythic-figure-image" />
              </div>
            )}

            {showLines && (
              <svg
                className="constellation-lines-svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {constellation.lines.slice(0, revealedLines).map(([a, b], i) => {
                  const from = constellation.stars[a];
                  const to = constellation.stars[b];
                  return (
                    <line
                      key={`${constellation.id}-line-${i}`}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      className="c-line"
                    />
                  );
                })}
              </svg>
            )}

            <div className="constellation-stars" aria-label="Constellation stars">
              {constellation.stars.map((star, i) => (
                <span
                  key={`${constellation.id}-star-${i}`}
                  className={`c-star${hoveredStar === i ? " c-star--hovered" : ""}`}
                  style={{
                    "--x": `${star.x}%`,
                    "--y": `${star.y}%`,
                    "--size": `${star.size * 2.8}px`,
                    "--color": star.color || "#ffffff",
                  }}
                  onMouseEnter={() => setHoveredStar(i)}
                  onMouseLeave={() => setHoveredStar(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={star.name}
                />
              ))}
            </div>

            {showLabels && constellation.stars.map((star, i) => (
              <span
                key={`${constellation.id}-label-${i}`}
                className="c-star-label"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                }}
              >
                {star.name}
              </span>
            ))}

            {hoveredStar !== null && (
              <div
                className="star-tooltip"
                style={{
                  "--tx": `${constellation.stars[hoveredStar].x}%`,
                  "--ty": `${constellation.stars[hoveredStar].y}%`,
                }}
              >
                <strong>{constellation.stars[hoveredStar].name}</strong>
                <span>{constellation.stars[hoveredStar].note}</span>
              </div>
            )}
          </section>
        </div>
    </main>
  );
}
