import ApiCaller from './api-caller';
import { Task } from '../../models/general/task.model'; // Use Task class
import { ValueResult } from '../../models/value_result/value_result';

// Define request/response types based on usage in BoardsPage.tsx and Task model
interface CreateTaskPayload {
  swimlaneId: string; // Swimlane ID is string
  name: string; // Use name instead of title
  description?: string;
  // Add order or other fields if required by API
}

// Assuming update might be needed later, define payload
interface UpdateTaskPayload {
  id: string; // Task ID is string
  name?: string;
  description?: string;
  swimlaneId?: string; // If moving task between swimlanes
  // Add other updatable fields if necessary
}

class TasksApi extends ApiCaller {
  // Note: Getting tasks might be part of getting a swimlane/board, or a separate endpoint.
  // Add a getTasks method if needed.

  public async createTask(payload: CreateTaskPayload): Promise<ValueResult<Task | null>> {
    // Assuming the endpoint is '/tasks'
    // The response likely returns the created task object
    return this.post<Task>('/tasks', payload);
  }

  public async updateTask(payload: UpdateTaskPayload): Promise<ValueResult<Task | null>> {
    // Assuming the endpoint is `/tasks/{id}`
    // Send only the fields being updated
    const { id, ...updateData } = payload;
    return this.put<Task>(`/tasks/${id}`, updateData);
  }

  public async deleteTask(id: string): Promise<ValueResult<null>> { // Task ID is string
    // Assuming the endpoint is `/tasks/{id}`
    // Assuming no content on successful delete
    return this.delete<null>(`/tasks/${id}`);
  }
}

// Export an instance
const tasksApi = new TasksApi();
export default tasksApi;
