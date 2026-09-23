import { useEffect, useMemo, useRef, useState } from "react";
import "./letter-c.css";

const PROMPTS = [
  {
    id: "reflect",
    label: "Reflect",
    icon: "reflect",
    eyebrow: "Look inward",
    questions: [
      "When do I feel most like myself?",
      "What do I wish people understood about me?",
      "What part of myself am I still learning to accept?",
      "How have I changed in the past year?",
      "What is something about myself that I’m proud of?",
      "What part of my identity matters most to me right now?",
      "Who am I when I’m not thinking about work or achievement?",
      "What is something I used to believe about myself that no longer feels true?",
      "What is something I’m getting better at?",
      "What is one habit I want to change?",
      "What am I avoiding even though I know it would help me grow?",
      "What mistake has taught me something valuable?",
      "Where am I currently playing too safe?",
      "What uncomfortable thing might be good for me?",
      "What would my future self thank me for doing today?",
      "What does becoming a better version of myself mean to me?",
      "What emotion have I been feeling most often lately?",
      "What has been weighing on me recently?",
      "What usually makes me feel overwhelmed?",
      "What makes me feel calm and grounded?",
      "What tends to trigger a stronger reaction in me than I expect?",
      "What emotion do I find hardest to express?",
      "What do I usually need when I’m having a difficult day?",
      "What feeling have I been trying to avoid?",
      "What makes me feel genuinely loved?",
      "How do I usually show people that I care?",
      "Who makes me feel safest being completely myself?",
      "What do I need more of from the people closest to me?",
      "What kind of friend or partner do I want to be?",
      "Which relationship would I like to nurture more?",
      "When was the last time someone made me feel deeply understood?",
      "What is something I appreciate about someone that I rarely tell them?",
      "How do I behave when I feel misunderstood?",
      "Am I good at telling people what I need?",
      "What is difficult for me to say out loud?",
      "How do I react when someone disagrees with me?",
      "Do I listen to understand or listen to respond?",
      "What kind of conflict makes me shut down?",
      "What is something I wish I communicated better?",
      "How could I make the people around me feel more heard?",
      "Where in my life do I have trouble saying no?",
      "What do I need more of right now?",
      "What do I need less of?",
      "Is there somewhere I’m giving more than I actually want to give?",
      "What boundary would make one of my relationships healthier?",
      "When do I ignore my own needs to keep someone else happy?",
      "What makes me feel respected?",
      "What behaviour from others is difficult for me to tolerate?",
      "What matters most to me right now?",
      "Does the way I spend my time reflect what I say matters to me?",
      "What qualities do I admire most in other people?",
      "What is something I refuse to compromise on?",
      "What does success mean to me personally?",
      "What does a good life look like to me?",
      "What am I prioritising that may not actually matter that much?",
      "If I had less fear of judgment, what would I choose differently?",
      "What pattern seems to repeat itself in my life?",
      "What experience from my past still affects how I behave today?",
      "What kind of situations tend to bring out the worst in me?",
      "What situations bring out the best in me?",
      "What lesson have I had to learn more than once?",
      "What do I tend to do when I feel insecure?",
      "Is there something I keep holding onto even though it no longer helps me?",
      "What is one pattern I would like to break?",
      "What am I afraid to admit to myself?",
      "What am I afraid other people might think about me?",
      "When was the last time I did something despite being scared?",
      "What conversation have I been avoiding?",
      "Where could I be more honest with myself?",
      "What would I try if I knew I wouldn’t be judged?",
      "What am I still trying to prove, and to whom?",
      "Where in my life do I need more courage?",
      "Whose approval matters too much to me?",
      "When do I compare myself with others most?",
      "What does my jealousy or envy tell me about what I want?",
      "What makes me feel like I’m “not enough”?",
      "What kind of validation do I often seek from others?",
      "What would change if I trusted my own judgment more?",
      "What achievement am I chasing partly because other people value it?",
      "When do I feel secure without needing anyone else's approval?",
      "What has made me genuinely happy recently?",
      "What small thing am I looking forward to?",
      "What makes me lose track of time?",
      "What makes me feel alive?",
      "What have I started taking for granted?",
      "What ordinary moment recently felt surprisingly meaningful?",
      "What would I like to make more room for in my life?",
      "When do I feel most at peace?",
      "What has been on my mind a lot lately?",
      "What feels most uncertain in my life right now?",
      "What am I currently excited about?",
      "What am I worried about that might not matter a year from now?",
      "What feels unfinished in my life at the moment?",
      "What is taking up more mental space than it deserves?",
      "What am I craving right now—emotionally, socially, or personally?",
      "If I could change one thing about my everyday life, what would it be?",
      "What kind of person do I want to become?",
      "What do I want my life to contain more of?",
      "What do I hope will be different about me a year from now?",
      "If my life stayed exactly the same for three years, how would I feel?",
      "What am I building toward right now?",
      "What dream have I been putting off?",
      "What would I regret not doing?",
      "What is one small choice I can make now that moves me toward the life I want?",
    ],
    x: 12,
    y: 42,
    scale: 0.92,
    delay: 0,
  },
  {
    id: "interview",
    label: "Interview",
    icon: "interview",
    eyebrow: "Ask gently",
    questions: [
      "If I could ask myself one honest question, what would it be?",
      "What answer have I been avoiding?",
      "What would my future self want to ask me today?",
      "What do I wish someone would ask me about?",
      "Which belief of mine is worth examining?",
    ],
    x: 30,
    y: 27,
    scale: 0.82,
    delay: -1.8,
  },
  {
    id: "curiosity",
    label: "Curiosity",
    icon: "curiosity",
    eyebrow: "Follow the question",
    questions: [
      "What am I genuinely curious to explore?",
      "What have I noticed but not followed?",
      "What would I learn if I gave this more attention?",
      "Which question feels alive for me right now?",
      "What might surprise me if I looked closer?",
    ],
    x: 50,
    y: 38,
    scale: 1.04,
    delay: -0.9,
  },
  {
    id: "hypothetical",
    label: "Hypothetical",
    icon: "hypothetical",
    eyebrow: "Imagine possibility",
    questions: [
      "What might become possible if I tried a different approach?",
      "If fear were quieter, what would I try?",
      "What would change if I assumed things could go well?",
      "If there were no perfect answer, what would I choose?",
      "What small experiment could show me another way?",
    ],
    x: 69,
    y: 25,
    scale: 0.84,
    delay: -2.5,
  },
  {
    id: "perspectives",
    label: "Perspectives",
    icon: "perspectives",
    eyebrow: "See another angle",
    questions: [
      "How might this look from another point of view?",
      "What might someone I trust notice here?",
      "What changes when I zoom out?",
      "Which part of this story might I be missing?",
      "How could I describe this with more kindness?",
    ],
    x: 84,
    y: 45,
    scale: 0.94,
    delay: -1.2,
  },
];

