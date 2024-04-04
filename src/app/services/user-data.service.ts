import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../main/interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private loggedInUserSource = new BehaviorSubject<any>(null);
  private messageSource = new BehaviorSubject<string>('UsuarioNoRegistrado');
  private userSource = new BehaviorSubject<User | null>(null);

  loggedInUser$ = this.loggedInUserSource.asObservable();
  userChange$ = this.userSource.asObservable();
  currentMessage = this.messageSource.asObservable();


  constructor() { }

  setLoggedInUser(user: User) {
    this.loggedInUserSource.next(user);
  }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
  
}
