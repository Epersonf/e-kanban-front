import {
  ModalOverlay,
  ModalTitle,
  ActionButtonsContainer,
  SelectContainer
} from './TaskModal.styles';
import { User } from '../../models/general/user.model'; // Import User model

import { useTaskEditStore } from '../../stores/tasks/task-edit.store';
import { StatusMessage } from '../../themes/globals';
import Button from '../Button/Button';
import Form from '../Form/Form';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import Input from '../Input/Input';
import TextArea from '../common/TextArea';

export interface SwimLaneOption {
  id: string;
  name: string;
}



export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  swimlanes: SwimLaneOption[];
  boardMembers: User[]; // Add boardMembers prop
  taskToEdit: { // taskToEdit is now required for this edit-only modal
    id: string; // ID must be a string
    name: string;
    description?: string;
    swimlaneId: string;
    ownerIds?: string[]; // taskToEdit can now have ownerIds
  };
}

const TaskModal: React.FC<TaskModalProps> = observer(({
  isOpen,
  onClose,
  swimlanes,
  boardMembers, // Destructure boardMembers
  taskToEdit // Removed defaultSwimlaneId from destructuring
}) => {
  // Use the new TaskEditStore
  const taskEditStore = useTaskEditStore();

  // Effect to load task data into the store when modal opens or taskToEdit changes
  useEffect(() => {
    if (isOpen && taskToEdit && taskToEdit.id) { // Ensure taskToEdit and its id exist
      // Load the task data into the edit store
      // Type assertion needed if TaskModalProps still allows optional id
      taskEditStore.loadTask(taskToEdit as { id: string; name: string; description?: string; swimlaneId: string; });
    } else if (!isOpen) {
       // Reset the store when the modal closes
      taskEditStore.reset();
    }
    // Dependency array: run when isOpen changes or the task to edit changes
  }, [isOpen, taskToEdit, taskEditStore]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Call the save method from the store
    const success = await taskEditStore.saveTask();
    if (success) {
      onClose(); // Close modal only on successful save
    }
    // Error handling is now done within the store,
    // and the error message will be displayed via the store's error state.
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
          value={taskEditStore.name}
          onChange={e => taskEditStore.updateField('name', e.target.value)}
          required
        />

        <TextArea
          placeholder="Descrição da tarefa"
          value={taskEditStore.description}
          onChange={e => taskEditStore.updateField('description', e.target.value)}
          rows={4}
        />

        <SelectContainer>
          <label htmlFor="swimlane-select">Coluna:</label>
          <select
            id="swimlane-select"
            value={taskEditStore.swimlaneId} // Bind value to store
            onChange={e => taskEditStore.updateField('swimlaneId', e.target.value)} // Update store on change
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

        {/* Member Selection */}
        <div>
          <label>Membros:</label>
          <div>
            {boardMembers.map(member => (
              <div key={member.id}>
                <input
                  type="checkbox"
                  id={`member-${member.id}`}
                  checked={taskEditStore.ownerIds.includes(member.id!.toString())} // Check if member is an owner
                  onChange={() => taskEditStore.toggleOwner(member.id!.toString())} // Toggle owner on change
                />
                <label htmlFor={`member-${member.id}`}>{member.name} {member.surname}</label>
              </div>
            ))}
          </div>
        </div>


        {/* Display error from the task edit store */}
        {taskEditStore.error && (
          <div style={{ color: 'red', marginBottom: '8px' }}>
            {taskEditStore.error}
          </div>
        )}

        <ActionButtonsContainer>
          <Button type="button" variant="secondary" onClick={onClose} disabled={taskEditStore.isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={taskEditStore.isLoading}>
            {taskEditStore.isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </ActionButtonsContainer>
      </Form>
    </ModalOverlay>
  );
});

export default TaskModal;