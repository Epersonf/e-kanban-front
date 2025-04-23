import { EntityMutable } from "../core/entity-mutable.mode";

export class User extends EntityMutable {
  private name: string;
  private surname: string;
  private email: string;

  constructor(params: {
    id?: string,
    name: string,
    surname: string,
    email: string,
    createdAtUtc?: Date,
    updatedAtUtc?: Date,
  }) {
    super(params);
    if (!params) return;
    this.name = params.name;
    this.surname = params.surname;
    this.email = params.email;
  }

  public getName(): string {
    return this.name;
  }

  public getSurname(): string {
    return this.surname;
  }

  public getEmail(): string {
    return this.email;
  }
}