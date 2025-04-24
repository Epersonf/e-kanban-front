
export class PaginatedOffset<T> {

  items: T[];
  offset: string | null;

  constructor(params: { items: T[]; offset: string }) {
    if (!params) return;
    this.items = params.items;
    this.offset = params.offset;
  }
}