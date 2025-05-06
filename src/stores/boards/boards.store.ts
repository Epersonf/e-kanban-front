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
        if (result.isError()) {
          this.error = result.getError() || 'Error fetching boards';
          return;
        }
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
              ...memberData
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
    const board = this.boards.find(
      b => b.swimlanes.some(s => s.id === sourceSwimlaneId || s.id === destinationSwimlaneId)
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
      // Validar se a task existe no índice esperado
      if (
        sourceIndex < 0 ||
        sourceIndex >= sourceSwimlane.tasks.length ||
        sourceSwimlane.tasks[sourceIndex].id !== taskId
      ) {
        console.error(`Task ${taskId} not found at source index ${sourceIndex} in swimlane ${sourceSwimlaneId}`);
        this.error = "Erro interno ao mover task: Task não encontrada na posição esperada.";
        return;
      }

      // Remover da origem e adicionar ao destino
      movedTask = sourceSwimlane.tasks.splice(sourceIndex, 1)[0];
      destinationSwimlane.tasks.splice(destinationIndex, 0, movedTask);

      // Atualizar o swimlaneId da task movida
      movedTask.swimlaneId = destinationSwimlaneId;
    });

    // Se a atualização otimista falhou (task não encontrada ou outro problema)
    if (!movedTask) {
      return;
    }

    // --- Chamar API ---
    try {
      const result = await TasksApi.updateTask({
        id: taskId,
        swimlaneId: destinationSwimlaneId,
        // Opcional: enviar a nova ordem se a API suportar
        // order: destinationIndex,
      });

      if (result.isError()) {
        // Reverter a atualização otimista em caso de erro na API
        runInAction(() => {
          this.error = result.getError() || "Erro ao atualizar task na API.";
          console.error("API Error, reverting optimistic update:", this.error);
          destinationSwimlane.tasks.splice(destinationIndex, 1);
          sourceSwimlane.tasks.splice(sourceIndex, 0, movedTask!);
          movedTask!.swimlaneId = sourceSwimlaneId;
        });
      } else {
        // Sucesso! O estado já está correto devido à atualização otimista
        console.log(`Task ${taskId} moved successfully to swimlane ${destinationSwimlaneId}`);
      }
    } catch (error: any) {
      // Reverter em caso de erro inesperado (ex.: falha de rede)
      runInAction(() => {
        this.error = "Erro inesperado ao mover task.";
        console.error("Unexpected error, reverting optimistic update:", error);
        destinationSwimlane.tasks.splice(destinationIndex, 1);
        sourceSwimlane.tasks.splice(sourceIndex, 0, movedTask!);
        movedTask!.swimlaneId = sourceSwimlaneId;
      });
    }
  }

  addBoard(board: Board) {
    runInAction(() => {
      this.boards = [...this.boards, board];
    })
  }
}


const boardsStore = new BoardsStore();
export const useBoardsStore = () => boardsStore;
