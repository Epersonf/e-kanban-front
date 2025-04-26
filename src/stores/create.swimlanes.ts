  import { runInAction } from 'mobx';
  import { Board } from '../models/general/board.model';
  import { Swimlane } from '../models/general/swimlane.model';
  import { SwimlanesApi } from '../infra/api/swimlanes.api';
  import { parseApiDate } from '../utils/parse-api-date.utils';
  import type { BoardsStore } from './boards.store'; // Use type import

  export async function createSwimlane(store: BoardsStore, boardId: string, name: string, order: number): Promise<void> {
    store.error = null;
    try {
      const result = await SwimlanesApi.createSwimlane({ swimlanes: [{ boardId, name, order }] });
      if (result.isError()) {
        runInAction(() => {
          store.error = result.getError() || 'Erro ao criar lista';
        });
        return;
      }
      const newSwimlaneDataArray = result.getValue();
      if (!newSwimlaneDataArray) return;
      const newSwimlaneData = newSwimlaneDataArray?.[0];

      runInAction(() => {
        const boardIndex = store.boards.findIndex(b => b.id === boardId);
        if (boardIndex !== -1) {
          const targetBoard = store.boards[boardIndex];

          if (targetBoard.id && targetBoard.createdAtUtc && newSwimlaneData?.id && newSwimlaneData?.createdAtUtc) {
            const newSwimlaneInstance = new Swimlane({
              id: newSwimlaneData.id!,
              createdAtUtc: parseApiDate(newSwimlaneData.createdAtUtc),
              updatedAtUtc: parseApiDate(newSwimlaneData.updatedAtUtc || newSwimlaneData.createdAtUtc), // Use createdAt if updatedAt is null
              boardId: newSwimlaneData.boardId || boardId,
              name: newSwimlaneData.name || name,
              order: newSwimlaneData.order ?? order,
              tasks: newSwimlaneData.getTasks() || []
            });
            const currentSwimlanes = targetBoard?.getSwimlanes();
            if (!Array.isArray(currentSwimlanes)) {
              console.error(`Erro Interno: targetBoard.getSwimlanes() para board ${targetBoard.id} não retornou um array! Valor:`, currentSwimlanes);
              store.error = 'Erro interno ao processar as listas do quadro.';
              return;
            }
            const updatedSwimlanes = [...currentSwimlanes, newSwimlaneInstance];

            const updatedBoard = new Board({
              id: targetBoard.id!,
              createdAtUtc: targetBoard.createdAtUtc,
              updatedAtUtc: new Date(), // Board updated time
              name: targetBoard.name,
              description: targetBoard.description,
              members: targetBoard.members,
              swimlanes: updatedSwimlanes
            });
            store.boards = store.boards.map((board, index) =>
              index === boardIndex ? updatedBoard : board
            );
          } else {
            console.error('Cannot add swimlane: Board ID/date or Swimlane ID/date missing.');
            store.error = 'Erro interno ao adicionar lista (dados incompletos)';
          }
        }
      });
    } catch (error: any) {
      runInAction(() => {
        store.error = 'Erro ao criar lista';
      });
    }
  }
