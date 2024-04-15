import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { User } from '../main/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private userSubject = new Subject<User>();

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserByUsername(username: string) {
    return this.http.get<User>('http://localhost/getUserByUsername.php?username=' + username);
  }

  setUserByUsername(username: string) {
    this.getUserByUsername(username).subscribe(
      (user: User) => {
        this.userSubject.next(user);
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }
}