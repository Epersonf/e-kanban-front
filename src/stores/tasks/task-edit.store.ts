import { makeAutoObservable, runInAction } from 'mobx';
import { useBoardsStore } from '../boards/boards.store';
import { TasksApi } from '../../infra/api/tasks.api'; // Import tasksApi
import { useSingleBoardStore } from '../boards/single-board.store'; // Import useSingleBoardStore

// Interface matching the task data needed for editing
interface EditableTaskData {
  id: string;
  name: string;
  description?: string;
  swimlaneId: string;
  ownerIds?: string[];
}

export class TaskEditStore {
  taskId: string | null = null;
  name: string = '';
  description: string = '';
  swimlaneId: string = '';
  ownerIds: string[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  private singleBoardStore = useSingleBoardStore(); // Get instance of SingleBoardStore

  constructor() {
    makeAutoObservable(this);
  }

  // Action to load task data into the store
  loadTask(taskData: EditableTaskData | null | undefined) {
    if (!taskData || !taskData.id) {
      this.reset();
      return;
    }
    runInAction(() => {
      this.taskId = taskData.id;
      this.name = taskData.name;
      this.description = taskData.description || '';
      this.swimlaneId = taskData.swimlaneId;
      this.ownerIds = taskData.ownerIds || [];
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
        this.ownerIds.splice(index, 1);
      } else {
        this.ownerIds.push(ownerId);
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
      const result = await TasksApi.updateTask({
        id: this.taskId, // Pass taskId within the payload
        name: trimmedName,
        description: trimmedDescription || undefined,
        swimlaneId: this.swimlaneId,
        ownerIds: this.ownerIds,
      });

      if (result.isError()) { // Use isError() to check for failure
        throw new Error(result.getError() || 'Unknown error'); // Use getError() and handle null
      }

      // Update the task in the singleBoardStore after successful save
      const updatedTask = result.getValue();
      if (updatedTask) {
        updatedTask.swimlaneId = this.swimlaneId;
        this.singleBoardStore.updateTaskInSelectedBoard(updatedTask);
      }


      runInAction(() => {
        this.isLoading = false;
      });
      this.reset();
      return true;

    } catch (error: any) {
      console.error('Error saving task:', error);
      runInAction(() => {
        this.isLoading = false;
        this.error = (error as Error).message || 'Ocorreu um erro ao salvar a tarefa.'; // Cast error to Error to access message
      });
      return false;
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
