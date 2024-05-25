import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../main/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  private apiUrl = 'https://devthreads.es/backend/'; 

  constructor(private http: HttpClient) { }

  registerUser(userData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}register-user.php`, userData);
  }


  updateUser(userData: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}update-user.php`, userData);
  }

}
