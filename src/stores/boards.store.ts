import { makeAutoObservable, runInAction } from 'mobx';
import { Board } from '../models/general/board.model';
import { Swimlane } from '../models/general/swimlane.model';
import { Task } from '../models/general/task.model';
import { BoardsApi } from '../infra/api/boards.api';
import { parseApiDate } from '../utils/parse-api-date.utils';
import { User } from '../models/general/user.model';
import * as createBoardOps from './create.boards';
import * as updateBoardOps from './update.boards';
import * as createSwimlaneOps from './create.swimlanes';
import * as updateSwimlaneOps from './update.swimlanes';

export class BoardsStore {
  boards: Board[] = [];
  loading: boolean = true;
  error: string | null = null;
  pageCount: number = 0;

  constructor() {
    makeAutoObservable(this);
    this.fetchBoards();
  }

  async fetchBoards(params?: {
    ids?: string[];
    page?: number;
    pageSize?: number;
    populateWithSwimlanes?: boolean;
    populateWithMembers?: boolean;
  }): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const result = await BoardsApi.getBoards({
        page: 1,
        pageSize: 10,
        populateWithSwimlanes: true,
        populateWithMembers: true,
      });
      runInAction(() => {
        if (result.isSuccess()) {
          const apiData = result.getValue();
          if (apiData && Array.isArray(apiData.items)) {
            this.boards = apiData.items.map(boardData => {
              const swimlanes = (boardData?.swimlanes || []).map(swimlaneData => {
                const tasks = (swimlaneData.tasks || []).map(taskData => new Task({
                  id: taskData.id!,
                  createdAtUtc: parseApiDate(taskData.createdAtUtc),
                  updatedAtUtc: parseApiDate(taskData.updatedAtUtc) || taskData.updatedAtUtc,
                  swimlaneId: taskData.id!,
                  name: taskData.name!,
                  description: taskData.description!,
                }));
                return new Swimlane({
                  id: swimlaneData.id!,
                  createdAtUtc: parseApiDate(swimlaneData.createdAtUtc),
                  updatedAtUtc: parseApiDate(swimlaneData.updatedAtUtc) || swimlaneData.updatedAtUtc,
                  boardId: swimlaneData.boardId!,
                  name: swimlaneData.name!,
                  order: swimlaneData.order ?? 0,
                  tasks,
                });
              });
              const members = (boardData?.getMembers() || []).map(memberData => new User({
                id: memberData.id!,
                createdAtUtc: parseApiDate(memberData.createdAtUtc),
                updatedAtUtc: parseApiDate(memberData.updatedAtUtc) || memberData.updatedAtUtc,
                name: memberData.name!,
                surname: memberData.surname!,
                email: memberData.email!,
              }));
              return new Board({
                id: boardData?.id!,
                createdAtUtc: parseApiDate(boardData?.createdAtUtc),
                updatedAtUtc: parseApiDate(boardData?.updatedAtUtc) || boardData?.updatedAtUtc,
                name: boardData?.getName() || '',
                description: boardData?.getDescription(),
                members,
                swimlanes,
              })
            })
          }
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

  // Em boards.store.ts (ou update.tasks.ts / move.tasks.ts)
async moveTask(
  taskId: string,
  sourceListId: string,
  sourceIndex: number,
  destinationListId: string,
  destinationIndex: number
): Promise<void> {
  // 1. Atualização Otimista (Opcional, mas melhora UX):
  //    - Mova o task no estado *antes* da chamada da API (dentro de runInAction).
  //    - Reordene os arrays `tasks` nas swimlanes afetadas.
  //
  // 2. Chamar API:
  //    - Você precisará de um endpoint na API (ex: PATCH /tasks/{taskId}/move)
  //      que receba o novo `swimlaneId` e a nova `order` (ou índice).
  //    - Chame `tasksApi.moveTask(...)` (crie este método).
  //
  // 3. Lidar com Resposta/Erro:
  //    - Se a API falhar, reverta a atualização otimista (mais complexo).
  //    - Se a API suceder e retornar dados atualizados (ex: novas ordens),
  //      atualize o estado com os dados da API (se diferente da otimista).
}

  // --- Create Operations ---
  createBoard(name: string, description?: string): Promise<void> {
    return createBoardOps.createBoard(this, name, description);
  }

  createSwimlane(boardId: string, name: string, order: number): Promise<void> {
    return createSwimlaneOps.createSwimlane(this, boardId, name, order);
  }

  createTask(swimlaneId: string, name: string, description?: string): Promise<void> {
    // Assuming createTask remains in create.boards.ts for now
    return createBoardOps.createTask(this, swimlaneId, name, description);
  }

  // --- Update/Delete Operations ---
  updateBoardName(id: string, name: string, description?: string): Promise<void> {
    return updateBoardOps.updateBoardName(this, id, name, description);
  }

  deleteBoard(ids: string[]): Promise<void> {
    return updateBoardOps.deleteBoard(this, ids);
  }

  updateSwimlaneName(id: string, name: string, boardId: string, order: number): Promise<void> {
    return updateSwimlaneOps.updateSwimlaneName(this, id, name, boardId, order);
  }

  deleteSwimlane(id: string): Promise<void> {
    return updateSwimlaneOps.deleteSwimlane(this, id);
  }

  deleteTask(taskId: string, swimlaneId: string): Promise<void> {
    // Assuming deleteTask remains in update.boards.ts for now
    return updateBoardOps.deleteTask(this, taskId, swimlaneId);
  }
}

const boardsStore = new BoardsStore();
export default boardsStore;
