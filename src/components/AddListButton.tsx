import React from 'react';

interface AddListButtonProps {
  onClick: () => void;
}

const AddListButton: React.FC<AddListButtonProps> = ({ onClick }) => (
  <button
    style={{
      background: '#5aac44',
      color: '#fff',
      border: 'none',
      borderRadius: 4,
      padding: '10px 16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: 12
    }}
    onClick={onClick}
  >
    + Adicionar nova lista
  </button>
);

export default AddListButton;
