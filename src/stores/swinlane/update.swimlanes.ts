import { makeAutoObservable, runInAction } from 'mobx';
import { Board } from '../../models/general/board.model';
import { Swimlane } from '../../models/general/swimlane.model';
import { SwimlanesApi } from '../../infra/api/swimlanes.api';
import { parseApiDate } from '../../utils/parse-api-date.utils';
import type { BoardsStore } from '../boards/boards.store';

export class UpdateSwimlanesStore {
  error: string | null = null;
  boards: Board[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  async updateSwimlaneName(id: string, name: string, boardId: string, order: number): Promise<void> {
    // store.error = null;
    try {
      const result = await SwimlanesApi.updateSwimlane({ swimlanes: [{ boardId, name, order, id }] });
      if (result.isError()) {
        runInAction(() => {
          // store.error = result.getError() || 'Erro ao atualizar lista';
        });
        return;
      }
      const updatedSwimlaneDataArray = result.getValue();
      if (!updatedSwimlaneDataArray) return;
      const updatedSwimlaneData = updatedSwimlaneDataArray[0];
      runInAction(() => {
        this.boards = this.boards.map(board => {
          if (board.id !== boardId) return board;

          const originalSwimlanes = board.swimlanes;
          const swimlaneIndex = board.getSwimlanes().findIndex(s => s.id === id);

          if (swimlaneIndex !== -1) {
            if (board.id && board.createdAtUtc && updatedSwimlaneData?.id && updatedSwimlaneData?.createdAtUtc) {
              const existingSwimlane = originalSwimlanes[swimlaneIndex];
              const updatedSwimlaneInstance = new Swimlane({
                id: updatedSwimlaneData.id!,
                createdAtUtc: parseApiDate(updatedSwimlaneData.createdAtUtc),
                updatedAtUtc: parseApiDate(updatedSwimlaneData.updatedAtUtc || new Date()),
                boardId: updatedSwimlaneData.boardId || boardId,
                name: updatedSwimlaneData.name || name,
                order: updatedSwimlaneData.order ?? order,
                tasks: existingSwimlane.getTasks(),
              });
              const newSwimlanesArray = [...originalSwimlanes];
              newSwimlanesArray[swimlaneIndex] = updatedSwimlaneInstance;
              return new Board({
                id: board.id,
                createdAtUtc: board.createdAtUtc,
                updatedAtUtc: new Date(),
                name: board.getName(),
                description: board.getDescription(),
                members: board.getMembers(),
                swimlanes: newSwimlanesArray,
              });
            } else {
              console.error('Cannot update swimlane: missing ID/date on board or updated swimlane.');
              return board;
            }
          }
          return board;
        });
      })
    } catch (error: any) {
      runInAction(() => {
        // store.error = 'Erro ao atualizar lista';
      });
    }
  }

  async deleteSwimlane(id: string): Promise<void> {
    // store.error = null;
    try {
      const result = await SwimlanesApi.deleteSwimlane(id);
      runInAction(() => {
        if (result.isError()) {
          // store.error = result.getError() || 'Erro ao deletar lista';
          return;
        }

        this.boards = this.boards.map(board => {
          const originalSwimlanes = board.swimlanes;
          const updatedSwimlanes = board.getSwimlanes().filter((s) => s.id !== id);
          if (updatedSwimlanes.length < originalSwimlanes.length && board.id && board.createdAtUtc) {
            return new Board({
              id: board.id!,
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

      });
    } catch (error: any) {
      runInAction(() => {
        // store.error = 'Erro ao deletar lista';
      });
    }
  }
}

const updateSwimlanesStore = new UpdateSwimlanesStore();
export const useUpdateSwimlanesStore = () => updateSwimlanesStore;
