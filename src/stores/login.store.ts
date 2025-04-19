import { makeAutoObservable } from 'mobx';
import UsersApi from '../infra/api/users.api';
import { SignupRequestModel } from '../models/login/signup-request.model';
import { LoginRequestModel } from '../models/login/login-request.model';

export class LoginStore {
  loading: boolean = false;
  error: string = '';
  token: string = '';
  usersApi: UsersApi;

  constructor() {
    makeAutoObservable(this);
    this.usersApi = new UsersApi();
  }

  async signup(payload: SignupRequestModel) {
    this.loading = true;
    this.error = '';
    try {
      const response = await this.usersApi.signup(payload);
      this.token = response.token;
      localStorage.setItem('token', this.token);
    } catch (error: any) {
      this.error = error.response?.data?.message || error.message;
    } finally {
      this.loading = false;
    }
  }

  async login(payload: LoginRequestModel) {
    this.loading = true;
    this.error = '';
    try {
      const response = await this.usersApi.login(payload);
      this.token = response.token;
      localStorage.setItem('token', this.token);
    } catch (error: any) {
      this.error = error.response?.data?.message || error.message;
    } finally {
      this.loading = false;
    }
  }
}

const loginStoreInstance = new LoginStore();
export const useLoginStore = () => loginStoreInstance;
