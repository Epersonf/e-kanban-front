import { Type } from 'class-transformer';
import { User } from '../general/user.model';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

@JsonObject()
export class LoginResponseModel {
  @JsonProperty()
  private token: string;
  @JsonProperty({ type: User })
  private user: User;
  @JsonProperty()
  private expiresAt: number;

  constructor(params: {
    token: string,
    user: User,
    expiresAt: number
  }) {
    if (!params) return; 
    this.token = params.token;
    this.user = params.user;
    this.expiresAt = params.expiresAt;
  }

  getToken(): string { return this.token; }
  getUser(): User { return this.user; }
  getExpiresAt(): number { return this.expiresAt; }
}
