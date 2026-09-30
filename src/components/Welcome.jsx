export default function Welcome({ user, onLogout, loading }) {
  const savedName = user.user_metadata?.name;
  const name = typeof savedName === 'string' && savedName.trim() ? savedName.trim() : 'creator';

  return (
    <div className="welcome-content">
      <h1 id="auth-title">Welcome, {name}!</h1>
      <p className="subtitle">You’re signed in to The Genz Creators Space.</p>
      <p className="welcome-email">{user.email}</p>
      <button className="primary-button" type="button" onClick={onLogout} disabled={loading}>
        {loading ? 'Logging out…' : 'Logout'}
      </button>
    </div>
  );
}
