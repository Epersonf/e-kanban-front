export class PaginatedList<T> {
  items: T[];
  pageCount: number;

  constructor(params?: {
    items: T[];
    pageCount: number;
  }) {
    if (!params) return;
    this.items = params.items;
    this.pageCount = params.pageCount;
  }
}