
/**
 * Represents the base immutable properties common to all entities.
 * Contains identifiers and creation timestamp.
 */
export abstract class EntityImmutable {
  /**
   * The unique identifier for the entity.
   */
  public readonly id?: string;

  /**
   * The UTC timestamp when the entity was created.
   */
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
    if (!params) return;
    this.id = params.id;
    this.createdAtUtc = params.createdAtUtc;
  }
}