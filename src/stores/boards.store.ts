import { makeAutoObservable, runInAction } from 'mobx';
import { Board } from '../models/general/board.model';
import { Swimlane } from '../models/general/swimlane.model';
import { Task } from '../models/general/task.model';
import { BoardsApi } from '../infra/api/boards.api';
import swimlanesApi from '../infra/api/swimlanes.api';
import tasksApi from '../infra/api/tasks.api';
import { CreateBoardResponse } from '../models/boards/boards-response.model';

export class BoardsStore {
  boards: Board[] = [];
  selectedBoardId: string | null = null;
  loading: boolean = true;
  error: string | null = null;
  pageCount: number = 0;

  constructor() {
    makeAutoObservable(this);
    this.fetchBoards();
  }

  get selectedBoard(): Board | null {
    if (!this.selectedBoardId) return null;
    return this.boards.find(b => b.id === this.selectedBoardId) || null;
  }

  async fetchBoards(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const result = await BoardsApi.getBoards({
        page: 1,
        pageSize: 10,
        populateWithSwimlanes: false,
        populateWithMembers: false,
      });
      runInAction(() => {
        if (result.isSuccess()) {
          this.boards = result.getValue()!.items as Board[];
          this.selectedBoardId = this.boards.length > 0 && this.boards[0].id ? this.boards[0].id : null;
          this.pageCount = result.getValue()!.pageCount;
        } else {
          this.error = result.getError() || 'Erro ao buscar boards';
        }
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro ao buscar boards';
        this.loading = false;
      });
    }
  }

  async createBoard(name: string, description?: string): Promise<void> {
    this.error = null;
    try {
      const result = await BoardsApi.createBoard({ boards: [{ name, description }] });
      runInAction(() => {
        if (result.isSuccess()) {
          const createdBoardData = result.getValue();
          if (createdBoardData && Array.isArray(createdBoardData) && createdBoardData.length > 0) {
            const newBoardResponse = createdBoardData[0];
            if (newBoardResponse && newBoardResponse instanceof CreateBoardResponse && newBoardResponse.getBoards() && Array.isArray(newBoardResponse.getBoards()) && newBoardResponse.getBoards().length > 0) {
              const newBoard = newBoardResponse.getBoards()[0];
              if (newBoard) {
                this.boards.push(newBoard);
                this.selectedBoardId = newBoard.id ?? null;
              }
            }
          }
        } else {
          this.error = result.getError() || 'Erro ao criar board';
        }
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro ao criar board';
      });
    }
  }

  async updateBoardName(id: string, name: string): Promise<void> {
    this.error = null;
    try {
      const result = await BoardsApi.updateBoard({ id, name });
      runInAction(() => {
        if (result.isSuccess()) {
          const updatedBoard = result.getValue();
          const boardIndex = this.boards.findIndex(b => b.id === id);
          if (boardIndex !== -1 && updatedBoard) {
            this.boards[boardIndex] = updatedBoard;
          }
        } else {
          this.error = result.getError() || 'Erro ao atualizar board';
        }
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro ao atualizar board';
      });
    }
  }

  async deleteBoard(id: string): Promise<void> {
    this.error = null;
    try {
      const result = await BoardsApi.deleteBoard(id);
      runInAction(() => {
        if (result.isSuccess()) {
          this.boards = this.boards.filter(b => b.id !== id);
          if (this.selectedBoardId === id) {
            this.selectedBoardId = this.boards.length > 0 && this.boards[0].id ? this.boards[0].id : null;
          }
        } else {
          this.error = result.getError() || 'Erro ao deletar board';
        }
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro ao deletar board';
      });
    }
  }

  selectBoard(id: string | null): void {
    this.selectedBoardId = id;
  }

  async createSwimlane(boardId: string, name: string): Promise<void> {
    this.error = null;
    try {
      const result = await swimlanesApi.createSwimlane({ boardId, name });
     
        if (result.isSuccess()) {
          const newSwimlane = result.getValue();
          if (newSwimlane) { // Check if newSwimlane is not null
            const boardIndex = this.boards.findIndex(b => b.id === boardId);
            if (boardIndex !== -1) {
              const board = this.boards[boardIndex];
              if (board.id && board.createdAtUtc) {
                const updatedSwimlanes = [...board.getSwimlanes(), newSwimlane]; // newSwimlane is guaranteed to be Swimlane here
                this.boards[boardIndex] = new Board({
                  id: board.id,
                  createdAtUtc: board.createdAtUtc,
                updatedAtUtc: new Date(),
                name: board.getName(),
                description: board.getDescription(),
                members: board.getMembers(),
                swimlanes: updatedSwimlanes,
              });
            } else {
              console.error('Cannot add swimlane: Board ID or creation date missing.');
              this.error = 'Erro interno ao adicionar lista (dados do board incompletos)';
            }
          }
        } else {
          this.error = result.getError() || 'Erro ao criar lista';
        }
      }
      
      
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro ao criar lista';
      });
    }
  }

  async updateSwimlaneName(id: string, name: string): Promise<void> {
    this.error = null;
    try {
      const result = await swimlanesApi.updateSwimlane({ id, name });

        if (result.isSuccess()) {
          const updatedSwimlane = result.getValue();
          if (updatedSwimlane) { // Check if updatedSwimlane is not null
            this.boards = this.boards.map(board => {
              const swimlaneIndex = board.getSwimlanes().findIndex(s => s.id === id);
              if (swimlaneIndex !== -1) {
                // Check for updatedSwimlane properties inside the null check
                if (board.id && board.createdAtUtc && updatedSwimlane.id && updatedSwimlane.createdAtUtc) {
                  const updatedSwimlanes = [...board.getSwimlanes()];
                  updatedSwimlanes[swimlaneIndex] = updatedSwimlane; // updatedSwimlane is guaranteed to be Swimlane here
                  return new Board({
                    id: board.id,
                    createdAtUtc: board.createdAtUtc,
                  updatedAtUtc: new Date(),
                  name: board.getName(),
                  description: board.getDescription(),
                  members: board.getMembers(),
                  swimlanes: updatedSwimlanes,
                });
              } else {
                console.error('Cannot update board: missing ID/date on board or updated swimlane.');
                return board;
              }
            }
            return board;
          });
        } else {
          this.error = result.getError() || 'Erro ao atualizar lista';
        }
        }
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro ao atualizar lista';
      });
    }
  }

  async deleteSwimlane(id: string): Promise<void> {
    this.error = null;
    try {
      const result = await swimlanesApi.deleteSwimlane(id);
      runInAction(() => {
        if (result.isSuccess()) {
          this.boards = this.boards.map(board => {
            const initialLength = board.getSwimlanes().length;
            const updatedSwimlanes = board.getSwimlanes().filter((s) => s.id !== id);
            if (updatedSwimlanes.length < initialLength && board.id && board.createdAtUtc) {
              return new Board({
                id: board.id,
                createdAtUtc: board.createdAtUtc,
                updatedAtUtc: new Date(),
                name: board.getName(),
                description: board.getDescription(),
                members: board.getMembers(),
                swimlanes: updatedSwimlanes,
              });
            }
            return board;
          });
        } else {
          this.error = result.getError() || 'Erro ao deletar lista';
        }
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro ao deletar lista';
      });
    }
  }

  async createTask(swimlaneId: string, name: string, description?: string): Promise<void> {
    this.error = null;
    try {
      const result = await tasksApi.createTask({ swimlaneId, name, description });
        if (result.isSuccess()) {
          const newTask = result.getValue();
          if (newTask) { // Check if newTask is not null
            this.boards = this.boards.map(board => {
              let boardNeedsUpdate = false;
              const updatedSwimlanes = board.getSwimlanes().map(swimlane => {
                if (swimlane.id === swimlaneId) {
                  // Check for newTask properties inside the null check
                  if (swimlane.id && swimlane.createdAtUtc && newTask.id && newTask.createdAtUtc) {
                    boardNeedsUpdate = true;
                    const updatedTasks = [...swimlane.getTasks(), newTask]; // newTask is guaranteed to be Task here
                    return new Swimlane({
                      id: swimlane.id,
                      createdAtUtc: swimlane.createdAtUtc,
                    updatedAtUtc: new Date(),
                    boardId: swimlane.getBoardId(),
                    name: swimlane.getName(),
                    order: swimlane.getOrder(),
                    tasks: updatedTasks,
                  });
                } else {
                  console.error('Cannot add task: missing ID/date on swimlane or new task.');
                  return swimlane;
                }
              }
              return swimlane;
            });

            if (boardNeedsUpdate && board.id && board.createdAtUtc) {
              return new Board({
                id: board.id,
                createdAtUtc: board.createdAtUtc,
                updatedAtUtc: new Date(),
                name: board.getName(),
                description: board.getDescription(),
                members: board.getMembers(),
                swimlanes: updatedSwimlanes,
              });
            }
            return board;
          });
        } else {
          this.error = result.getError() || 'Erro ao criar cartão';
        }
      }
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro ao criar cartão';
      });
    }
  }

  async deleteTask(taskId: string, swimlaneId: string): Promise<void> {
    this.error = null;
    try {
      const result = await tasksApi.deleteTask(taskId);
      runInAction(() => {
        if (result.isSuccess()) {
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
                      updatedAtUtc: new Date(),
                      boardId: swimlane.getBoardId(),
                      name: swimlane.getName(),
                      order: swimlane.getOrder(),
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
                updatedAtUtc: new Date(),
                name: board.getName(),
                description: board.getDescription(),
                members: board.getMembers(),
                swimlanes: updatedSwimlanes,
              });
            }
            return board;
          });
        } else {
          this.error = result.getError() || 'Erro ao deletar cartão';
        }
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro ao deletar cartão';
      });
    }
  }

}

const boardsStore = new BoardsStore();
export default boardsStore;
