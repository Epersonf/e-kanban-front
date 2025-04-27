import { makeAutoObservable, runInAction } from 'mobx';
import { Board } from '../../models/general/board.model';
import { BoardsApi } from '../../infra/api/boards.api';
import { parseApiDate } from '../../utils/parse-api-date.utils';
import { Task } from '../../models/general/task.model';
import { Swimlane } from '../../models/general/swimlane.model';
import { User } from '../../models/general/user.model';
import { TasksApi } from '../../infra/api/tasks.api';


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

  async moveTask(
    taskId: string,
    sourceSwimlaneId: string,
    sourceIndex: number,
    destinationSwimlaneId: string,
    destinationIndex: number
  ): Promise<void> {
    // Encontrar o board que contém as swimlanes
    const board = this.boards.find(b =>
      b.swimlanes.some(s => s.id === sourceSwimlaneId || s.id === destinationSwimlaneId)
    );
    if (!board) {
      console.error("Board not found for swimlanes:", sourceSwimlaneId, destinationSwimlaneId);
      this.error = "Erro ao mover task: Board não encontrado.";
      return;
    }

    const sourceSwimlane = board.swimlanes.find(s => s.id === sourceSwimlaneId);
    const destinationSwimlane = board.swimlanes.find(s => s.id === destinationSwimlaneId);

    if (!sourceSwimlane || !destinationSwimlane) {
      console.error("Source or destination swimlane not found");
      this.error = "Erro ao mover task: Swimlane de origem ou destino não encontrada.";
      return;
    }

    // --- Atualização Otimista ---
    let movedTask: Task | undefined;
    runInAction(() => {
      // Remover da origem
      // Certifique-se que a task existe antes de tentar remover
      if (sourceSwimlane.tasks.length <= sourceIndex || sourceSwimlane.tasks[sourceIndex].id !== taskId) {
        console.error(`Task ${taskId} not found at source index ${sourceIndex} in swimlane ${sourceSwimlaneId}`);
        this.error = "Erro interno ao mover task: Task não encontrada na posição esperada.";
        movedTask = undefined; // Marca que a operação falhou
        return; // Sai do runInAction
      }
      movedTask = sourceSwimlane.tasks.splice(sourceIndex, 1)[0];

      // Adicionar ao destino
      destinationSwimlane.tasks.splice(destinationIndex, 0, movedTask);

      // Atualizar swimlaneId no task movido (importante se mudou de lista)
      movedTask.swimlaneId = destinationSwimlaneId;

      // Opcional: Reordenar localmente se a API não retornar a ordem exata
      // destinationSwimlane.tasks.forEach((task, index) => task.order = index);
      // sourceSwimlane.tasks.forEach((task, index) => task.order = index); // Se a ordem na origem também muda
    });

    // Se a atualização otimista falhou (task não encontrada no índice)
    if (!movedTask) return;

    // --- Chamar API ---
    // Não setar loading/error global aqui para não afetar toda a UI,
    // a menos que seja desejado um feedback global.
    // this.loading = true;
    // this.error = null;
    try {
      // Usar a instância importada tasksApi
      const result = await TasksApi.updateTask({
        id: taskId,
        swimlaneId: destinationSwimlaneId,
        // Opcional: Enviar a nova ordem se a API precisar/suportar
        // order: destinationIndex,
      });

      if (result.isError()) {
        runInAction(() => {
          this.error = result.getError() || 'Erro ao atualizar task na API.';
          console.error("API Error, reverting optimistic update:", this.error);
          // **Reverter Atualização Otimista**
          // 1. Remover do destino
          destinationSwimlane.tasks.splice(destinationIndex, 1);
          // 2. Adicionar de volta à origem
          sourceSwimlane.tasks.splice(sourceIndex, 0, movedTask!);
          // 3. Restaurar swimlaneId original
          movedTask!.swimlaneId = sourceSwimlaneId;
          // 4. Opcional: Restaurar ordem local se foi modificada otimisticamente
        });
      } else {
        // Sucesso! O estado já está (otimisticamente) correto.
        // Se a API retornar o task atualizado com mais dados (ex: updatedAtUtc, nova ordem),
        // você pode atualizar o objeto `movedTask` aqui dentro de um runInAction.
        // Ex: runInAction(() => Object.assign(movedTask, result.getValue()));
        console.log(`Task ${taskId} moved successfully via API to swimlane ${destinationSwimlaneId}`);
      }
      // runInAction(() => { this.loading = false; });

    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro inesperado ao mover task.';
        // this.loading = false;
        console.error("Unexpected Error, reverting optimistic update:", error);
        // **Reverter Atualização Otimista também em caso de exceção**
        destinationSwimlane.tasks.splice(destinationIndex, 1);
        sourceSwimlane.tasks.splice(sourceIndex, 0, movedTask!);
        movedTask!.swimlaneId = sourceSwimlaneId;
        // Opcional: Restaurar ordem local
      });
    }
  }

//   // --- Create Operations ---
//   createBoard(name: string, description?: string): Promise<void> {
//     return createBoardOps.createBoard(this, name, description);
//   }

//   createSwimlane(boardId: string, name: string, order: number): Promise<void> {
//     return createSwimlaneOps.createSwimlane(this, boardId, name, order);
//   }

//   createTask(swimlaneId: string, name: string, description?: string): Promise<void> {
//     // Assuming createTask remains in create.boards.ts for now
//     return createBoardOps.createTask(this, swimlaneId, name, description);
//   }

//   // --- Update/Delete Operations ---
//   updateBoardName(id: string, name: string, description?: string): Promise<void> {
//     return updateBoardOps.updateBoardName(this, id, name, description);
//   }

//   deleteBoard(ids: string[]): Promise<void> {
//     return updateBoardOps.deleteBoard(this, ids);
//   }

//   updateSwimlaneName(id: string, name: string, boardId: string, order: number): Promise<void> {
//     return updateSwimlaneOps.updateSwimlaneName(this, id, name, boardId, order);
//   }

//   deleteSwimlane(id: string): Promise<void> {
//     return updateSwimlaneOps.deleteSwimlane(this, id);
//   }

//   deleteTask(taskId: string, swimlaneId: string): Promise<void> {
//     // Assuming deleteTask remains in update.boards.ts for now
//     return updateBoardOps.deleteTask(this, taskId, swimlaneId);
//   }
}

const boardsStore = new BoardsStore();
export const useBoardsStore = () => boardsStore;
