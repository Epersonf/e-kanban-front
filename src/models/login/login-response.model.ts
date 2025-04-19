import { User } from '../general/user.model';

export class LoginResponseModel {
  token!: string;
  user!: User;
  expiresAt!: number;
}
