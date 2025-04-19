import { EntityMutable } from "../core/entity-mutable.mode";

export class Task extends EntityMutable {
  private swimlaneId: string;
  private name: string;
  private description?: string;
  
  constructor(params: {
    id: string,
    createdAtUtc: Date,
    updatedAtUtc: Date,
    swimlaneId: string,
    name: string,
    description?: string
  }) {
    super(params);
    this.swimlaneId = params.swimlaneId;
    this.name = params.name;
    this.description = params.description;
  }

  public getSwimlaneId(): string {
    return this.swimlaneId;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string | undefined {
    return this.description;
  }
}