import { makeAutoObservable } from 'mobx';
import UsersApi from '../infra/api/users.api';
import { SignupRequestModel } from '../models/login/signup-request.model';
import { LoginRequestModel } from '../models/login/login-request.model';
import { ValueResult } from '../models/value_result/value_result';
import { LoginResponseModel } from '../models/login/login-response.model';
import LoggedUserStorage from '../models/storage/logged_user_storage';

class LoginStore {
  loading: boolean = false;
  error: string = '';
  token: string = '';
  email: string = '';
  password: string = '';
  usersApi: UsersApi;

  constructor() {
    makeAutoObservable(this);
    this.usersApi = new UsersApi();
  }

  setEmail(email: string) {
    this.email = email;
  }

  setPassword(password: string) {
    this.password = password;
  }
  validate(): boolean {
    if (!this.email) {
      this.error = 'Email is required';
      return false;
    }
    if (!this.password) {
      this.error = 'Password is required';
      return false;
    }
    return true;
  }


  async signup(payload: SignupRequestModel) {
    this.loading = true;
    this.error = '';
    const response = await this.usersApi.signup(payload);
    if (response.isError()) return response;
    this.loading = false;
    this.error = response.getError() ?? 'Failed to signup';
    return response;
  }

  async login(): Promise<ValueResult<boolean> | null> {
    const isValid = this.validate();
    if (!isValid) return null;
    this.loading = true;
    this.error = '';
    const response = await this.usersApi.login({
      email: this.email,
      password: this.password
    });
    if (response.isError()) return new ValueResult({ error: response.getError() });
    const loggedData = response.getValue()!;
    LoggedUserStorage.setUser(loggedData);
    this.error = response.getError() ?? 'Failed to login';
    this.loading = false;
    return new ValueResult({ value: true});
  }

  async logout(): Promise<ValueResult<string> | null> {
    LoggedUserStorage.clear();
    return new ValueResult();
  }
}

const loginStoreInstance = new LoginStore();
export const useLoginStore = () => loginStoreInstance;
