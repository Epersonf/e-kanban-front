import { makeAutoObservable } from 'mobx';

export class LoginStore {
  constructor() {
    makeAutoObservable(this);
  }
}