const DISTANT_LANTERNS = [
  { x: 5, y: 27, size: 22, opacity: 0.5, blur: 0.2, delay: -2.1 },
  { x: 13, y: 48, size: 19, opacity: 0.46, blur: 0.25, delay: -6.4, water: true },
  { x: 20, y: 17, size: 15, opacity: 0.42, blur: 0.35, delay: -4.2 },
  { x: 29, y: 39, size: 25, opacity: 0.54, blur: 0.1, delay: -8.1 },
  { x: 39, y: 51, size: 18, opacity: 0.46, blur: 0.25, delay: -1.3, water: true },
  { x: 50, y: 34, size: 14, opacity: 0.4, blur: 0.4, delay: -7.2 },
  { x: 61, y: 48, size: 21, opacity: 0.5, blur: 0.2, delay: -3.5, water: true },
  { x: 70, y: 18, size: 16, opacity: 0.44, blur: 0.3, delay: -5.3 },
  { x: 78, y: 37, size: 23, opacity: 0.52, blur: 0.12, delay: -9.1 },
  { x: 87, y: 51, size: 20, opacity: 0.48, blur: 0.22, delay: -4.8, water: true },
  { x: 95, y: 28, size: 20, opacity: 0.5, blur: 0.18, delay: -7.8 },
  { x: 57, y: 41, size: 13, opacity: 0.38, blur: 0.45, delay: -2.9 },
];

function getRandomPromptIndex(questions, currentIndex = -1) {
  if (questions.length <= 1) return 0;
  if (currentIndex < 0) return Math.floor(Math.random() * questions.length);
  const offset = 1 + Math.floor(Math.random() * (questions.length - 1));
  return (currentIndex + offset) % questions.length;
}

