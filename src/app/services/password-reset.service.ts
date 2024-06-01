import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  private sendResetEmailUrl = 'https://devthreads.es/backend/send-reset-email.php';
  private verifyResetTokenUrl = 'https://devthreads.es/backend/verify-reset-token.php';

  constructor(private http: HttpClient) {}

  sendResetEmail(email: string): Observable<any> {
    const emailData = new FormData()
    emailData.append('email', email)
    return this.http.post<any>(this.sendResetEmailUrl, emailData);
  }

  verifyResetToken(token: string, newPassword: string): Observable<any> {
    const resetData = new FormData()
    resetData.append('token', token)
    resetData.append('newPassword', newPassword)

    return this.http.post<any>(this.verifyResetTokenUrl, resetData);
  }
}
