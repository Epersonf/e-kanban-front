import { plainToInstance } from "class-transformer";
import { LoginResponseModel } from "../login/login-response.model";


class LoggedUserStorage {
  private static readonly USER_KEY = 'userInfo';
  private static readonly TOKEN_KEY = 'tokenInfo';
  private static readonly EXPIRES_AT_KEY = 'expiresAt';

  public static setUser(loginData: LoginResponseModel): void {
    const user = plainToInstance(LoginResponseModel, loginData);
    if (!loginData) return;

    window.localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    window.localStorage.setItem(this.TOKEN_KEY, loginData.getToken());
    window.localStorage.setItem(this.EXPIRES_AT_KEY, String(loginData.getExpiresAt()));
  }

  public static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public static getUser(): LoginResponseModel | null {
    const user = localStorage.getItem(this.USER_KEY);
    if (!user) return null;
    return JSON.parse(user);
  }

  public static getExpiresAt(): number | null {
    return Number(localStorage.getItem(this.EXPIRES_AT_KEY));
  }

  public static clear(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRES_AT_KEY);
  }

  public static isLoggedIn(): boolean {
    return Boolean(this.getUser());
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}

export default LoggedUserStorage;