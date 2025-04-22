import React from 'react';
import Button from './Button';

interface DeleteCardButtonProps {
  onClick: () => void;
}

const DeleteCardButton: React.FC<DeleteCardButtonProps> = ({ onClick }) => (
  <Button
    onClick={e => {
      e.stopPropagation();
      onClick();
    }}
    variant="secondary"
    style={{ color: '#d32f2f', background: '#fff', border: '1px solid #d32f2f', marginLeft: 8 }}
    title="Excluir cartão"
  >
    🗑
  </Button>
);

export default DeleteCardButton;
