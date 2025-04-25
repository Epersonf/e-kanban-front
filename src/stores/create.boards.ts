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
          store.boards = store.boards.map(board => {
            let boardNeedsUpdate = false;
            const updatedSwimlanes = board.getSwimlanes().map(swimlane => {
              if (swimlane.id === swimlaneId) {
                if (swimlane.id && swimlane.createdAtUtc && newTaskInstance.id && newTaskInstance.createdAtUtc) {
                  boardNeedsUpdate = true;
                  const updatedTasks = [...swimlane.getTasks(), newTaskInstance];
                  return new Swimlane({
                    id: swimlane.id!,
                    createdAtUtc: swimlane.createdAtUtc,
                    updatedAtUtc: new Date(), // Swimlane updated time
                    boardId: swimlane.boardId!,
                    name: swimlane.name!,
                    order: swimlane.order!,
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
                id: board.id!,
                createdAtUtc: board.createdAtUtc!,
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
