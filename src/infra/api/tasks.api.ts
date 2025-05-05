import { Task } from '../../models/general/task.model';
import { ValueResult } from '../../models/value_result/value_result';
import KanbanAPiRequest from '../../api';
import { plainToInstance } from 'class-transformer';

interface CreateTaskPayload {
  swimlaneId: string; // Swimlane ID is string
  name: string; // Use name instead of title
  description?: string;
  order: number;
  ownerIds: string[];
}

export interface UpdateTaskPayload {
  id: string; // Task ID is string
  name?: string;
  description?: string;
  swimlaneId?: string; // If moving task between swimlanes
  order?: number;
  ownerIds?: string[]; // Add ownerIds
}

export class TasksApi {
  private static readonly axios = KanbanAPiRequest.getAxios();
  // Note: Getting tasks might be part of getting a swimlane/board, or a separate endpoint.
  // Add a getTasks method if needed.

  static async createTask(payload: CreateTaskPayload): Promise<ValueResult<Task[] | null>> {
    const requestBody = { tasks: [payload], };
    try {
      const res = await this.axios.post<Task[]>('/tasks/user', requestBody);
      const value = plainToInstance(Task, res.data);
      return new ValueResult({ value });
    } catch (error) {
      console.error('Error creating task:', error);
      return new ValueResult({ error: 'Error creating task' });
    }
  }

  static async updateTask(payload: UpdateTaskPayload): Promise<ValueResult<Task | null>> {
    try {
      const req: UpdateTaskPayload = {
        ...payload,
        ownerIds: payload.ownerIds || [],
      }
      const requestBody = { tasks: [req], };
      const res = await this.axios.patch<Task>('/tasks/user', requestBody);
      const value = plainToInstance(Task, res.data);
      return new ValueResult({ value });
    } catch (error) {
      console.error('Error updating task:', error);
      return new ValueResult({ error: 'Error updating task' });
    }
  }

  static async deleteTask(id: string): Promise<ValueResult<null>> {
    try {
      const res = await this.axios.delete(`/tasks/user/${id}`);
      return new ValueResult({ value: res.data });
    } catch (error) {
      console.error('Error deleting task:', error);
      return new ValueResult({ error: 'Error deleting task' });
    }
  }
}
