export class ValueResult<T> {

  private value: T | null;
  private error: string | null;

  constructor(params?: {
    value?: T;
    error?: string | null;
  }) {
    this.value = params?.value ?? null;
    this.error = params?.error ?? null;
  }

  public getValue(): T | null {
    if (this.error) {
      return null;
    }
    return this.value;
  }

  public getError(): string | null {
    return this.error;
  }

  public isSuccess(): boolean {
    return !this.error;
  }

  public isError(): boolean {
    return Boolean(this.error);
  }

  static fromError(error: any): ValueResult<null> {
    return new ValueResult<null>({ value: null, error: (error.response?.data?.error.message ?? error.message) });
  }
}