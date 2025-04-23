import { JsonObject, JsonProperty } from "typescript-json-serializer";

/**
 * Represents the base immutable properties common to all entities.
 * Contains identifiers and creation timestamp.
 */
@JsonObject()
export abstract class EntityImmutable {
  /**
   * The unique identifier for the entity.
   */
  @JsonProperty()
  public readonly id?: string;

  /**
   * The UTC timestamp when the entity was created.
   */
  @JsonProperty()
  public readonly createdAtUtc?: Date;

  /**
   * Constructor for immutable entity properties.
   * @param id - The unique identifier.
   * @param createdAtUtc - The creation timestamp.
   */
  protected constructor(params: {
    id?: string,
    createdAtUtc?: Date,
  }) {
    this.id = params.id;
    this.createdAtUtc = params.createdAtUtc;
  }
}