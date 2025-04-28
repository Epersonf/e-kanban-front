import React from 'react';
import LoggedUserStorage from '../../models/storage/logged_user_storage';
import { useNavigate } from 'react-router-dom';

import {
  MenuWrapper,
  ProfileButton,
  Avatar,
  DropdownMenu,
  DropdownHeader,
  LogoutButton
} from './ProfileMenu.styles';

interface ProfileMenuProps {
  userName: string;
  onLogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ userName, onLogout }) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const logout = () => {
    onLogout(); // Chama a função passada por prop (ex: limpar estado global)
    setOpen(false); // Fecha o menu
    LoggedUserStorage.clear(); // Limpa o storage local
    navigate('/'); // Redireciona para a home/login
  }

  // Fecha o menu se clicar fora dele (melhora UX)
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        // Verifica se o clique foi fora do MenuWrapper
        // (O querySelector pode precisar de um ID ou ref mais específico se MenuWrapper for muito genérico)
      if (open && !(event.target as Element).closest('div[data-profile-menu-wrapper]')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]); // Depende do estado 'open'

  return (
    // Adicionado um atributo de dados para o event listener acima
    <MenuWrapper data-profile-menu-wrapper>
      {/* Botão de Perfil com Avatar e Nome */}
      <ProfileButton onClick={() => setOpen(o => !o)}>
        <Avatar>
           {/* Garante que userName existe e pega a primeira letra */}
          {userName?.[0]?.toUpperCase() ?? '?'}
        </Avatar>
        {userName}
      </ProfileButton>

      {/* Menu Dropdown (condicional) */}
      {open && (
        <DropdownMenu>
          {/* Saudação */}
          <DropdownHeader>
            Olá, <b>{userName}</b>
          </DropdownHeader>
          {/* Botão Sair */}
          <LogoutButton onClick={logout}>
            Sair
          </LogoutButton>
        </DropdownMenu>
      )}
    </MenuWrapper>
  );
};

export default ProfileMenu;