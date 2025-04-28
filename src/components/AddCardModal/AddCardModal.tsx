// src/components/modals/AddCardModal.tsx
import React, { useState, useEffect } from 'react';

// Importe os componentes comuns (Input, TextArea, Button)
import Button from '../Button/Button';
import Input from '../Input/Input';
import TextArea from '../common/TextArea';

// Importe os styled components que acabamos de criar
import {
  ModalOverlay,
  ModalTitle,
  ActionButtonsContainer
} from './AddCardModal.styles';
import Form from '../Form/Form';

export interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: { title: string; description: string }) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Limpa os campos quando o modal for fechado
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim(); // Verifica descrição também

    if (!trimmedTitle) {
      alert('O título é obrigatório.'); // Melhor feedback
      return;
    }
    if (!trimmedDescription) {
      alert('A descrição é obrigatória.'); // Melhor feedback
      return;
    }

    onAdd({ title: trimmedTitle, description: trimmedDescription });
    // Limpeza já é feita pelo useEffect, mas podemos garantir aqui também se preferir
    // setTitle('');
    // setDescription('');
    onClose(); // Fecha o modal após adicionar
  };

  // Handler para fechar o modal clicando no overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Fecha somente se o clique foi diretamente no overlay (e não no conteúdo)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  if (!isOpen) return null;

  return (
    // Use o ModalOverlay
    <ModalOverlay onClick={handleOverlayClick}>
      {/* Use o AddCardForm estilizado */}
      <Form onSubmit={handleSubmit}>
        {/* Use o ModalTitle */}
        <ModalTitle>Adicionar Novo Cartão</ModalTitle>

        {/* Use os componentes Input e TextArea importados */}
        <Input
          autoFocus
          placeholder="Título do cartão" // Placeholder mais descritivo
          value={title}
          onChange={e => setTitle(e.target.value)}
          required // Adiciona validação HTML básica
        />
        <TextArea
          placeholder="Descrição do cartão" // Placeholder mais descritivo
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4} // Ajuste o número de linhas se necessário
          required // Adiciona validação HTML básica
        />

        {/* Use o ActionButtonsContainer */}
        <ActionButtonsContainer>
          {/* Use o componente Button importado com suas variantes */}
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Adicionar Cartão
          </Button>
        </ActionButtonsContainer>
      </Form>
    </ModalOverlay>
  );
};

export default AddCardModal;