export class PaginatedList<T> {
  private items: T[];
  private pageCount: number;

  constructor(params: {
    items: T[],
    pageCount: number
  }) {
    this.items = params.items;
    this.pageCount = params.pageCount;
  }

  public getItems(): T[] {
    return this.items;
  }

  public getPageCount(): number {
    return this.pageCount;
  }
}