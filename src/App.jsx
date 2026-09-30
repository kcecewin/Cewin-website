import { useEffect, useState } from "react";
import "./App.css";
import { supabase, configurationError } from "./lib/supabase";
import { submitAuth } from "./lib/auth";
import Welcome from "./components/Welcome";
import laptopImage from "./assets/laptop.png";
import genlabSymbol from "./assets/genlab-symbol.svg";

function App() {
  const [isSignup, setIsSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(Boolean(supabase));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let authChanged = false;

    // The listener also handles login, logout, token refresh, and other tabs.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      authChanged = true;
      setUser(session?.user ?? null);
      setCheckingSession(false);
      if (event === 'SIGNED_OUT') {
        setIsSignup(false);
        setMessage(null);
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active || authChanged) return;
      if (error) setMessage({ type: 'error', text: 'Could not restore your session. Please log in again.' });
      setUser(error ? null : data.session?.user ?? null);
      setCheckingSession(false);
    }).catch(() => {
      if (!active || authChanged) return;
      setMessage({ type: 'error', text: 'Could not connect. Check your connection and try logging in.' });
      setCheckingSession(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  function changeForm(signup) {
    setIsSignup(signup);
    setMessage(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading || !supabase) return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    setLoading(true);
    setMessage(null);
    try {
      const data = await submitAuth(supabase, isSignup, fields);
      form.reset();
      if (data.session) {
        setUser(data.session.user);
        setMessage({ type: 'success', text: isSignup ? 'Account created successfully!' : 'Logged in successfully!' });
      } else if (isSignup) {
        setIsSignup(false);
        setMessage({ type: 'success', text: 'Check your inbox for a confirmation link before logging in. If you already have an account, use Login.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    if (loading || !supabase) return;
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsSignup(false);
    } catch {
      setMessage({ type: 'error', text: 'Could not log out. Please try again.' });
    } finally {
      setLoading(false);
    }
  }


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
        {configurationError && <p className="auth-message error" role="alert">{configurationError}</p>}
        {message && <p className={`auth-message ${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>{message.text}</p>}
        {checkingSession ? (
          <h1 id="auth-title" role="status">Checking your session…</h1>
        ) : user ? (
          <Welcome user={user} onLogout={handleLogout} loading={loading} />
        ) : isSignup ? (
          <>
            <h1 id="auth-title">Create your account</h1>
            <p className="subtitle">A fresh start is just a few details away.</p>

            <form key="signup" onSubmit={handleSubmit} aria-busy={loading}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                disabled={loading}
                autoComplete="name"
                placeholder="Enter your name"
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={loading}
                autoComplete="email"
                placeholder="Enter your email"
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                disabled={loading}
                autoComplete="new-password"
                minLength={6}
                placeholder="Enter your password"
              />

              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                required
                disabled={loading}
                autoComplete="new-password"
                minLength={6}
                placeholder="Confirm your password"
              />

              <button className="primary-button" type="submit" disabled={loading || !supabase}>{loading ? "Creating account…" : "Sign Up"}</button>
            </form>

            <div className="form-divider" />

            <p className="switch-prompt">Already have an account?</p>
            <button className="navigation-button" type="button" disabled={loading} onClick={() => changeForm(false)}>
              Go to Login
            </button>
          </>
        ) : (
          <>
            <h1 id="auth-title">Welcome back</h1>
            <p className="subtitle">Make yourself at home. Login to continue.</p>

            <form key="login" onSubmit={handleSubmit} aria-busy={loading}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={loading}
                autoComplete="email"
                placeholder="Enter your email"
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                disabled={loading}
                autoComplete="current-password"
                placeholder="Enter your password"
              />

              <button className="primary-button" type="submit" disabled={loading || !supabase}>{loading ? "Logging in…" : "Login"}</button>
            </form>

            <div className="form-divider" />

            <p className="switch-prompt">New here? Let’s get you started.</p>
            <button className="navigation-button" type="button" disabled={loading} onClick={() => changeForm(true)}>
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