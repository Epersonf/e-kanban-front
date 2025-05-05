import { makeAutoObservable, runInAction } from 'mobx';
import { Board } from '../../models/general/board.model';
import { Swimlane } from '../../models/general/swimlane.model';
import { BoardsApi } from '../../infra/api/boards.api';
import { TasksApi } from '../../infra/api/tasks.api';
import { parseApiDate } from '../../utils/parse-api-date.utils';

export class UpdateBoardsStore {
  error: string | null = null;
  boards: Board[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  async updateBoard(id: string, name: string, description?: string): Promise<void> {
    // store.error = null;
    try {
      const result = await BoardsApi.updateBoard({ id, name, description });
      runInAction(() => {
        if (result.isError()) {
          // store.error = result.getError() || 'Erro ao atualizar board';
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

  async deleteBoard(ids: string[]): Promise<void> {
    // store.error = null;
    try {
      const result = await BoardsApi.deleteBoard(ids);
      runInAction(() => {
        if (result.isError()) {
          // store.error = result.getError() || 'Erro ao deletar board(s)';
          return;
        }
        this.boards = this.boards.filter(b => !ids.includes(b.id!)); // Handle multiple IDs if needed
      });
    } catch (error: any) {
      runInAction(() => {
        // store.error = 'Erro ao deletar board(s)';
      });
    }
  }

  async deleteTask(taskId: string, swimlaneId: string): Promise<void> {
    // store.error = null;
    try {
      const result = await TasksApi.deleteTask(taskId);
      runInAction(() => {
        if (result.isError()) {
          // store.error = result.getError() || 'Erro ao deletar cartão';
          return;
        }

        this.boards = this.boards.map(board => {
          let boardNeedsUpdate = false;
          const updatedSwimlanes = board.getSwimlanes().map(swimlane => {
            if (swimlane.id === swimlaneId) {
              const initialTaskLength = swimlane.getTasks().length;
              const updatedTasks = swimlane.getTasks().filter((t) => t.id !== taskId);
              if (updatedTasks.length < initialTaskLength) {
                if (swimlane.id && swimlane.createdAtUtc) {
                  boardNeedsUpdate = true;
                  return new Swimlane({
                    id: swimlane.id,
                    createdAtUtc: swimlane.createdAtUtc,
                    updatedAtUtc: new Date(), // Swimlane updated time
                    boardId: swimlane.boardId!,
                    name: swimlane.name!,
                    order: swimlane.order!,
                    tasks: updatedTasks,
                  });
                } else {
                  console.error('Cannot update swimlane after task delete: missing ID/date on swimlane.');
                  return swimlane;
                }
              }
            }
            return swimlane;
          });

          if (boardNeedsUpdate && board.id && board.createdAtUtc) {
            return new Board({
              id: board.id,
              createdAtUtc: board.createdAtUtc,
              updatedAtUtc: new Date(), // Board updated time
              name: board.getName(),
              description: board.getDescription(),
              members: board.getMembers(),
              swimlanes: updatedSwimlanes,
            });
          }
          return board;
        });

      });
    } catch (error: any) {
      runInAction(() => {
        // store.error = 'Erro ao deletar cartão';
      });
    }
  }
}
const updateBoardsStore = new UpdateBoardsStore();
export const useUpdateBoardsStore = () => updateBoardsStore;
