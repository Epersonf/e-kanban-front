// src/components/TaskModal/TaskModal.tsx
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

// Import common components
import Button from '../Button/Button';
import Input from '../Input/Input';
import TextArea from '../common/TextArea';
import Form from '../Form/Form';

// Import styled components
import {
  ModalOverlay,
  ModalTitle,
  ActionButtonsContainer,
  SelectContainer
} from './TaskModal.styles';

// Import MobX stores
import { useCreateBoardsStore } from '../../stores/boards/create.boards';
import { useBoardsStore } from '../../stores/boards/boards.store'; // Import main boards store

export interface SwimLaneOption {
  id: string;
  name: string;
}

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  swimlanes: SwimLaneOption[];
  defaultSwimlaneId?: string;
  taskToEdit?: {
    id?: string;
    name: string;
    description?: string;
    swimlaneId: string;
  };
}

const TaskModal: React.FC<TaskModalProps> = observer(({ 
  isOpen, 
  onClose, 
  swimlanes, 
  defaultSwimlaneId, 
  taskToEdit 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [swimlaneId, setSwimlaneId] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const createBoardsStore = useCreateBoardsStore();
  const boardsStore = useBoardsStore(); // Get instance of BoardsStore

  // Reset form or populate with task data when modal opens
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    
    if (taskToEdit) {
      setName(taskToEdit.name);
      setDescription(taskToEdit.description || '');
      setSwimlaneId(taskToEdit.swimlaneId);
      setIsEditing(true);
    } else {
      setName('');
      setDescription('');
      setSwimlaneId(defaultSwimlaneId || (swimlanes.length > 0 ? swimlanes[0].id : ''));
      setIsEditing(false);
    }
  }, [isOpen, taskToEdit, defaultSwimlaneId, swimlanes]);

  // Clear form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setSwimlaneId('');
      setIsEditing(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      alert('O nome da tarefa é obrigatório.');
      return;
    }

    if (!swimlaneId) {
      alert('Selecione uma coluna para a tarefa.');
      return;
    }

    try {
        // Call the store to update the task
        await boardsStore.updateTaskDetails(
          taskToEdit?.id!, // Pass the task ID
          trimmedName,
          trimmedDescription || undefined, // Pass description or undefined
          swimlaneId // Pass the selected swimlane ID
        );
      

      onClose(); // Close modal on success
    } catch (error) {
      console.error('Error creating/updating task:', error);
      // Display specific error from the store if available
      const errorToShow = isEditing ? boardsStore.error : createBoardsStore.error;
      alert(errorToShow || 'Ocorreu um erro ao salvar a tarefa.');
    }
  };

  // Handler to close the modal when clicking overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <Form onSubmit={handleSubmit}>
        <ModalTitle>
          {'Editar Tarefa'}
        </ModalTitle>

        <Input
          autoFocus
          placeholder="Nome da tarefa"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <TextArea
          placeholder="Descrição da tarefa"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
        />

        <SelectContainer>
          <label htmlFor="swimlane-select">Coluna:</label>
          <select 
            id="swimlane-select"
            value={swimlaneId}
            onChange={e => setSwimlaneId(e.target.value)}
            required
          >
            <option value="">Selecione uma coluna</option>
            {swimlanes.map(swimlane => (
              <option key={swimlane.id} value={swimlane.id}>
                {swimlane.name}
              </option>
            ))}
          </select>
        </SelectContainer>

        {/* Display error from the relevant store */}
        {(createBoardsStore.error || boardsStore.error) && (
          <div style={{ color: 'red', marginBottom: '8px' }}>
            {isEditing ? boardsStore.error : createBoardsStore.error}
          </div>
        )}

        <ActionButtonsContainer>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Salvar' : 'Adicionar Tarefa'}
          </Button>
        </ActionButtonsContainer>
      </Form>
    </ModalOverlay>
  );
});

export default TaskModal;
