import { EntityMutable } from "../core/entity-mutable.mode";

export class Task extends EntityMutable {
  
  swimlaneId: string;
  name: string;
  description?: string;
  ownerIds?: string[];
  
  constructor(params: {
    id: string,
    createdAtUtc: Date,
    updatedAtUtc: Date,
    swimlaneId: string,
    name: string,
    description?: string
    ownerIds?: string[]
  }) {
    super(params);
    this.swimlaneId = params.swimlaneId;
    this.name = params.name;
    this.description = params.description;
    this.ownerIds = params.ownerIds;
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

  public getOwnerIds(): string[] | undefined {
    return this.ownerIds;
  }

  setName(name: string) {
    this.name = name;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setOwnerIds(ownerIds: string[]) {
    this.ownerIds = ownerIds;
  }

  setSwimlaneId(droppableId: string) {
    this.swimlaneId = droppableId;
  } 
}