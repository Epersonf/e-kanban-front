import { makeAutoObservable } from 'mobx';

export class SingleBoardStore {
  constructor() {
    makeAutoObservable(this);
  }
}