import { makeAutoObservable } from 'mobx';
import UsersApi from '../infra/api/users.api';
import { SignupRequestModel } from '../models/login/signup-request.model';
import { LoginRequestModel } from '../models/login/login-request.model';
import { ValueResult } from '../models/value_result/value_result';
import { LoginResponseModel } from '../models/login/login-response.model';
import LoggedUserStorage from '../models/storage/logged_user_storage';

class LoginStore {
  isLoading: boolean = false;
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
  getIsLoading(): boolean {
    return this.isLoading;
  }
  getError(): string {
    return this.error;
  }

  setError(error: string) {
    this.error = error;
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  async signup(payload: SignupRequestModel) {
    this.setIsLoading(true);
    this.setError('');
    const response = await UsersApi.signup(payload);
    if (response.isError()) return response;
    this.setIsLoading(false);
    this.setError(response.getError() ?? 'Failed to signup');
    return response;
  }

  async login(): Promise<ValueResult<boolean> | null> {
    const isValid = this.validate();
    if (!isValid) return null;
    this.setError('');
    this.setIsLoading(true);
    const response = await UsersApi.login({
      email: this.email,
      password: this.password
    });
    if (response.isError()) return new ValueResult({ error: response.getError() });
    const loggedData = response.getValue()!;
    LoggedUserStorage.setUser(loggedData);
    this.setError(response.getError() ?? 'Failed to login');
    this.setIsLoading(false);
    return new ValueResult({ value: true });
  }

  async logout(): Promise<ValueResult<string> | null> {
    LoggedUserStorage.clear();
    return new ValueResult();
  }
}

const loginStoreInstance = new LoginStore();
export const useLoginStore = () => loginStoreInstance;
