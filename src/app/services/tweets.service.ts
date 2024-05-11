import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ListaInterface } from '../main/interfaces/lista.interface';

@Injectable({
  providedIn: 'root'
})
export class TweetsService {
  constructor(private http: HttpClient) {}

  tweetList: ListaInterface[] = [];
  tweetListSubject: Subject<ListaInterface[]> = new Subject<ListaInterface[]>();

  favoriteTweetList: any = [];
  followingTweetList:ListaInterface[] = [];
  favoriteTweetListSubject: Subject<any> = new Subject<any>();

  getTweets(username?: string): void{
    let url = 'http://localhost/tweets-api.php';
    if (username) {
      url += `?username=${username}`;
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

  getFavoriteTweets(userId: number): void {
    const url = `http://localhost/favorite-tweets.php?user_id=${userId}`;
    this.http.get<ListaInterface[]>(url).subscribe((res) => {
      this.favoriteTweetList = res;
      this.emitFavoriteTweetListChange(); 
    });
  }

  getFollowingTweets(userId: number){
    const url = `http://localhost/following-tweets.php?user_id=${userId}`;
    this.http.get<ListaInterface[]>(url).subscribe((res) => {
      this.tweetList=res;
      this.emitTweetListChange(); 
    });
  }

  setFavoriteTweet(userId: number, tweetId: string, username?: string) {
    const url = `http://localhost/favorite-tweets.php?user_id=${userId}&tweet_id=${tweetId}`;
    this.http.get<ListaInterface[]>(url).subscribe((res) => {
      this.favoriteTweetList = res;
      this.emitFavoriteTweetListChange();
      this.getTweets(username);
    });
  }
  

  private emitFavoriteTweetListChange(): void {
    this.favoriteTweetListSubject.next([...this.favoriteTweetList]); 
  }

  getFavoriteTweetListObservable(): Observable<any> {
    return this.favoriteTweetListSubject.asObservable();
  }

  postTweet(tweetData: any): void {
    const apiUrl= "http://localhost/tweet-upload-api.php";

    const headers = new HttpHeaders().set('Content-Type', 'text/html');

    this.http.post<string>(apiUrl, tweetData, { headers }).subscribe(()=>{
      this.emitTweetListChange()
      this.getTweets()

    });

    
  }
}
