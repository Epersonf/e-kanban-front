import ApiCaller from './api-caller';
import { Swimlane } from '../../models/general/swimlane.model'; // Use Swimlane class
import { ValueResult } from '../../models/value_result/value_result';
import KanbanAPiRequest from '../../api';
import { plainToInstance } from 'class-transformer';

// Define request/response types based on usage in BoardsPage.tsx and Swimlane model
interface CreateSwimlanePayload {
  swimlanes: { boardId: string, name: string; order: number }[];
}

interface UpdateSwimlanePayload {
  swimlanes: { boardId: string, name: string; order: number, id: string }[];
}

export class SwimlanesApi extends ApiCaller {
  private static axios = KanbanAPiRequest.getAxios();

  static async createSwimlane(payload: CreateSwimlanePayload): Promise<ValueResult<Swimlane[] | null>> {
    try {
      const res = await this.axios.post('/swimlanes/user', payload);
      const value = plainToInstance(Swimlane, res.data);
      return new ValueResult({ value });
    } catch (error) {
      console.error('Error creating swimlane:', error);
      return new ValueResult({ error: 'Error creating swimlane' });
    }
  }

  static async updateSwimlane(payload: UpdateSwimlanePayload): Promise<ValueResult<Swimlane[] | null>> {
    try {
      const res = await this.axios.put('/swimlanes/user', payload);
      const value = plainToInstance(Swimlane, res.data);
      return new ValueResult({ value });
    } catch (error) {
      console.error('Error updating swimlane:', error);
      return new ValueResult({ error: 'Error updating swimlane' });
    }
  }

  static async deleteSwimlane(id: string): Promise<ValueResult<void | null>> {
    try {
      const res = await this.axios.put(`/swimlanes/${id}`);
      return new ValueResult({ value: res.data });
    } catch (error) {
      console.error('Error deleting swimlane:', error);
      return new ValueResult({ error: 'Error deleting swimlane' });
    }
  }
}

