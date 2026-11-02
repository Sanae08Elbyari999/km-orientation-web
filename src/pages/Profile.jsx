import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/services';
import FilterChips from '../components/FilterChips';

const BACS = ['SM', 'PC', 'SVT', 'ECO', 'LETTRES', 'STE', 'STM']
  .map((b) => ({ label: b, value: b }));

export default function Profile() {
  const { user, setUser } = useAuth();
  const [ville, setVille] = useState(user?.ville ?? '');
  const [typeBac, setTypeBac] = useState(user?.type_bac ?? undefined);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const save = async (e) => {
    e.preventDefault();
    try {
      const updated = await authApi.updateProfile({ ville, type_bac: typeBac ?? null });
      setUser(updated);
      setMsg({ type: 'success', text: 'Profil mis à jour.' });
    } catch {
      setMsg({ type: 'error', text: 'Mise à jour impossible.' });
    }
  };

  return (
    <div className="auth-box" style={{ margin: '0 auto' }}>
      <h1>{user?.name}</h1>
      <p className="muted">{user?.email}</p>
      {msg.text && <div className={msg.type}>{msg.text}</div>}
      <form onSubmit={save}>
        <label className="label">Ville</label>
        <input className="input" value={ville} onChange={(e) => setVille(e.target.value)} />
        <span className="label">Type de bac</span>
        <FilterChips options={BACS} value={typeBac} onChange={setTypeBac} />
        <button className="btn full">Enregistrer</button>
      </form>
    </div>
  );
}