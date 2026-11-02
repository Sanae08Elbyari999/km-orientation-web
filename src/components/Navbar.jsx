import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, Heart, User, LogOut, Search, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const cls = ({ isActive }) => `link ${isActive ? 'active' : ''}`;
  const close = () => setOpen(false);

  const handleLogout = async () => {
    await logout();
    close();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-logo"><GraduationCap size={20} /></span>
          Orientation Bac Maroc
        </Link>

        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" end className={cls} onClick={close}><Home size={16} /> Accueil</NavLink>
          <NavLink to="/search" className={cls} onClick={close}><Search size={16} /> Rechercher</NavLink>
          {user ? (
            <>
              <NavLink to="/favorites" className={cls} onClick={close}><Heart size={16} /> Favoris</NavLink>
              <NavLink to="/profile" className={cls} onClick={close}><User size={16} /> {user.name.split(' ')[0]}</NavLink>
              <button className="btn outline small" onClick={handleLogout}><LogOut size={14} /> Déconnexion</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={cls} onClick={close}>Connexion</NavLink>
              <Link to="/register" className="btn small" onClick={close}>Inscription</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}