import { useState } from "react";
import "./styles.css";

const LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "Diamond",
  "Club",
  "Heart",
  "Spade",
];

const Card = ({ letter }) => (
  <div className="card">
    <h2 className="card-number">{letter}</h2>
    <p className="card-coming-soon">Coming soon...</p>
  </div>
);

const Icon = ({ type }) => {
  const commonProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "message") {
    return (
      <svg {...commonProps}>
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        <path d="M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7" />
      </svg>
    );
  }

  if (type === "book") {
    return (
      <svg {...commonProps}>
        <path d="M16 8.2A2.22 2.22 0 0 0 13.8 6c-.8 0-1.4.3-1.8.9-.4-.6-1-.9-1.8-.9A2.22 2.22 0 0 0 8 8.2c0 .6.3 1.2.7 1.6A226.652 226.652 0 0 0 12 13a404 404 0 0 0 3.3-3.1 2.413 2.413 0 0 0 .7-1.7" />
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      </svg>
    );
  }

  if (type === "hand") {
    return (
      <svg {...commonProps}>
        <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
        <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
        <path d="m2 15 6 6" />
        <path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
};

const SideModal = ({ isOpen, onClose }) => (
  <>
    <div
      className={`modal-overlay ${isOpen ? "open" : ""}`}
      onClick={onClose}
    ></div>
    <aside className={`side-modal ${isOpen ? "open" : ""}`}>
      <button className="modal-close" onClick={onClose} aria-label="Close">
        x
      </button>

      <h2 className="modal-title">Hello There!</h2>
      <p className="modal-subtitle">
        Thanks for checking out my fun little project.
      </p>

      <ModalSection iconClass="section-icon-1" iconType="message" title="About Me">
        My name is Shelvia, a recent PhD grad in AI, focused on generalization
        and trustworthiness. I love reading research papers and enjoy blending
        design with AI to explore creative ideas.
      </ModalSection>

      <ModalSection
        iconClass="section-icon-2"
        iconType="book"
        title="About This Project"
      >
        This project is largely inspired by Alexander Tingstrom's{" "}
        <a href="https://30daysofvibe.com/" className="footer-link">
          30 Days of Vibe
        </a>
        . Each project title is based on a letter of the alphabet, with a few
        bonus projects marked by card suits.
      </ModalSection>

      <ModalSection iconClass="section-icon-3" iconType="hand" title="Resources">
        I will be using various AI assistants, including ChatGPT, Claude, Grok,
        and Gemini. I'll update this section whenever I add new resources.
      </ModalSection>

      <button className="modal-button">
        <span className="section-icon-4">
          <Icon type="globe" />
        </span>
        Let's connect on LinkedIn!
      </button>
    </aside>
  </>
);

const ModalSection = ({ iconClass, iconType, title, children }) => (
  <section className="modal-section">
    <div className="modal-coding">
      <div className={iconClass}>
        <Icon type={iconType} />
      </div>
      <div className="section-content">
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  </section>
);

const Footer = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <footer className="footer">
      <div className="footer-content">
        Copyright 2025{" "}
        <a href="https://shelvia-w.github.io" className="footer-link">
          Shelvia Wongso
        </a>
        . Last updated: {currentDate}
      </div>
    </footer>
  );
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container">
      <div className="gradient-bg"></div>
      <header className="header">
        <div className="logo">
          <img
            src="/img/cute_pet_logo.png"
            alt="A to Z Vibe Coding Logo"
            className="logo-image"
          />
        </div>
        <h1 className="title">A to Z Vibe Coding</h1>
        <p className="subtitle">
          <strong>One Letter, One Project, One Vibe</strong>
        </p>
        <button className="vibe-button" onClick={() => setIsModalOpen(true)}>
          by Shelvia Wongso
        </button>
      </header>

      <main className="grid">
        {LETTERS.map((letter) => (
          <Card key={letter} letter={letter} />
        ))}
      </main>

      <Footer />
      <SideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
