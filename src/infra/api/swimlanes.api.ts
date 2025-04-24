import ApiCaller from './api-caller';
import { Swimlane } from '../../models/general/swimlane.model'; // Use Swimlane class
import { ValueResult } from '../../models/value_result/value_result';

// Define request/response types based on usage in BoardsPage.tsx and Swimlane model
interface CreateSwimlanePayload {
  swimlanes: { boardId: string, name: string; order: number }[];
}

interface UpdateSwimlanePayload {
  swimlanes: { boardId: string, name: string; order: number, id: string }[];
}

class SwimlanesApi extends ApiCaller {


  public async createSwimlane(payload: CreateSwimlanePayload): Promise<ValueResult<Swimlane | null>> {
    // Assuming the endpoint is '/swimlanes'
    // The response likely returns the created swimlane object
    return this.post<Swimlane>('/swimlanes/user', payload);
  }

  public async updateSwimlane(payload: UpdateSwimlanePayload): Promise<ValueResult<Swimlane | null>> {
    // Assuming the endpoint is `/swimlanes/{id}`
    // Send only the fields being updated, e.g., name
    return this.put<Swimlane>(`/swimlanes/user/${payload.swimlanes[0].id}`, payload.swimlanes[0]);
  }

  public async deleteSwimlane(id: string): Promise<ValueResult<null>> { // Swimlane ID is string
    // Assuming the endpoint is `/swimlanes/{id}`
    // Assuming no content on successful delete
    return this.delete<null>(`/swimlanes/user/${id}`);
  }
}

// Export an instance
const swimlanesApi = new SwimlanesApi();
export default swimlanesApi;
