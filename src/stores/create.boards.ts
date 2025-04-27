import { runInAction } from 'mobx';
import { Board } from '../models/general/board.model';
import { Swimlane } from '../models/general/swimlane.model';
import { Task } from '../models/general/task.model';
import { BoardsApi } from '../infra/api/boards.api';
import tasksApi from '../infra/api/tasks.api';
import { parseApiDate } from '../utils/parse-api-date.utils';
import type { BoardsStore } from './boards.store'; // Use type import

export async function createBoard(store: BoardsStore, name: string, description?: string): Promise<void> {
  store.error = null;
  try {
    const result = await BoardsApi.createBoard({ boards: [{ name, description }] });
    runInAction(() => {
      if (result.isSuccess()) {
        const createdBoardResponseArray = result.getValue();
        if (createdBoardResponseArray && Array.isArray(createdBoardResponseArray) && createdBoardResponseArray.length > 0) {
          const boardDataArray = createdBoardResponseArray[0].getBoards();
          if (boardDataArray && Array.isArray(boardDataArray) && boardDataArray.length > 0) {
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
            store.boards.splice(store.boards.length, 0, newBoard); // Use splice for potentially better reactivity
          }
        }
      } else {
        store.error = result.getError() || 'Erro ao criar board';
      }
    });
  } catch (error: any) {
    runInAction(() => {
      store.error = 'Erro ao criar board';
    });
  }
}

export async function createTask(store: BoardsStore, swimlaneId: string, name: string, description?: string): Promise<void> {
  store.error = null;
  try {
    const result = await tasksApi.createTask({ swimlaneId, name, description });
    if (result.isSuccess()) {
      const newTaskData = result.getValue();
      if (newTaskData) {
        const newTaskInstance = new Task({
          id: newTaskData.id!,
          createdAtUtc: parseApiDate(newTaskData.createdAtUtc),
          updatedAtUtc: parseApiDate(newTaskData.updatedAtUtc || newTaskData.createdAtUtc), // Use createdAt if updatedAt is null
          swimlaneId: newTaskData.swimlaneId,
          name: newTaskData.name,
          description: newTaskData.description,
        });

        runInAction(() => {
          const board = store.boards.find(b =>
            b.getSwimlanes().some(s => s.id === swimlaneId)
          );

          if (board) {
            const swimlane = board.getSwimlanes().find(s => s.id === swimlaneId);
            if (swimlane) {
              swimlane.getTasks().push(newTaskInstance);
              // Opcional: Atualizar updatedAtUtc do swimlane e board se necessário para reatividade em outros lugares
              // swimlane.updatedAtUtc = new Date();
              // board.updatedAtUtc = new Date();
            } else {
              console.error(`Swimlane with ID ${swimlaneId} not found in board.`);
              store.error = 'Erro interno: Swimlane não encontrada para adicionar o cartão.';
            }
          } else {
            console.error(`Board containing swimlane with ID ${swimlaneId} not found.`);
            store.error = 'Erro interno: Board não encontrado para adicionar o cartão.';
          }
        });
      }
    } else {
      runInAction(() => {
        store.error = result.getError() || 'Erro ao criar cartão';
      });
    }
  } catch (error: any) {
    runInAction(() => {
      store.error = 'Erro ao criar cartão';
    });
  }
}
