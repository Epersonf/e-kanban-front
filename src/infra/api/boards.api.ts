import ApiCaller from './api-caller';
import { Board } from '../../models/general/board.model'; // Use Board class
import { ValueResult } from '../../models/value_result/value_result';
import KanbanAPiRequest from '../../api';
import { plainToInstance } from 'class-transformer';
import { PaginatedList } from '../../models/pagination/paginated_list';
import { CreateBoardResponse } from '../../models/boards/boards-response.model';

// Define request/response types based on usage in BoardsPage.tsx and Board model
interface CreateBoardPayload {
  boards: { name: string; description?: string }[]; // Use name, description optional
}


interface UpdateBoardPayload {
  id: string; // Board ID is string in the model
  name: string; // Use name instead of title
  // Add other updatable fields if necessary, e.g., description
}

export class BoardsApi {

  private static axios = KanbanAPiRequest.getAxios();
  static async getBoards(params: {
    page: number;
    pageSize: number;
    populateWithSwimlanes: boolean;
    populateWithMembers: boolean;
  }): Promise<ValueResult<PaginatedList<Board | null>>> {
    // Assuming the endpoint is '/boards'
    try {
      const res = await this.axios.get('/boards/user', {
        params,
      });
      const value = plainToInstance(Board, res.data.items) as Board[];
      const resInfo = new ValueResult({
        value: new PaginatedList<Board | null>({
          items: value,
          pageCount: res.data.pageCount,
        })
      });

      return resInfo;
    } catch (error) {
      console.error('Error fetching boards:', error);
      return new ValueResult({ error: 'Error fetching boards' });
    }
  }

  static async createBoard(boards: CreateBoardPayload): Promise<ValueResult<CreateBoardResponse[] | null>> {
    try {
      const res = await this.axios.post('/boards/user', boards);
      const value = plainToInstance(CreateBoardResponse, res.data);
      return new ValueResult({ value });
    } catch (error) {
      console.error('Error creating board:', error);
      return new ValueResult({ error: 'Error creating board' });
    }
  }

  static async updateBoard(payload: UpdateBoardPayload): Promise<ValueResult<Board | null>> {
    try {
      const res = await this.axios.put<Board>(`/boards/${payload.id}`, { name: payload.name });
      const value = plainToInstance(Board, res.data);
      return new ValueResult({ value });
    } catch (error) {
      console.error('Error updating board:', error);
      return new ValueResult({ error: 'Error updating board' });
    }
  }

  static async deleteBoard(id: string): Promise<ValueResult<null>> { // Board ID is string
    try {
      const res = await this.axios.put(`/boards/${id}`);
      return new ValueResult({ value: res.data });
    } catch (error) {
      console.error('Error deleting board:', error);
      return new ValueResult({ error: 'Error deleting board' });
    }
  }
}

