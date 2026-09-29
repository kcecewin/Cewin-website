import { useState } from "react";
import "./App.css";
import laptopImage from "./assets/laptop.png";
import genlabSymbol from "./assets/genlab-symbol.svg";

function App() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <main className="auth-page">
      <div className="laptop-panel">
        <img
          className="laptop-image"
          src={laptopImage}
          alt="An open graphite laptop illuminated by soft green studio lighting"
        />
        <div className="laptop-caption">
          <p className="laptop-kicker">CREATE. EXPLORE. BUILD.</p>
          <h2>Your next big idea<br />starts here.</h2>
          <p>A space for curious minds and a new generation of creators.</p>
        </div>
      </div>
      <div className="form-panel">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="brand-mark">
          <img src={genlabSymbol} alt="GenLab" />
        </div>
        <p className="eyebrow">The Genz Creators Space</p>
        {isSignup ? (
          <>
            <h1 id="auth-title">Create your account</h1>
            <p className="subtitle">A fresh start is just a few details away.</p>

            <form>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                autoComplete="name"
                placeholder="Enter your name"
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                placeholder="Enter your email"
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                autoComplete="new-password"
                placeholder="Enter your password"
              />

              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                autoComplete="new-password"
                placeholder="Confirm your password"
              />

              <button className="primary-button" type="submit">Sign Up</button>
            </form>

            <div className="form-divider" />

            <p className="switch-prompt">Already have an account?</p>
            <button className="navigation-button" type="button" onClick={() => setIsSignup(false)}>
              Go to Login
            </button>
          </>
        ) : (
          <>
            <h1 id="auth-title">Welcome back</h1>
            <p className="subtitle">Make yourself at home. Login to continue.</p>

            <form>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                placeholder="Enter your email"
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                placeholder="Enter your password"
              />

              <button className="primary-button" type="submit">Login</button>
            </form>

            <div className="form-divider" />

            <p className="switch-prompt">New here? Let’s get you started.</p>
            <button className="navigation-button" type="button" onClick={() => setIsSignup(true)}>
              Create an Account
            </button>

            <details className="about-company">
              <summary>About GenLab</summary>
              <div className="about-content">
                <h2>The Genz Creators Space</h2>
                <p>
                  GenLab is an AI company based in Nagercoil and Bengaluru,
                  bringing together Gen Z creativity and artificial intelligence.
                </p>
                <p>
                  Its work spans AI products, product research, branding,
                  and learning opportunities for students and job seekers.
                </p>
                <ul>
                  <li><strong>Launchpad:</strong> Upskilling and career development.</li>
                  <li><strong>AI Forge:</strong> AI products and solutions.</li>
                  <li><strong>Brand Studio:</strong> Brand identity and creative design.</li>
                </ul>
                <a href="https://genlab.cc/" target="_blank" rel="noopener noreferrer">
                  Visit GenLab’s website <span aria-hidden="true">↗</span>
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </div>
            </details>
          </>
        )}
      </section>
      </div>
    </main>
  );
}

export default App;