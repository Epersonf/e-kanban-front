import ApiCaller from './api-caller';
import { LoginRequestModel } from '../../models/login/login-request.model';
import { SignupRequestModel } from '../../models/login/signup-request.model';
import { LoginResponseModel } from '../../models/login/login-response.model';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ValueResult } from '../../models/value_result/value_result';
import { JsonSerializer } from 'typescript-json-serializer';
import KanbanAPiRequest from '../../api';

class UsersApi {
  private static axios = KanbanAPiRequest.getAxios()
  static async signup(payload: SignupRequestModel): Promise<ValueResult<LoginResponseModel | null>> {
    try {
      const response = await this.axios.post<LoginResponseModel>('/users/auth/signup', payload);
      const value = plainToClass(LoginResponseModel, response.data);
      return new ValueResult({ value });
    } catch (error) {
      console.error('Error signing up:', error);
      return new ValueResult({ error: 'Error signing up' });
    }
  }

  static async login(payload: LoginRequestModel): Promise<ValueResult<LoginResponseModel | null>> {
    try {
      const response = await this.axios.post<LoginResponseModel>('/users/auth/login', payload);

      const value = plainToInstance(LoginResponseModel, response.data);
      return new ValueResult({ value });
    } catch (error) {
      console.error('Error logging in:', error);
      return new ValueResult({ error: 'Error logging in' });
    }
  }
}
export default UsersApi;
