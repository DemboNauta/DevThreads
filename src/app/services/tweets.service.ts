import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TweetsService {
  constructor(private http: HttpClient) {}

  username: string;

  getTweets(): Observable<any> {
    let url = 'http://localhost/tweets-api.php';
    if (this.username) {
      url += `?username=${this.username}`;
    }
    return this.http.get(url);
  }
}
