import React, { useState, Suspense } from "react";
import "./styles.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const letters = [
  { id: "A", title: "Coming soon...", active: false },
  { id: "B", title: "Coming soon...", active: false },
  { id: "C", title: "Card Melody", description: "A digital card that sings from the heart 🎵.",
    active: true},
  { id: "D", title: "Coming soon...", active: false },
  { id: "E", title: "Coming soon...", active: false },
  { id: "F", title: "Coming soon...", active: false },
  { id: "G", title: "Coming soon...", active: false },
  { id: "H", title: "Coming soon...", active: false },
  { id: "I", title: "Coming soon...", active: false },
  { id: "J", title: "Coming soon...", active: false },
  { id: "K", title: "Coming soon...", active: false },
  { id: "L", title: "Coming soon...", active: false },
  { id: "M", title: "Coming soon...", active: false },
  { id: "N", title: "Coming soon...", active: false },
  { id: "O", title: "Coming soon...", active: false },
  { id: "P", title: "Coming soon...", active: false },
  { id: "Q", title: "Coming soon...", active: false },
  { id: "R", title: "Coming soon...", active: false },
  { id: "S", title: "Coming soon...", active: false },
  { id: "T", title: "Coming soon...", active: false },
  { id: "U", title: "Coming soon...", active: false },
  { id: "V", title: "Coming soon...", active: false },
  { id: "W", title: "Coming soon...", active: false },
  { id: "X", title: "Coming soon...", active: false },
  { id: "Y", title: "Coming soon...", active: false },
  { id: "Z", title: "Coming soon...", active: false },
  { id: "♦", title: "Coming soon...", active: false },
  { id: "♣", title: "Coming soon...", active: false },
  { id: "♥", title: "Coming soon...", active: false },
  { id: "♠", title: "Coming soon...", active: false },
];

// Lazy load the C component
const C = React.lazy(() => import('./pages/C'));

const Card = ({ letter }) => {
  if (letter.active) {
    return (
      <Link to={`/${letter.id}`} style={{ textDecoration: 'none' }}>
        <div className={`card ${letter.active ? "active" : ""}`}>
          <h2 className="card-number">{letter.id}</h2>
          <h3 className="card-title">{letter.title}</h3>
          <p className="card-description">{letter.description}</p>
        </div>
      </Link>
    );
  } else {
    return (
      <div className="card">
        <h2 className="card-number">{letter.id}</h2>
        <p className="card-coming-soon">Coming soon...</p>
      </div>
    );
  }
};

const SideModal = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`modal-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>
      <div className={`side-modal ${isOpen ? "open" : ""}`}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">Hello There!</h2>
        <p className="modal-subtitle">
          Thanks for checking out my fun little project.
        </p>

        <div className="modal-section">
          <div className="modal-coding">
            <div className="section-icon-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-message-circle-heart-icon lucide-message-circle-heart"
              >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                <path d="M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7" />
              </svg>
            </div>
            <div className="section-content">
              <h3>About Me</h3>
              <p>
                My name is Shelvia, a recent PhD grad in AI, focused on
                generalization and trustworthiness. I love reading research
                papers and enjoy blending design with AI to explore creative
                ideas.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-coding">
            <div className="section-icon-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-book-heart-icon lucide-book-heart"
              >
                <path d="M16 8.2A2.22 2.22 0 0 0 13.8 6c-.8 0-1.4.3-1.8.9-.4-.6-1-.9-1.8-.9A2.22 2.22 0 0 0 8 8.2c0 .6.3 1.2.7 1.6A226.652 226.652 0 0 0 12 13a404 404 0 0 0 3.3-3.1 2.413 2.413 0 0 0 .7-1.7" />
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
              </svg>
            </div>
            <div className="section-content">
              <h3>About This Project</h3>
              <p>
                This project is largely inspired by Alexander Tingström's{" "}
                <a href="https://30daysofvibe.com/" className="footer-link">
                  30 Days of Vibe
                </a>
                . Be sure to check out his amazing work! I decided to take a
                slightly different approach: each project title is based on a
                letter of the alphabet (I might start from a random letter). At
                the end, I'm planning to include 4 bonus projects (marked with
                card suit icons), which will be a bit more challenging than the
                others. These projects will be largely vibe coded by me. I hope
                you'll enjoy them as much as I do!
              </p>
            </div>
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-coding">
            <div className="section-icon-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-hand-heart-icon lucide-hand-heart"
              >
                <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
                <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
                <path d="m2 15 6 6" />
                <path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z" />
              </svg>
            </div>
            <div className="section-content">
              <h3>Resources</h3>
              <p>
                I will be using various AI assistants, including ChatGPT,
                Claude, Grok and Gemini. I'll be updating this section whenever
                I add new resources.
              </p>
            </div>
          </div>
        </div>

        <button className="modal-button">
          <div className="section-icon-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-globe-icon lucide-globe"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          Let's connect on LinkedIn! 😊
        </button>
      </div>
    </>
  );
};

const Footer = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="copyright">
          © Copyright 2025{" "}
          <a href="https://shelvia-w.github.io" className="footer-link">
            Shelvia Wongso
          </a>
          . Last updated: {currentDate}
        </div>
      </div>
    </footer>
  );
};

const HomePage = ({ isModalOpen, openModal, closeModal }) => {
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
          <strong> ❤️ One Letter, One Project, One Vibe ❤️ </strong>
        </p>
        <button className="vibe-button" onClick={openModal}>
          by Shelvia Wongso
        </button>
      </header>

      <div className="grid">
        {letters.map((letter) => (
          <Card key={letter.id} letter={letter} />
        ))}
      </div>

      <Footer />
      <SideModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              isModalOpen={isModalOpen}
              openModal={openModal}
              closeModal={closeModal}
            />
          } 
        />
        <Route 
          path="/C" 
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <C />
            </Suspense>
          } 
        />
      </Routes>
    </Router>
  );
}
