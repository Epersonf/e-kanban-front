import React from 'react';
import { StyledAddButton } from './AddListButton.styles';

export interface AddListButtonProps {
  onClick: () => void;
}

const AddListButton: React.FC<AddListButtonProps> = ({ onClick }) => {
  return (
    <StyledAddButton onClick={onClick} type="button">
      {/* O '+' pode ser um ícone SVG no futuro */}
      + Adicionar nova lista
    </StyledAddButton>
  );
};

export default AddListButton;