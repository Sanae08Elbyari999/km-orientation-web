import { Link } from 'react-router-dom';
import { MapPin, Clock, Trophy } from 'lucide-react';
import Avatar from './Avatar';

export default function ProgramCard({ program }) {
  const inst = program.institution;
  const cond = program.admission_conditions?.[0];

  return (
    <Link to={`/programs/${program.id}`} className="card">
      <div className="pc-top">
        <Avatar name={inst?.nom} />
        <div>
          <div className="pc-title">{program.nom}</div>
          {inst && (
            <div className="pc-sub"><MapPin size={13} /> {inst.nom} · {inst.ville}</div>
          )}
        </div>
      </div>

      <div className="badges">
        {program.niveau && <span className="badge">{program.niveau}</span>}
        {inst && (
          <span className={`badge ${inst.is_public ? 'green' : 'amber'}`}>
            {inst.is_public ? 'Public' : 'Privé'}
          </span>
        )}
        {program.duree && <span className="badge gray"><Clock size={12} /> {program.duree} ans</span>}
        {cond?.concours && <span className="badge amber"><Trophy size={12} /> Concours</span>}
      </div>

      {cond?.bac_types?.length > 0 && (
        <div className="pc-bacs">
          Bac :
          {cond.bac_types.map((b) => <span key={b} className="bac-pill">{b}</span>)}
        </div>
      )}
    </Link>
  );
}