import React from 'react';
import LoggedUserStorage from '../../models/storage/logged_user_storage';
import { useNavigate } from 'react-router-dom';

interface ProfileMenuProps {
  userName: string;
  onLogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ userName, onLogout }) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const logout = () => {
    onLogout();
    setOpen(false);
    LoggedUserStorage.clear();
    navigate('/');
  }

  return (
    <div style={{ position: 'relative', marginLeft: 'auto' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 'bold', fontSize: 16 }}
      >
        <span style={{ marginRight: 8, background: '#fff', color: '#026aa7', borderRadius: '50%', width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          {userName[0].toUpperCase()}
        </span>
        {userName}
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 40, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0003', minWidth: 160, zIndex: 100 }}>
          <div style={{ padding: 16, borderBottom: '1px solid #eee', color: '#026aa7' }}>
            Olá, <b>{userName}</b>
          </div>
          <button
            onClick={logout}
            style={{ background: 'transparent', border: 'none', color: '#d32f2f', padding: 16, width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '0 0 8px 8px', fontWeight: 'bold' }}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
