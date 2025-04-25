import { makeAutoObservable, runInAction } from 'mobx';
import { Board } from '../models/general/board.model';
import { BoardsApi } from '../infra/api/boards.api';

export class SingleBoardStore {
  selectedBoard: Board | null = null;
  loading: boolean = false; // Add loading state if fetching single board becomes necessary
  error: string | null = null; // Add error state

  constructor() {
    makeAutoObservable(this);
  }

  setBoard(board: Board | null): void {
    this.selectedBoard = board;
    // Reset loading/error when setting a new board
    this.loading = false;
    this.error = null;
  }

  // Optional: Add a method to fetch a single board by ID if needed later
  async fetchBoard(ids: string[]): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const result = await BoardsApi.getBoards({
        ids,
        page: 1,
        pageSize: 10,
        populateWithSwimlanes: true,
        populateWithMembers: true
      }); // Assuming a getBoard method exists in BoardsApi
      runInAction(() => {
        if (result.isSuccess()) {
          this.selectedBoard = result.getValue()!.items[0];
        } else {
          this.error = result.getError() || 'Erro ao buscar board';
        }
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Erro ao buscar board';
        this.loading = false;
      });
    }
  }
}

const singleBoardStore = new SingleBoardStore();
export default singleBoardStore;
