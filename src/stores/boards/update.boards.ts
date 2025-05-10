import { makeAutoObservable, runInAction } from 'mobx';
import { Board } from '../../models/general/board.model';
import { Swimlane } from '../../models/general/swimlane.model';
import { BoardsApi } from '../../infra/api/boards.api';
import { TasksApi } from '../../infra/api/tasks.api';
import { parseApiDate } from '../../utils/parse-api-date.utils';
import { UpdateBoardsModel } from '../../models/boards/update-boards.model';

export class UpdateBoardsStore {
  error: string | null = null;
  boards: Board[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  async updateBoard(params: {
    updateBoard: UpdateBoardsModel,
  }): Promise<void> {
    this.error = null;
    const { updateBoard: { id, name, description } } = params;
    try {
      const result = await BoardsApi.updateBoard({ id, name, description });
      runInAction(() => {
        if (result.isError()) {
          this.error = result.getError() || 'Erro ao atualizar board';
          return;
        }
        const updatedBoardData = result.getValue();
        const board = this.boards.find(b => b.id === id);
        if (board && updatedBoardData) {
          board.name = updatedBoardData.name!; // Atualiza propriedade observável
          board.description = updatedBoardData.description; // Atualiza propriedade observável
          board.updatedAtUtc = parseApiDate(updatedBoardData.updatedAtUtc); // Atualiza propriedade observável
        }
      })
    } catch (error: any) {
      runInAction(() => {
        // store.error = 'Erro ao atualizar board';
      });
    }
  }

  async deleteBoard(params: { ids: string[] }): Promise<void> {
    const { ids } = params;
    this.error = null;
    try {
      const result = await BoardsApi.deleteBoard(ids);
      runInAction(() => {
        if (result.isError()) {
          this.error = result.getError() || 'Erro ao deletar board(s)';
          return;
        }
        this.boards = this.boards.filter(b => !ids.includes(b.id!));
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro ao deletar board(s)';
      });
    }
  }

  async deleteTask(params: { taskId: string, swimlaneId: string }): Promise<void> {
    this.error = null;
    const { taskId, swimlaneId } = params;
    try {
      const result = await TasksApi.deleteTask(taskId);
      runInAction(() => {
        if (result.isError()) {
          this.error = result.getError() || 'Erro ao deletar cartão';
          return;
        }
        const board = this.boards.find(b => b.swimlanes.some(s => s.id === swimlaneId));
        if (!board) {
          console.error(`Board containing swimlane with ID ${swimlaneId} not found.`);
          this.error = 'Erro interno: Board não encontrado para deletar o cartão.';
          return;
        }

        const swimlane = board.swimlanes.find(s => s.id === swimlaneId);
        if (!swimlane) {
          console.error(`Swimlane with ID ${swimlaneId} not found in board with ID ${board.id}.`);
          this.error = 'Erro interno: Swimlane nao encontrado para deletar o cartão.';
          return;
        }
        const initialTaskCount = swimlane.getTasks().length;
        swimlane.tasks = swimlane.getTasks().filter(t => t.id !== taskId);
        if (initialTaskCount === swimlane.getTasks().length) {
          this.error = 'Erro ao deletar cartão';
        }
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro ao deletar cartão';
      });
    }
  }
}
const updateBoardsStore = new UpdateBoardsStore();
export const useUpdateBoardsStore = () => updateBoardsStore;
