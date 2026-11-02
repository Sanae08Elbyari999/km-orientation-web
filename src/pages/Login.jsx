import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Connexion impossible.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-box">
      <h1>Connexion</h1>
      <p className="muted">Trouve la filière qui te correspond</p>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <input className="input" type="email" placeholder="Email" required
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Mot de passe" required
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn full" disabled={busy}>
          {busy ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      <p className="auth-link">Pas de compte ? <Link to="/register">Inscris-toi</Link></p>
    </div>
  );
}