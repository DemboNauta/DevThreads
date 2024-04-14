import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TweetsService {
  constructor(private http: HttpClient) {}

  getTweets(userId?: number): Observable<any> {
    let url = 'http://localhost/tweets-api.php';
    if (userId) {
      url += `?userId=${userId}`;
    }
    return this.http.get(url);
  }
}
