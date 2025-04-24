import { EntityMutable } from "../core/entity-mutable.mode";
import { Board } from "../general/board.model";

export class CreateBoardResponse extends EntityMutable {
  private boards: Board[];
  
  constructor(params: {
    id: string;
    createdAtUtc: Date;
    updatedAtUtc: Date;
    boards: Board[]
  }) {
    super(params);
    if (!params) return;
    this.boards = params.boards;
  }

  getBoards(): Board[] {
    return this.boards;
  }

  setBoards(boards: Board[]) {
    this.boards = boards;
  }
}