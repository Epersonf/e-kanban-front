import ApiCaller from './api-caller';
import { Swimlane } from '../../models/general/swimlane.model'; // Use Swimlane class
import { ValueResult } from '../../models/value_result/value_result';

// Define request/response types based on usage in BoardsPage.tsx and Swimlane model
interface CreateSwimlanePayload {
  boardId: string; // Board ID is string
  name: string; // Use name instead of title
  // Add order if required by API
}

interface UpdateSwimlanePayload {
  id: string; // Swimlane ID is string
  name: string; // Use name instead of title
  // Add other updatable fields if necessary, e.g., order
}

class SwimlanesApi extends ApiCaller {
  // Note: Getting swimlanes might be part of getting a board, or a separate endpoint.
  // Add a getSwimlanes method if needed.

  public async createSwimlane(payload: CreateSwimlanePayload): Promise<ValueResult<Swimlane | null>> {
    // Assuming the endpoint is '/swimlanes'
    // The response likely returns the created swimlane object
    return this.post<Swimlane>('/swimlanes', payload);
  }

  public async updateSwimlane(payload: UpdateSwimlanePayload): Promise<ValueResult<Swimlane | null>> {
    // Assuming the endpoint is `/swimlanes/{id}`
    // Send only the fields being updated, e.g., name
    return this.put<Swimlane>(`/swimlanes/${payload.id}`, { name: payload.name });
  }

  public async deleteSwimlane(id: string): Promise<ValueResult<null>> { // Swimlane ID is string
    // Assuming the endpoint is `/swimlanes/{id}`
    // Assuming no content on successful delete
    return this.delete<null>(`/swimlanes/${id}`);
  }
}

// Export an instance
const swimlanesApi = new SwimlanesApi();
export default swimlanesApi;
