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

  async updateTaskDetails(
    taskId: string,
    name: string,
    description: string | undefined,
    newSwimlaneId: string
  ): Promise<void> {
    this.error = null;
    let originalTaskData: Task | null = null;
    let originalSwimlaneId: string | null = null;
    let originalSwimlane: Swimlane | null = null;
    let targetSwimlane: Swimlane | null = null;
    let taskIndexInOriginalSwimlane = -1;

    // --- Find Task and Swimlanes ---
    runInAction(() => {
      for (const board of this.boards) {
        for (const swimlane of board.swimlanes) {
          const taskIndex = swimlane.tasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            originalTaskData = swimlane.tasks[taskIndex];
            originalSwimlaneId = swimlane.id!;
            originalSwimlane = swimlane;
            taskIndexInOriginalSwimlane = taskIndex;
            // Find the target swimlane within the same board
            targetSwimlane = board.swimlanes.find(s => s.id === newSwimlaneId) || null;
            break; // Task found
          }
        }
        if (originalTaskData) break; // Board containing task found
      }

      if (!originalTaskData || !originalSwimlane || !targetSwimlane) {
        this.error = "Erro ao atualizar task: Task ou swimlane não encontrada.";
        console.error("Update Task Error: Task, original swimlane, or target swimlane not found.", { taskId, originalSwimlaneId, newSwimlaneId });
        return; // Stop execution if essential data is missing
      }

      // --- Optimistic Update ---
      const updatedTask = new Task({
        ...originalTaskData, // Copy existing properties
        id: originalTaskData.id!, // Explicitly pass non-null id
        createdAtUtc: originalTaskData.createdAtUtc!, // Explicitly pass non-null createdAtUtc
        name: name,
        description: description || '', // Ensure description is not undefined
        swimlaneId: newSwimlaneId,
        updatedAtUtc: new Date() // Update timestamp locally
      });

      // If swimlane changed, move the task optimistically
      if (originalSwimlaneId !== newSwimlaneId) {
        originalSwimlane.tasks.splice(taskIndexInOriginalSwimlane, 1);
        targetSwimlane.tasks.push(updatedTask); // Add updated task to new swimlane
      } else {
        // If swimlane is the same, just update the task in place
        originalSwimlane.tasks[taskIndexInOriginalSwimlane] = updatedTask;
      }
    });

    // If optimistic update failed (e.g., task not found earlier)
    if (this.error || !originalTaskData || !originalSwimlane || !targetSwimlane) {
      return;
    }

    // --- API Call ---
    try {
      const result = await TasksApi.updateTask({
        id: taskId,
        name: name,
        description: description, // Pass description directly (allows undefined)
        swimlaneId: newSwimlaneId,
        // order: undefined // We don't know the order here, API should handle or place last
      });

      if (result.isError()) {
        // --- Revert Optimistic Update on API Error ---
        runInAction(() => {
          this.error = result.getError() || "Erro ao atualizar task na API.";
          console.error("API Error, reverting optimistic update:", this.error);

          // Find the task again (it might be in the target swimlane now)
          let taskToRevert: Task | undefined;
          let currentSwimlaneOfTask: Swimlane | undefined;
          let taskIndexInCurrentSwimlane = -1;

          if (originalSwimlaneId !== newSwimlaneId) {
             taskIndexInCurrentSwimlane = targetSwimlane!.tasks.findIndex(t => t.id === taskId);
             if(taskIndexInCurrentSwimlane !== -1) {
                taskToRevert = targetSwimlane!.tasks.splice(taskIndexInCurrentSwimlane, 1)[0];
                currentSwimlaneOfTask = targetSwimlane!;
             }
          } else {
             taskIndexInCurrentSwimlane = originalSwimlane!.tasks.findIndex(t => t.id === taskId);
             if(taskIndexInCurrentSwimlane !== -1) {
                 taskToRevert = originalSwimlane!.tasks[taskIndexInCurrentSwimlane]; // Don't remove yet, just get ref
                 currentSwimlaneOfTask = originalSwimlane!;
             }
          }

          // If we found the task we optimistically updated/moved...
          if (taskToRevert && currentSwimlaneOfTask) {
             // Restore original data
              // Ensure all required fields from originalTaskData are passed explicitly
              const restoredTask = new Task({
                ...originalTaskData!,
                id: originalTaskData!.id!,
                createdAtUtc: originalTaskData!.createdAtUtc!,
                updatedAtUtc: originalTaskData!.updatedAtUtc! // Explicitly pass updatedAtUtc
              });

             // If it was moved, put it back
             if (originalSwimlaneId !== newSwimlaneId) {
                 originalSwimlane!.tasks.splice(taskIndexInOriginalSwimlane, 0, restoredTask);
             } else {
                 // If it wasn't moved, just restore data in place
                 originalSwimlane!.tasks[taskIndexInCurrentSwimlane] = restoredTask;
             }
          } else {
              console.error("Could not find task to revert optimistic update.");
              // Attempt to refetch board data might be needed here in complex cases
          }
        });
      } else {
        // --- API Success ---
        // Potentially update the task data with response from API if needed
        // e.g., update `updatedAtUtc` from server response
        const updatedApiTask = result.getValue();
        if (updatedApiTask) {
          runInAction(() => {
            const taskInStore = targetSwimlane!.tasks.find(t => t.id === taskId);
            if (taskInStore) {
              taskInStore.updatedAtUtc = parseApiDate(updatedApiTask.updatedAtUtc) || new Date();
              // Update other fields if necessary, though they should match the optimistic update
              taskInStore.name = updatedApiTask.name;
              taskInStore.description = updatedApiTask.description;
              taskInStore.swimlaneId = updatedApiTask.swimlaneId;
            }
          });
        }
        console.log(`Task ${taskId} updated successfully.`);
      }
    } catch (error: any) {
      // --- Revert Optimistic Update on Unexpected Error ---
      runInAction(() => {
        this.error = "Erro inesperado ao atualizar task.";
        console.error("Unexpected error, reverting optimistic update:", error);
         // Revert logic (same as API error case)
         let taskToRevert: Task | undefined;
         let currentSwimlaneOfTask: Swimlane | undefined;
         let taskIndexInCurrentSwimlane = -1;

         if (originalSwimlaneId !== newSwimlaneId) {
            taskIndexInCurrentSwimlane = targetSwimlane!.tasks.findIndex(t => t.id === taskId);
            if(taskIndexInCurrentSwimlane !== -1) {
               taskToRevert = targetSwimlane!.tasks.splice(taskIndexInCurrentSwimlane, 1)[0];
               currentSwimlaneOfTask = targetSwimlane!;
            }
         } else {
            taskIndexInCurrentSwimlane = originalSwimlane!.tasks.findIndex(t => t.id === taskId);
            if(taskIndexInCurrentSwimlane !== -1) {
                taskToRevert = originalSwimlane!.tasks[taskIndexInCurrentSwimlane];
                currentSwimlaneOfTask = originalSwimlane!;
            }
         }

         if (taskToRevert && currentSwimlaneOfTask) {
          // Ensure all required fields from originalTaskData are passed explicitly
          const restoredTask = new Task({
            ...originalTaskData!,
            id: originalTaskData!.id!,
            createdAtUtc: originalTaskData!.createdAtUtc!,
            updatedAtUtc: originalTaskData!.updatedAtUtc! // Explicitly pass updatedAtUtc
          });
            if (originalSwimlaneId !== newSwimlaneId) {
                originalSwimlane!.tasks.splice(taskIndexInOriginalSwimlane, 0, restoredTask);
            } else {
                originalSwimlane!.tasks[taskIndexInCurrentSwimlane] = restoredTask;
            }
         } else {
             console.error("Could not find task to revert optimistic update after unexpected error.");
         }
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
