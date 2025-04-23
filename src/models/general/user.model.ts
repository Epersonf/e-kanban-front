import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { EntityMutable } from "../core/entity-mutable.mode";

@JsonObject()
export class User extends EntityMutable {
  @JsonProperty()
  private name: string;
  @JsonProperty()
  private surname: string;
  @JsonProperty()
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