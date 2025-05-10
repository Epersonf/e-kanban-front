import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderContainer } from './Header.styles';

const Header: React.FC = () => (
  <HeaderContainer>
    <Link to="/boards">
      Kanban (Trello Style)
    </Link>
  </HeaderContainer>
);

export default Header;
