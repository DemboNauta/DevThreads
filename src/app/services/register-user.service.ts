import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  private apiUrl = 'http://localhost/register-user.php'; 

  constructor(private http: HttpClient) { }

  registerUser(userData: FormData): Observable<any> {

    return this.http.post<any>(this.apiUrl, userData);
  }
}
