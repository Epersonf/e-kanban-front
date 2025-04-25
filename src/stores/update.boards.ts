import { runInAction } from 'mobx';
import { Board } from '../models/general/board.model';
import { Swimlane } from '../models/general/swimlane.model';
import { BoardsApi } from '../infra/api/boards.api';
import tasksApi from '../infra/api/tasks.api';
import { parseApiDate } from '../utils/parse-api-date.utils';
import type { BoardsStore } from './boards.store'; // Use type import

export async function updateBoardName(store: BoardsStore, id: string, name: string, description?: string): Promise<void> {
  store.error = null;
  try {
    const result = await BoardsApi.updateBoard({ id, name, description });
    runInAction(() => {
      if (result.isSuccess()) {
        const updatedBoardData = result.getValue();
        const boardIndex = store.boards.findIndex(b => b.id === id);
        if (boardIndex !== -1 && updatedBoardData) {
          const existingBoard = store.boards[boardIndex];
          if (!existingBoard) return;
          const updatedBoard = new Board({
            ...existingBoard,
            id: updatedBoardData.id!,
            name: updatedBoardData.name!,
            createdAtUtc: existingBoard.createdAtUtc || parseApiDate(updatedBoardData.createdAtUtc),
            description: updatedBoardData.description || existingBoard.description,
            updatedAtUtc: parseApiDate(updatedBoardData.updatedAtUtc || new Date()),
            members: existingBoard.members,
            swimlanes: existingBoard.swimlanes,
          })
          store.boards = store.boards.map(b => b.id === id ? updatedBoard : b);
        }
      } else {
        store.error = result.getError() || 'Erro ao atualizar board';
      }
    });
  } catch (error: any) {
    runInAction(() => {
      store.error = 'Erro ao atualizar board';
    });
  }
}

export async function deleteBoard(store: BoardsStore, ids: string[]): Promise<void> {
  store.error = null;
  try {
    const result = await BoardsApi.deleteBoard(ids);
    runInAction(() => {
      if (result.isSuccess()) {
        store.boards = store.boards.filter(b => !ids.includes(b.id!)); // Handle multiple IDs if needed
      } else {
        store.error = result.getError() || 'Erro ao deletar board(s)';
      }
    });
  } catch (error: any) {
    runInAction(() => {
      store.error = 'Erro ao deletar board(s)';
    });
  }
}

export async function deleteTask(store: BoardsStore, taskId: string, swimlaneId: string): Promise<void> {
  store.error = null;
  try {
    const result = await tasksApi.deleteTask(taskId);
    runInAction(() => {
      if (result.isSuccess()) {
        store.boards = store.boards.map(board => {
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
      } else {
        store.error = result.getError() || 'Erro ao deletar cartão';
      }
    });
  } catch (error: any) {
    runInAction(() => {
      store.error = 'Erro ao deletar cartão';
    });
  }
}
