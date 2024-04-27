import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ListaInterface } from '../main/interfaces/lista.interface';

@Injectable({
  providedIn: 'root'
})
export class TweetsService {
  constructor(private http: HttpClient) {}

  username: string;
  tweetList: ListaInterface[] = [];
  tweetListSubject: Subject<ListaInterface[]> = new Subject<ListaInterface[]>();

  getTweets(): void{
    let url = 'http://localhost/tweets-api.php';
    if (this.username) {
      url += `?username=${this.username}`;
    }
    this.http.get<ListaInterface[]>(url).subscribe((res)=>{
      this.tweetList=res;
      this.emitTweetListChange(); 
    });
  }

  getSearch(search: string): void{
    let url = `http://localhost/tweets-api.php?search=${search}`;
    this.http.get<ListaInterface[]>(url).subscribe((res)=>{
      this.tweetList=res;
      this.emitTweetListChange(); 
    });
  }

  private emitTweetListChange(): void {
    this.tweetListSubject.next([...this.tweetList]); 
  }

  getTweetListObservable(): Observable<ListaInterface[]> {
    return this.tweetListSubject.asObservable();
  }
}
