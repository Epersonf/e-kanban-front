import React, { useState } from 'react';
import Form from './common/Form';
import Button from './common/Button';
import Input from './common/Input';
import TextArea from './common/TextArea';

export interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: { title: string; description: string }) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, description });
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0006', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
      <Form onSubmit={handleSubmit}>
        <h2>Adicionar Cartão</h2>
        <Input
          autoFocus
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <TextArea
          placeholder="Descrição"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary">Adicionar</Button>
        </div>
      </Form>
    </div>
  );
};

export default AddCardModal;
