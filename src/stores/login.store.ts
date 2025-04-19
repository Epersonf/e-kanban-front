import { makeAutoObservable } from 'mobx';
import UsersApi from '../infra/api/users.api';

export class LoginStore {
  loading = false;
  error = '';
  token = '';
  usersApi: UsersApi;

  constructor() {
    makeAutoObservable(this);
    this.usersApi = new UsersApi();
  }

  async signup(payload: any) {
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

  async login(payload: any) {
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
