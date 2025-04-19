import { makeAutoObservable } from 'mobx';

export class BoardsStore {
  constructor() {
    makeAutoObservable(this);
  }
}