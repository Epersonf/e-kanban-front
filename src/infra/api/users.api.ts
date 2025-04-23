import ApiCaller from './api-caller';
import { LoginRequestModel } from '../../models/login/login-request.model';
import { SignupRequestModel } from '../../models/login/signup-request.model';
import { LoginResponseModel } from '../../models/login/login-response.model';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ValueResult } from '../../models/value_result/value_result';
import { JsonSerializer } from 'typescript-json-serializer';

class UsersApi extends ApiCaller {
  static serialize = new JsonSerializer();
  public async signup(payload: SignupRequestModel): Promise<ValueResult<LoginResponseModel | null>> {
    const response = await this.post<LoginResponseModel>('/users/auth/signup', payload);
    if (response.isError()) return response;
    const value = plainToClass(LoginResponseModel, response.getValue());
    return new ValueResult({ value });
  }

  public async login(payload: LoginRequestModel): Promise<ValueResult<LoginResponseModel | null>> {
    const response = await this.post<LoginResponseModel>('/users/auth/login', payload);

    if (response.isError()) return response;
    const res = response.getValue() as LoginResponseModel;
    console.log('Resposta da API:', res);
    const value = UsersApi.serialize.deserializeObject(res, LoginResponseModel);
    // const value = plainToClass(LoginResponseModel, res, { enableImplicitConversion: true, excludeExtraneousValues: true });
    return new ValueResult({ value });
  }
}
export default UsersApi;
