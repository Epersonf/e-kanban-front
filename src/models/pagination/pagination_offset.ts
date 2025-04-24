export class PaginationOffset {
  pageSize: number;
  offset?: string;

  constructor(params?: {
    pageSize?: number;
    offset?: string;
  }) {
    this.pageSize = params?.pageSize ?? 10;
    this.offset = params?.offset ?? undefined;
  }

  public getLimit(): number {
    return this.pageSize;
  }
}
