import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FilterChips from '../components/FilterChips';

export const BACS = ['SM', 'PC', 'SVT', 'ECO', 'LETTRES', 'STE', 'STM']
  .map((b) => ({ label: b, value: b }));

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '', ville: '', type_bac: undefined,
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join('\n') : 'Inscription impossible.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-box">
      <h1>Créer un compte</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <input className="input" placeholder="Nom complet" required
          value={form.name} onChange={(e) => set('name')(e.target.value)} />
        <input className="input" type="email" placeholder="Email" required
          value={form.email} onChange={(e) => set('email')(e.target.value)} />
        <input className="input" type="password" placeholder="Mot de passe (6 min.)" required
          value={form.password} onChange={(e) => set('password')(e.target.value)} />
        <input className="input" type="password" placeholder="Confirmer le mot de passe" required
          value={form.password_confirmation}
          onChange={(e) => set('password_confirmation')(e.target.value)} />
        <input className="input" placeholder="Ville"
          value={form.ville} onChange={(e) => set('ville')(e.target.value)} />
        <span className="label">Ton type de bac</span>
        <FilterChips options={BACS} value={form.type_bac} onChange={set('type_bac')} />
        <button className="btn full" disabled={busy}>
          {busy ? 'Création...' : 'Créer mon compte'}
        </button>
      </form>
      <p className="auth-link">Déjà inscrit ? <Link to="/login">Connecte-toi</Link></p>
    </div>
  );
}