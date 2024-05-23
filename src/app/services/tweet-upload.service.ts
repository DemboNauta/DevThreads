import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TweetsUploadService {
  private apiUrl= "https://devthreads.es/backend/tweet-upload-api.php";

  constructor (private http: HttpClient) { }

  postTweet(tweetData: any): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    return this.http.post<string>(this.apiUrl, tweetData, { headers });
  }
}
