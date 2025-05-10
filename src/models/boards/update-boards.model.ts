export class UpdateBoardsModel {
  id: string;
  name: string;
  description?: string;

  constructor(params: { id: string, name: string, description?: string }) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
  }
}