function Icon({ name, size = 20 }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "reflect") {
    return <svg {...props}><path d="M19.5 4.5C12 4.7 6.8 8 5.2 13.3c-1 3.2.4 5.6 2.9 6.2 4.7 1.1 9.4-5.4 11.4-15Z"/><path d="M4.5 20c2.5-4.3 5.9-7.5 10.8-10"/></svg>;
  }
  if (name === "interview") {
    return <svg {...props}><rect x="8" y="3" width="8" height="12" rx="4"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8.5 21h7"/></svg>;
  }
  if (name === "curiosity") {
    return <svg {...props}><circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 5 5"/></svg>;
  }
  if (name === "hypothetical") {
    return <svg {...props}><path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3Z"/></svg>;
  }
  if (name === "perspectives") {
    return <svg {...props}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.8"/></svg>;
  }
  if (name === "arrow") {
    return <svg {...props}><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>;
  }
  if (name === "play") {
    return <svg {...props} fill="currentColor" stroke="none"><path d="m8 5 11 7-11 7V5Z"/></svg>;
  }
  if (name === "pause") {
    return <svg {...props} fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>;
  }
  if (name === "reset") {
    return <svg {...props}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>;
  }
  if (name === "regenerate") {
    return <svg {...props}><path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M6.1 8A7 7 0 0 1 18.7 9.6L20 12"/><path d="M17.9 16A7 7 0 0 1 5.3 14.4L4 12"/></svg>;
  }
  if (name === "plus") {
    return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
  }
  if (name === "spark") {
    return <svg {...props}><path d="m12 3 1.4 4.3L18 9l-4.6 1.7L12 15l-1.4-4.3L6 9l4.6-1.7L12 3Z"/><path d="m19 15 .7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9L19 15Z"/></svg>;
  }
  return <svg {...props}><path d="M12 3v2M12 19v2M4.2 6.2l1.4 1.4M18.4 17.4l1.4 1.4M3 12h2M19 12h2M4.2 17.8l1.4-1.4M18.4 6.6l1.4-1.4"/><circle cx="12" cy="12" r="4"/></svg>;
}

function Lantern({ prompt, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`clarity-lantern${selected ? " is-selected" : ""}`}
      style={{
        "--lantern-x": `${prompt.x}%`,
        "--lantern-y": `${prompt.y}%`,
        "--lantern-scale": prompt.scale,
        "--lantern-delay": `${prompt.delay}s`,
      }}
      onClick={() => onSelect(prompt.id)}
      aria-pressed={selected}
      aria-label={`Choose ${prompt.label} prompts`}
    >
      <span className="clarity-lantern-glow" aria-hidden="true" />
      <img
        className="clarity-lantern-shape"
        src={`${process.env.PUBLIC_URL}/letters/C/images/premium-paper-lantern.png`}
        alt=""
        aria-hidden="true"
        draggable="false"
      />
      <span className="clarity-lantern-content" aria-hidden="true">
        <Icon name={prompt.icon} size={26} />
        <span className="clarity-lantern-label">{prompt.label}</span>
      </span>
      <span className="clarity-lantern-reflection" aria-hidden="true" />
    </button>
  );
}

