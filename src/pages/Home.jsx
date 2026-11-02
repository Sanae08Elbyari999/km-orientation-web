import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Wrench, BookOpen, Landmark, Building2, ArrowRight, Compass, ListChecks, Heart } from 'lucide-react';
import { programsApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import ProgramCard from '../components/ProgramCard';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const CATEGORIES = [
  { label: 'Écoles', hint: 'ENSA, ENCG, EST...', query: 'type=ecole', icon: Wrench },
  { label: 'Universités', hint: 'Facultés et instituts', query: 'type=universite', icon: BookOpen },
  { label: 'Public', hint: 'Établissements publics', query: 'public=true', icon: Landmark },
  { label: 'Privé', hint: 'Établissements privés', query: 'public=false', icon: Building2 },
];

const STEPS = [
  { icon: Compass, title: '1. Explore', text: 'Parcours les écoles, universités et filières du Maroc au même endroit.' },
  { icon: ListChecks, title: '2. Compare', text: 'Vois les conditions d\'admission, les bacs acceptés et les débouchés.' },
  { icon: Heart, title: '3. Sauvegarde', text: 'Ajoute tes filières préférées à tes favoris pour décider sereinement.' },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['programs', 'home', user?.type_bac],
    queryFn: () => programsApi.list({ bac: user?.type_bac }),
  });

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/search?search=${encodeURIComponent(q)}`);
  };

  const programs = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <>
      <section className="hero">
        <h1>{user ? `Salut ${user.name.split(' ')[0]} 👋` : 'Trouve la filière qui te correspond après le Bac'}</h1>
        <p>Écoles, universités, conditions d'admission et débouchés : toute l'information d'orientation au Maroc, centralisée.</p>

        <form className="hero-form" onSubmit={onSearch}>
          <div className="search-field">
            <Search size={18} />
            <input className="input" placeholder="Ex : génie informatique, médecine, commerce..."
              value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <button className="btn">Rechercher</button>
        </form>

        <div className="hero-tags">
          {['Informatique', 'Médecine', 'Commerce', 'Génie civil'].map((t) => (
            <Link key={t} to={`/search?search=${encodeURIComponent(t)}`}>{t}</Link>
          ))}
        </div>
      </section>

      <div className="stats">
        <div className="stat"><strong>{total}</strong><span>filières</span></div>
        <div className="stat"><strong>12 régions</strong><span>couvertes (en cours)</span></div>
        <div className="stat"><strong>100 %</strong><span>gratuit</span></div>
      </div>

      <h2 className="page-title">Explorer par catégorie</h2>
      <div className="cat-grid">
        {CATEGORIES.map(({ label, hint, query, icon: Icon }) => (
          <Link key={label} to={`/search?${query}`} className="cat">
            <span className="cat-icon"><Icon size={22} /></span>
            <span><strong>{label}</strong><small>{hint}</small></span>
          </Link>
        ))}
      </div>

      <div className="section-head">
        <div>
          <h2>{user?.type_bac ? `Filières ouvertes aux bacheliers ${user.type_bac}` : 'Filières à découvrir'}</h2>
        </div>
        <Link to="/search" className="see-all">Tout voir <ArrowRight size={16} /></Link>
      </div>

      {isLoading ? <Skeleton count={3} /> : programs.length === 0 ? (
        <EmptyState title="Aucune filière pour le moment" text="Reviens bientôt, la base s'enrichit régulièrement." />
      ) : (
        <div className="grid">
          {programs.slice(0, 6).map((p) => <ProgramCard key={p.id} program={p} />)}
        </div>
      )}

      <div className="section-head"><h2>Comment ça marche ?</h2></div>
      <div className="steps">
        {STEPS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="step">
            <span className="cat-icon"><Icon size={22} /></span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </>
  );
}