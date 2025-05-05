import { makeAutoObservable, runInAction } from 'mobx';
import { Task } from '../../models/general/task.model';
import { useBoardsStore } from '../boards/boards.store'; // To call the update method

// Interface matching the task data needed for editing
interface EditableTaskData {
  id: string;
  name: string;
  description?: string;
  swimlaneId: string;
  ownerIds?: string[]; // Add ownerIds to the interface
}

export class TaskEditStore {
  taskId: string | null = null;
  name: string = '';
  description: string = '';
  swimlaneId: string = '';
  ownerIds: string[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  // Keep a reference to the main boards store
  private boardsStore = useBoardsStore();

  constructor() {
    // Need MobX > 6 for makeAutoObservable second arg options
    makeAutoObservable(this);
  }

  // Action to load task data into the store
  loadTask(taskData: EditableTaskData | null | undefined) {
    if (!taskData || !taskData.id) {
      this.reset(); // Reset if no valid task data
      return;
    }
    runInAction(() => {
      this.taskId = taskData.id;
      this.name = taskData.name;
      this.description = taskData.description || '';
      this.swimlaneId = taskData.swimlaneId;
      this.ownerIds = taskData.ownerIds || []; // Load ownerIds
      this.isLoading = false;
      this.error = null;
    });
  }

  // Action to update a specific field
  updateField(field: 'name' | 'description' | 'swimlaneId', value: string) {
    runInAction(() => {
      if (field === 'name') this.name = value;
      if (field === 'description') this.description = value;
      if (field === 'swimlaneId') this.swimlaneId = value;
    });
  }

  // Action to add or remove an owner ID
  toggleOwner(ownerId: string) {
    runInAction(() => {
      const index = this.ownerIds.indexOf(ownerId);
      if (index > -1) {
        this.ownerIds.splice(index, 1); // Remove if already exists
      } else {
        this.ownerIds.push(ownerId); // Add if doesn't exist
      }
    });
  }

  // Action to save the changes via the BoardsStore
  async saveTask(): Promise<boolean> {
    if (!this.taskId) {
      this.error = "Erro: ID da tarefa não encontrado.";
      return false;
    }

    const trimmedName = this.name.trim();
    const trimmedDescription = this.description.trim();

    if (!trimmedName) {
      this.error = 'O nome da tarefa é obrigatório.';
      return false;
    }
    if (!this.swimlaneId) {
      this.error = 'Selecione uma coluna para a tarefa.';
      return false;
    }

    runInAction(() => {
      this.isLoading = true;
      this.error = null;
    });

    try {
      await this.boardsStore.updateTaskDetails(
        this.taskId,
        trimmedName,
        trimmedDescription || undefined, // Pass undefined if empty
        this.swimlaneId,
        this.ownerIds // Pass ownerIds to the update method
      );

      // Check for errors from the boardsStore after the attempt
      if (this.boardsStore.error) {
        throw new Error(this.boardsStore.error); // Propagate the error
      }

      runInAction(() => {
        this.isLoading = false;
      });
      this.reset(); // Reset store on successful save
      return true; // Indicate success

    } catch (error: any) {
      console.error('Error saving task:', error);
      runInAction(() => {
        this.isLoading = false;
        // Use error from boardsStore if available, otherwise use generic message
        this.error = this.boardsStore.error || error.message || 'Ocorreu um erro ao salvar a tarefa.';
      });
      return false; // Indicate failure
    }
  }

  // Action to reset the store state
  reset() {
    runInAction(() => {
      this.taskId = null;
      this.name = '';
      this.description = '';
      this.swimlaneId = '';
      this.ownerIds = []; // Reset ownerIds
      this.isLoading = false;
      this.error = null;
      // Also clear error in boardsStore if it was related to this action? Maybe not necessary.
      // this.boardsStore.error = null;
    });
  }
}

const taskEditStore = new TaskEditStore();
// Export a hook to use the store instance
export const useTaskEditStore = () => taskEditStore;
