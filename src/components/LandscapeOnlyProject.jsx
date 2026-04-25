import "./LandscapeOnlyProject.css";

export default function LandscapeOnlyProject({ children, onBack }) {
  return (
    <div className="landscape-only-project">
      <div className="landscape-only-content">{children}</div>
      <div className="rotate-phone-overlay" role="status" aria-live="polite">
        <button className="rotate-back" type="button" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5" />
            <path d="m12 5-7 7 7 7" />
          </svg>
          Back to Home
        </button>

        <div className="rotate-phone-card">
          <div className="rotate-phone-icon" aria-hidden="true">
            <svg viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="34" y="14" width="28" height="52" rx="7" />
              <path d="M45 58h6" />
              <path d="M24 68c10 12 28 16 43 8" />
              <path d="m67 76 1-12 10 7" />
              <path d="M72 28c-7-9-19-14-31-10" />
              <path d="m41 18 8 9-12 2" />
            </svg>
          </div>
          <h1>Rotate your phone</h1>
          <p>This project is designed for landscape fullscreen play.</p>
          <span>Turn your device sideways to continue.</span>
        </div>
      </div>
    </div>
  );
}
