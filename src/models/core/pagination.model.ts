export class Pagination {
  private page: number = 1;
  private pageSize: number = 10;

  constructor(params: { page: number, pageSize: number }) {
    this.page = params.page;
    this.pageSize = params.pageSize;
  }

  public getPage(): number {
    return this.page;
  }

  public getPageSize(): number {
    return this.pageSize;
  }
}