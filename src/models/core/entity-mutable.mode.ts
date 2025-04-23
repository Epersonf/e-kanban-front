import { EntityImmutable } from "./entity-immutable.model";

/**
 * Represents a base mutable entity, inheriting immutable properties
 * and adding modification timestamp tracking.
 */
export abstract class EntityMutable extends EntityImmutable {
  /**
   * The UTC timestamp when the entity was last updated.
   */

  public updatedAtUtc?: Date;

  /**
   * Constructor for mutable entity properties.
   * @param id - The unique identifier.
   * @param createdAtUtc - The creation timestamp.
   * @param updatedAtUtc - The last update timestamp.
   */
  protected constructor(params: {
    id?: string,
    createdAtUtc?: Date,
    updatedAtUtc?: Date,
  }) {
    super(params);
    if (!params) return;
    this.updatedAtUtc = params.updatedAtUtc;
  }
}