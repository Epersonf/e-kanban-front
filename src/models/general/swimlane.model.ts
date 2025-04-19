import { EntityMutable } from "../core/entity-mutable.mode";
import { Task } from "./task.model";

export class Swimlane extends EntityMutable {
  private boardId: string;
  private name: string;
  private order: number;
  private tasks: Task[];

  constructor(params: {
    id: string,
    createdAtUtc: Date,
    updatedAtUtc: Date,
    boardId: string,
    name: string,
    order: number,
    tasks?: Task[],
  }) {
    super(params);
    this.boardId = params.boardId;
    this.name = params.name;
    this.order = params.order;
    this.tasks = params.tasks || [];
  }

  public getBoardId(): string {
    return this.boardId;
  }

  public getName(): string {
    return this.name;
  }

  public getOrder(): number {
    return this.order;
  }

  public getTasks(): Task[] {
    return this.tasks;
  }
}