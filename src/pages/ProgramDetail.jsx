import { Link, useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Heart, ExternalLink, ClipboardCheck, Briefcase, FileText, Wallet } from 'lucide-react';
import { favoritesApi, programsApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const Row = ({ label, value }) =>
  value ? <div className="row-info"><span>{label}</span><strong>{value}</strong></div> : null;

export default function ProgramDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['program', id, user?.id],
    queryFn: () => programsApi.get(id),
  });

  const toggle = useMutation({
    mutationFn: () => favoritesApi.toggle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['program', id] });
      qc.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  if (isLoading) return <Skeleton count={2} />;
  if (isError) return <EmptyState title="Filière introuvable" text="Cette filière n'existe plus ou a été déplacée."
    action={<Link to="/search" className="btn small">Retour à la recherche</Link>} />;

  const p = data.data;
  const inst = p.institution;
  const onHeart = () => (user ? toggle.mutate() : navigate('/login'));

  return (
    <>
      <Link to="/search" className="back"><ArrowLeft size={16} /> Retour aux résultats</Link>

      <div className="detail-banner">
        <Avatar name={inst.nom} large />
        <div>
          <h1>{p.nom}</h1>
          <div className="sub"><MapPin size={15} /> {inst.nom} · {inst.ville}</div>
        </div>
        <button className={`heart ${data.is_favorite ? 'on' : ''}`} onClick={onHeart} title="Favori">
          <Heart size={20} fill={data.is_favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="detail-layout">
        <div>
          <section className="section">
            <h2><FileText size={20} /> Description</h2>
            <div className="box">{p.description || 'Non renseignée.'}</div>
          </section>

          <section className="section">
            <h2><ClipboardCheck size={20} /> Conditions d'admission</h2>
            {p.admission_conditions.length === 0 && <div className="box">Non renseignées.</div>}
            {p.admission_conditions.map((c) => (
              <div className="box" key={c.id}>
                <div className="badges" style={{ marginTop: 0, marginBottom: 8 }}>
                  {c.bac_types.map((b) => <span key={b} className="badge">Bac {b}</span>)}
                  <span className={`badge ${c.concours ? 'amber' : 'green'}`}>
                    {c.concours ? 'Sur concours' : 'Sur dossier'}
                  </span>
                </div>
                {c.note_min != null && <div>Note minimale : <strong>{c.note_min}/20</strong></div>}
                {c.date_limite && <div>Date limite : <strong>{c.date_limite}</strong></div>}
                {c.details && <div className="muted">{c.details}</div>}
              </div>
            ))}
          </section>

          <section className="section">
            <h2><Briefcase size={20} /> Débouchés</h2>
            {p.careers.length === 0 && <div className="box">Non renseignés.</div>}
            {p.careers.map((c) => (
              <div className="box career" key={c.id}>
                <strong>{c.titre}</strong>
                {c.salaire_moyen && (
                  <span className="salary"><Wallet size={14} className="icon" /> {c.salaire_moyen} MAD/mois</span>
                )}
              </div>
            ))}
          </section>
        </div>

        <aside className="side-card">
          <h3>En résumé</h3>
          <Row label="Niveau" value={p.niveau} />
          <Row label="Durée" value={p.duree ? `${p.duree} ans` : null} />
          <Row label="Langue" value={p.langue} />
          <Row label="Statut" value={inst.is_public ? 'Public' : 'Privé'} />
          <Row label="Type" value={inst.type === 'ecole' ? 'École' : 'Université'} />
          {inst.site_web && (
            <a className="btn full" style={{ marginTop: 14 }} href={inst.site_web} target="_blank" rel="noreferrer">
              Site officiel <ExternalLink size={14} />
            </a>
          )}
        </aside>
      </div>
    </>
  );
}