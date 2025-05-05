import { makeAutoObservable, runInAction } from 'mobx';
import { Board } from '../../models/general/board.model';
import { Task } from '../../models/general/task.model';
import { BoardsApi } from '../../infra/api/boards.api';
import { TasksApi } from '../../infra/api/tasks.api';
import { parseApiDate } from '../../utils/parse-api-date.utils';

export class CreateBoardsStore {
  error: string | null = null;
  boards: Board[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  async createBoard(name: string, description?: string): Promise<Board | null> {
    this.error = null;
    try {
      const result = await BoardsApi.createBoard({ boards: [{ name, description }] });
      runInAction(() => {
        if (result.isError()) {
          this.error = result.getError() || 'Erro ao criar board';
          return;
        }

        const createdBoardResponseArray = result.getValue();
        if (!createdBoardResponseArray && !Array.isArray(createdBoardResponseArray)) {
          this.error = 'Erro ao criar board';
          return;
        }
        const boardDataArray = createdBoardResponseArray?.[0].getBoards();
        if (!boardDataArray && !Array.isArray(boardDataArray)) return;
        const newBoardData = boardDataArray[0];
        const newBoard = new Board({
          id: newBoardData.id!,
          createdAtUtc: parseApiDate(newBoardData.createdAtUtc),
          updatedAtUtc: parseApiDate(newBoardData.updatedAtUtc) || newBoardData.updatedAtUtc,
          name: newBoardData.name!,
          description: newBoardData.description!,
          members: [],
          swimlanes: [],
        })
        this.boards.splice(this.boards.length, 0, newBoard);
        this.boards.push(newBoard);
        return newBoard;
      });
      return null;
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro ao criar board';
      });
      return null;
    }
  }

  async createTask(swimlaneId: string, name: string, order: number, description: string, ownerIds: string[]): Promise<void> {
    this.error = null;
    try {
      const result = await TasksApi.createTask({ swimlaneId, name, description, order, ownerIds });
      runInAction(() => {
        if (result.isError()) {
          this.error = result.getError() || 'Erro ao criar task';
          return;
        }
        const newTaskData = result.getValue();
        if (!newTaskData) {
          this.error = 'Erro ao criar task';
          return;
        }
        const newTaskInstance = new Task({
          id: newTaskData[0].id!,
          createdAtUtc: parseApiDate(newTaskData[0].createdAtUtc),
          updatedAtUtc: parseApiDate(newTaskData[0].updatedAtUtc || newTaskData[0].createdAtUtc),
          swimlaneId: newTaskData[0].swimlaneId,
          name: newTaskData[0].name,
          description: newTaskData[0].description,
        });

        runInAction(() => {
          const board = this.boards.find(b =>
            b.getSwimlanes().some(s => s.id === swimlaneId)
          );
          if (!board) {
            console.error(`Board containing swimlane with ID ${swimlaneId} not found.`);
            this.error = 'Erro interno: Board não encontrado para adicionar o cartão.';
            return;
          }


          const swimlane = board.getSwimlanes().find(s => s.id === swimlaneId);
          if (!swimlane) {
            console.error(`Swimlane with ID ${swimlaneId} not found in board.`);
            this.error = 'Erro interno: Swimlane não encontrada para adicionar o cartão.';
            return;
          }

          swimlane.getTasks().push(newTaskInstance);
          // Opcional: Atualizar updatedAtUtc do swimlane e board se necessário para reatividade em outros lugares
          // swimlane.updatedAtUtc = new Date();
          // board.updatedAtUtc = new Date();
        });

      })
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro ao criar cartão';
      });
    }
  }
}

const createBoardsStore = new CreateBoardsStore();
export const useCreateBoardsStore = () => createBoardsStore;