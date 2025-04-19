import ApiCaller from './api-caller';
import { LoginRequestModel } from '../../models/login/login-request.model';
import { SignupRequestModel } from '../../models/login/signup-request.model';
import { LoginResponseModel } from '../../models/login/login-response.model';
import { plainToClass } from 'class-transformer';

class UsersApi extends ApiCaller {
  public async signup(payload: SignupRequestModel): Promise<LoginResponseModel> {
    const response = await this.post('/users/auth/signup', payload);
    return plainToClass(LoginResponseModel, response.data);
  }

  public async login(payload: LoginRequestModel): Promise<LoginResponseModel> {
    const response = await this.post('/users/auth/login', payload);
    return plainToClass(LoginResponseModel, response.data);
  }
}

export default UsersApi;