function MindMap() {
  const canvasRef = useRef(null);
  const centerRef = useRef(null);
  const gridRef = useRef(null);
  const [connectors, setConnectors] = useState({ width: 1, height: 1, paths: [] });
  const [centralThought, setCentralThought] = useState("My Thoughts");
  const [branches, setBranches] = useState([
    { id: 1, text: "" },
    { id: 2, text: "" },
    { id: 3, text: "" },
    { id: 4, text: "" },
  ]);
  const [expandedThoughts, setExpandedThoughts] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const center = centerRef.current;
    const grid = gridRef.current;
    let frame;
    const measure = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const originX = bounds.left + canvas.clientLeft - canvas.scrollLeft;
      const originY = bounds.top + canvas.clientTop - canvas.scrollTop;
      const centerBounds = center.getBoundingClientRect();
      const cx = centerBounds.left + centerBounds.width / 2 - originX;
      const cy = centerBounds.top + centerBounds.height / 2 - originY;
      const rx = centerBounds.width / 2;
      const ry = centerBounds.height / 2;
      const paths = Array.from(grid.children).map((card) => {
        const rect = card.getBoundingClientRect();
        const isLeft = rect.left + rect.width / 2 < centerBounds.left + rx;
        const endX = (isLeft ? rect.right : rect.left) - originX;
        const endY = rect.top + rect.height / 2 - originY;
        const angle = Math.atan2((endY - cy) / ry, (endX - cx) / rx);
        const startX = cx + Math.cos(angle) * rx;
        const startY = cy + Math.sin(angle) * ry;
        const midX = (startX + endX) / 2;
        return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
      });
      setConnectors({ width: canvas.clientWidth, height: canvas.clientHeight, paths });
    };
    const scheduleMeasure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(scheduleMeasure);
    [canvas, center, grid, ...grid.children].forEach((element) => observer.observe(element));
    window.addEventListener("resize", scheduleMeasure);
    document.addEventListener("fullscreenchange", scheduleMeasure);
    canvas.addEventListener("animationend", scheduleMeasure);
    scheduleMeasure();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleMeasure);
      document.removeEventListener("fullscreenchange", scheduleMeasure);
      canvas.removeEventListener("animationend", scheduleMeasure);
    };
  }, []);

  const updateBranch = (id, text) => {
    setBranches((current) => current.map((branch) => branch.id === id ? { ...branch, text } : branch));
    if (text.length <= 120) {
      setExpandedThoughts((current) => current.filter((thoughtId) => thoughtId !== id));
    }
  };

  const toggleThought = (id) => {
    setExpandedThoughts((current) => current.includes(id)
      ? current.filter((thoughtId) => thoughtId !== id)
      : [...current, id]);
  };

  return (
    <section className="clarity-panel clarity-map-panel" aria-labelledby="mind-map-title">
      <div className="clarity-panel-heading">
        <div>
          <p className="clarity-kicker">Gather what surfaced</p>
          <h2 id="mind-map-title">Map your thoughts</h2>
          <p>Keep each thought short — one idea at a time.</p>
        </div>
      </div>

      <div className="clarity-map-canvas clarity-thought-map" ref={canvasRef}>
        <svg className="clarity-map-connectors" viewBox={`0 0 ${connectors.width} ${connectors.height}`} preserveAspectRatio="none" aria-hidden="true">
          {connectors.paths.map((path, index) => (
            <path key={index} d={path} />
          ))}
        </svg>

        <label className="clarity-center-node" ref={centerRef}>
          <span><Icon name="spark" size={18} /></span>
          <input
            value={centralThought}
            onChange={(event) => setCentralThought(event.target.value)}
            aria-label="Central thought"
            maxLength={42}
          />
        </label>

        <div className="clarity-thought-grid" ref={gridRef}>
          {branches.map((branch, index) => {
            const isLong = branch.text.length > 120;
            const isExpanded = expandedThoughts.includes(branch.id);
            return (
              <article className={`clarity-thought-card${isExpanded ? " is-expanded" : ""}`} key={branch.id}>
                <span className="clarity-thought-icon" aria-hidden="true">{index + 1}</span>
                <label>
                  <span className="sr-only">Thought {index + 1}</span>
                  <textarea
                    value={branch.text}
                    onChange={(event) => updateBranch(branch.id, event.target.value)}
                    placeholder="Capture one short thought…"
                    maxLength={320}
                    rows={2}
                  />
                </label>
                {isLong && (
                  <button type="button" className="clarity-read-more" onClick={() => toggleThought(branch.id)}>
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DurationSelector({ duration, onChange, label = "Reflection duration" }) {
  return (
    <div className="clarity-duration" aria-label={label}>
      {[1, 2, 3].map((minutes) => (
        <button
          type="button"
          key={minutes}
          onClick={() => onChange(minutes)}
          className={duration === minutes ? "is-active" : ""}
          aria-pressed={duration === minutes}
        >
          {minutes} min
        </button>
      ))}
    </div>
  );
}

function ReflectionTimer({ active, duration, sessionKey, prompt, topic, topicIcon, onBack, backgroundSrc }) {
  const totalMs = duration * 60 * 1000;
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const baseElapsedRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setIsRunning(false);
      return;
    }
    baseElapsedRef.current = 0;
    setElapsedMs(0);
    setIsRunning(true);
  }, [active, duration, sessionKey]);

  useEffect(() => {
    if (!active || !isRunning) return undefined;
    const startedAt = performance.now();
    const baseElapsed = baseElapsedRef.current;
    let frame;

    const tick = (now) => {
      const nextElapsed = Math.min(totalMs, baseElapsed + now - startedAt);
      setElapsedMs(nextElapsed);
      if (nextElapsed >= totalMs) {
        baseElapsedRef.current = totalMs;
        setIsRunning(false);
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [active, isRunning, totalMs, sessionKey]);

  const pause = () => {
    baseElapsedRef.current = elapsedMs;
    setIsRunning(false);
  };

  const resume = () => {
    const nextElapsed = elapsedMs >= totalMs ? 0 : elapsedMs;
    baseElapsedRef.current = nextElapsed;
    setElapsedMs(nextElapsed);
    setIsRunning(true);
  };

  const reset = () => {
    baseElapsedRef.current = 0;
    setElapsedMs(0);
    setIsRunning(false);
  };

  const progress = totalMs ? elapsedMs / totalMs : 0;
  const remainingSeconds = Math.max(0, Math.ceil((totalMs - elapsedMs) / 1000));
  const time = `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;
  const journeyPosition = `${10 + progress * 80}%`;
  const isComplete = progress >= 1;

  return (
    <div className="clarity-journey-river" style={{ "--clarity-river": `url(${backgroundSrc})` }}>
      <div className="clarity-river-shade" aria-hidden="true" />
      <div className="clarity-stars" aria-hidden="true" />

      <div className="clarity-journey-topbar">
        <button type="button" className="clarity-step-back" onClick={onBack}>
          <span className="clarity-lanterns-chevron" aria-hidden="true"><Icon name="arrow" size={16} /></span>
          Back to map
        </button>
      </div>

      <header className="clarity-hero-copy clarity-journey-heading">
        <p>Step 03 · Reflect</p>
        <h2>Let your thoughts flow</h2>
        <span>Take a deep breath. Speak your thoughts freely.</span>
      </header>

      <div className="clarity-journey-track" aria-hidden="true">
        <div
          className={`clarity-journey-lantern${isRunning ? " is-moving" : ""}${isComplete ? " is-complete" : ""}`}
          style={{ "--journey-position": journeyPosition }}
        >
          <span className="clarity-journey-glow" />
          <img src={`${process.env.PUBLIC_URL}/letters/C/images/premium-paper-lantern.png`} alt="" draggable="false" />
          <span className="clarity-journey-topic">
            <Icon name={topicIcon} size={22} />
            <span>{topic}</span>
          </span>
          <span className="clarity-journey-reflection" />
        </div>
      </div>

      <section className="clarity-journey-controls" aria-label="Reflection timer controls">
        <div
          className="clarity-journey-time"
          role="progressbar"
          aria-label="Reflection time remaining"
          aria-valuemin={0}
          aria-valuemax={duration * 60}
          aria-valuenow={remainingSeconds}
          aria-valuetext={`${time} remaining`}
        >
          <svg className="clarity-time-ring" viewBox="0 0 64 64" aria-hidden="true">
            <circle className="clarity-time-ring-track" cx="32" cy="32" r="27" />
            <circle
              className="clarity-time-ring-progress"
              cx="32"
              cy="32"
              r="27"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={progress * 100}
            />
            <text className="clarity-time-ring-value" x="32" y="32" dy="0.35em" textAnchor="middle">{time}</text>
          </svg>
        </div>

        <div className="clarity-journey-status">
          <h2>{prompt}</h2>
          {isComplete && <span role="status">Your reflection is complete.</span>}
        </div>

        <div className="clarity-journey-actions">
          <div className="clarity-journey-action-buttons">
            <button type="button" onClick={isRunning ? pause : resume} aria-label={isRunning ? "Pause reflection" : "Resume reflection"}>
              <Icon name={isRunning ? "pause" : "play"} size={20} />
            </button>
            <button type="button" onClick={reset} aria-label="Reset reflection">
              <Icon name="reset" size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function BackgroundMusic() {
  const audioRef = useRef(null);
  const controlsRef = useRef(null);
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.15;
    // Browsers may require a click before allowing background audio.
    audio.play().catch(() => {});
    return () => audio.pause();
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!controlsRef.current.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    setHasError(false);
    audio.play().catch(() => setHasError(true));
  };

  return (
    <div className="clarity-music" ref={controlsRef} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
    }}>
      <audio
        ref={audioRef}
        src={`${process.env.PUBLIC_URL}/letters/C/audio/calm_piano.mp3`}
        loop
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => { setIsPlaying(false); setHasError(true); }}
      />
      <button
        ref={buttonRef}
        type="button"
        className="clarity-music-button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Music controls"
        aria-expanded={isOpen}
        aria-controls="clarity-music-controls"
        title="Music controls"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18V5l12-2v13M9 9l12-2" />
          <ellipse cx="6" cy="18" rx="3" ry="3" />
          <ellipse cx="18" cy="16" rx="3" ry="3" />
        </svg>
      </button>
      <div id="clarity-music-controls" className="clarity-music-panel" role="group" aria-label="Calm piano music" hidden={!isOpen}>
        <div className="clarity-music-controls-row">
          <div>
            <label className="clarity-music-volume" htmlFor="clarity-music-volume">
              <span>Volume</span><span>{volume}%</span>
            </label>
            <input id="clarity-music-volume" type="range" min="0" max="100" step="1" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-valuetext={`${volume}%`} />
          </div>
          <button type="button" className="clarity-music-play" onClick={toggleMusic} aria-label={isPlaying ? "Pause music" : "Play music"}>
            <Icon name={isPlaying ? "pause" : "play"} size={18} />
          </button>
        </div>
        {hasError && <p className="clarity-music-error" role="status">Could not play music. Press play to retry.</p>}
      </div>
    </div>
  );
}

export default function LetterC({ onBack }) {
  const pageRef = useRef(null);
  const shellRef = useRef(null);
  const [selectedId, setSelectedId] = useState("reflect");
  const [promptIndex, setPromptIndex] = useState(() => getRandomPromptIndex(PROMPTS[0].questions));
  const [duration, setDuration] = useState(2);
  const [sessionKey, setSessionKey] = useState(0);
  const [step, setStep] = useState("lanterns");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const selectedPrompt = useMemo(() => PROMPTS.find((prompt) => prompt.id === selectedId), [selectedId]);
  const selectedQuestion = selectedPrompt.questions[promptIndex];
  const backgroundSrc = `${process.env.PUBLIC_URL}/letters/C/images/clarity-river.png`;

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (pageRef.current) pageRef.current.scrollTop = 0;
      if (shellRef.current) shellRef.current.scrollTop = 0;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [step]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement === shellRef.current) {
      document.exitFullscreen?.();
      return;
    }
    shellRef.current?.requestFullscreen?.();
  };

  const selectPromptTopic = (id) => {
    const topic = PROMPTS.find((prompt) => prompt.id === id);
    setPromptIndex((currentIndex) => getRandomPromptIndex(topic.questions, id === selectedId ? currentIndex : -1));
    setSelectedId(id);
  };

  const regeneratePrompt = () => {
    setPromptIndex((currentIndex) => getRandomPromptIndex(selectedPrompt.questions, currentIndex));
  };

  const startReflection = () => {
    setSessionKey((current) => current + 1);
    setStep("journey");
  };

  return (
    <main className="clarity-page" ref={pageRef}>
      <div className="clarity-outer-header">
        <button type="button" className="clarity-back" onClick={onBack}>
          <Icon name="arrow" size={17} />
          Back to Home
        </button>
        <div className="clarity-studio-header">
          <h1>Clarity</h1>
          <p>Choose a lantern, gently organize your thoughts, and speak with clarity.</p>
        </div>
      </div>

      <section className="clarity-experience-shell" ref={shellRef} aria-label="Clarity reflection experience" data-step={step}>
        <BackgroundMusic />
        <button
          type="button"
          className="clarity-fullscreen-button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3v5H3"/><path d="M21 8h-5V3"/><path d="M3 16h5v5"/><path d="M16 21v-5h5"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8V3h5"/><path d="M16 3h5v5"/><path d="M21 16v5h-5"/><path d="M8 21H3v-5"/>
            </svg>
          )}
        </button>

        <section className={`clarity-step clarity-lantern-step${step === "lanterns" ? " is-active" : ""}`} aria-hidden={step !== "lanterns"}>
          <div className="clarity-river" style={{ "--clarity-river": `url(${backgroundSrc})` }}>
            <div className="clarity-river-shade" aria-hidden="true" />
            <div className="clarity-stars" aria-hidden="true" />
            <div className="clarity-distant-lanterns" aria-hidden="true">
              {DISTANT_LANTERNS.map((lantern) => (
                <span
                  className="clarity-distant-lantern"
                  key={`${lantern.x}-${lantern.y}`}
                  style={{
                    "--distant-x": `${lantern.x}%`,
                    "--distant-y": `${lantern.y}%`,
                    "--distant-size": `${lantern.size}px`,
                    "--distant-opacity": lantern.opacity,
                    "--distant-blur": `${lantern.blur}px`,
                    "--distant-delay": `${lantern.delay}s`,
                    "--distant-reflection": `${Math.round(lantern.size * 1.4)}px`,
                  }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/letters/C/images/premium-paper-lantern.png`}
                    alt=""
                    draggable="false"
                  />
                  {lantern.water && <span className="clarity-distant-reflection" />}
                </span>
              ))}
            </div>

            <header className="clarity-hero-copy">
              <p>Step 01 · Choose</p>
              <h2>Pick a lantern to begin</h2>
              <span>Follow whatever draws your attention.</span>
            </header>

            <div className="clarity-lantern-field" aria-label="Reflection prompts">
              {PROMPTS.map((prompt) => (
                <Lantern
                  key={prompt.id}
                  prompt={prompt}
                  selected={prompt.id === selectedId}
                  onSelect={selectPromptTopic}
                />
              ))}
            </div>

            <div className="clarity-prompt-wrap" aria-live="polite">
              <article className="clarity-prompt-card" key={selectedPrompt.id}>
                <button
                  type="button"
                  className="clarity-regenerate-button"
                  onClick={regeneratePrompt}
                  aria-label={`Show another ${selectedPrompt.label} prompt`}
                  title={`Show another ${selectedPrompt.label} prompt`}
                >
                  <Icon name="regenerate" size={20} />
                </button>
                <div className="clarity-prompt-copy">
                  <h3 key={selectedQuestion}>{selectedQuestion}</h3>
                </div>
                <div className="clarity-prompt-actions">
                  <button
                    type="button"
                    className="clarity-continue-button"
                    onClick={() => setStep("planning")}
                    aria-label="Plan this reflection"
                    title="Plan this reflection"
                  >
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          className={`clarity-step clarity-reflection-step clarity-planning-step${step === "planning" ? " is-active" : ""}`}
          aria-hidden={step !== "planning"}
          style={{ "--clarity-river": `url(${backgroundSrc})` }}
        >
          <div className="clarity-reflection-topbar">
            <button type="button" className="clarity-step-back" onClick={() => setStep("lanterns")}>
              <span className="clarity-lanterns-chevron" aria-hidden="true"><Icon name="arrow" size={16} /></span>
              Back to lanterns
            </button>
            <header className="clarity-hero-copy clarity-planning-heading">
              <p>Step 02 · Plan</p>
              <h2>Organize your thoughts</h2>
              <span>Gather your thoughts and choose a gentle pace.</span>
            </header>
          </div>

          <div className="clarity-selected-prompt">
            <div className="clarity-prompt-symbol"><Icon name={selectedPrompt.icon} size={20} /></div>
            <div>
              <h2>{selectedQuestion}</h2>
            </div>
          </div>

          <div className="clarity-workspace" aria-label="Reflection planning workspace">
            <div className="clarity-workspace-grid">
              <MindMap />
              <div className="clarity-planning-controls">
                <div className="clarity-planning-pace">
                  <span>Choose a gentle pace</span>
                  <DurationSelector duration={duration} onChange={setDuration} />
                </div>
                <div
                  className="clarity-plan-clock"
                  style={{ "--duration-sweep": `${(duration / 3) * 360}deg` }}
                  aria-label={`${duration} minute reflection preview`}
                >
                  <Icon name="spark" size={19} />
                  <strong>{String(duration).padStart(2, "0")}:00</strong>
                  <p>Take a breath.<br />Speak your thoughts.</p>
                </div>
                <button type="button" className="clarity-start-reflection" onClick={startReflection}>
                  <Icon name="play" size={18} /> Start speaking
                </button>
                <p className="clarity-planning-privacy">Your voice stays private</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`clarity-step clarity-journey-step${step === "journey" ? " is-active" : ""}`} aria-hidden={step !== "journey"}>
          <ReflectionTimer
            active={step === "journey"}
            duration={duration}
            sessionKey={sessionKey}
            prompt={selectedQuestion}
            topic={selectedPrompt.label}
            topicIcon={selectedPrompt.icon}
            onBack={() => setStep("planning")}
            backgroundSrc={backgroundSrc}
          />
        </section>
      </section>
    </main>
  );
}
