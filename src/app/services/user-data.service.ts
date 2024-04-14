import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../main/interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private messageSource = new Observable<string>();

  private userDataSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  loggedInUser: Observable<User> = this.userDataSubject.asObservable();



  constructor() { }

  setLoggedInUser(user: User) {
    this.userDataSubject.next(user);

  }

  getLoggedInUser(){
    return this.loggedInUser;
  }

  
}
