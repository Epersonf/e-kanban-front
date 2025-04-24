import { EntityMutable } from "../core/entity-mutable.mode";
import { Swimlane } from "./swimlane.model";
import { User } from "./user.model";

export class Board extends EntityMutable {
  private name: string;
  private description?: string;
  private members: User[];
  private swimlanes: Swimlane[];

  constructor(params: {
    id: string,
    createdAtUtc: Date,
    updatedAtUtc: Date,
    name: string,
    description?: string,
    members?: User[]
    swimlanes?: Swimlane[]
  }) {
    super(params);
    if (!params) return;
    this.name = params.name;
    this.description = params.description;
    this.members = params.members || [];
    this.swimlanes = params.swimlanes || [];
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string | undefined {
    return this.description;
  }

  public getMembers(): User[] {
    return this.members;
  }

  public getSwimlanes(): Swimlane[] {
    return this.swimlanes;
  }
}