import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { ListaInterface } from '../main/interfaces/lista.interface';

@Injectable({
  providedIn: 'root'
})
export class TweetsService {
  constructor(private http: HttpClient) {}

  tweetList: ListaInterface[] = [];
  tweetComments: ListaInterface[] = [];
  tweetListSubject: Subject<ListaInterface[]> = new Subject<ListaInterface[]>();

  noFollowing: boolean= false;

  favoriteTweetList: any = [];
  followingTweetList:ListaInterface[] = [];
  favoriteTweetListSubject: Subject<any> = new Subject<any>();

  getTweets(username?: string): void{
    let url = 'https://devthreads.es/backend/tweets-api.php';
    if (username) {
      url += `?username=${username}`;
    }
    this.http.get<ListaInterface[]>(url).subscribe((res)=>{
      this.tweetList=res;
      this.emitTweetListChange(); 
    });
  }

  getSearch(search: string): void{
    let url = `https://devthreads.es/backend/tweets-api.php?search=${search}`;
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
    const url = `https://devthreads.es/backend/favorite-tweets.php?user_id=${userId}`;
    this.http.get<ListaInterface[]>(url).subscribe((res) => {
      this.favoriteTweetList = res;
      this.emitFavoriteTweetListChange(); 
    });
  }

  getFollowingTweets(userId: number){
    const url = `https://devthreads.es/backend/following-tweets.php?user_id=${userId}`;
    this.http.get<ListaInterface[]>(url).subscribe((res) => {
      if(res.length<=0){
        this.noFollowing=true;
      }
      this.tweetList=res;
      this.emitTweetListChange(); 
    });
  }

  setFavoriteTweet(userId: number, tweetId: string, username?: string) {
    const url = `https://devthreads.es/backend/favorite-tweets.php?user_id=${userId}&tweet_id=${tweetId}`;
    return this.http.get<ListaInterface[]>(url).pipe(
      tap((res) => {
        this.favoriteTweetList = res;
        this.emitFavoriteTweetListChange();
        this.getTweets(username);
      })
    )
    
  }
  

  private emitFavoriteTweetListChange(): void {
    this.favoriteTweetListSubject.next([...this.favoriteTweetList]); 
  }

  getFavoriteTweetListObservable(): Observable<any> {
    return this.favoriteTweetListSubject.asObservable();
  }

  postTweet(tweetData: any): void {
    const apiUrl= "https://devthreads.es/backend/tweet-upload-api.php";

    const headers = new HttpHeaders().set('Content-Type', 'text/html');

    this.http.post<string>(apiUrl, tweetData, { headers }).subscribe(()=>{
      this.emitTweetListChange()
      this.getTweets()

    });

    
  }

  getCommentTweets(tweet_id: string){
    let url = `https://devthreads.es/backend/getTweetComments.php?tweet_id=${tweet_id}`;

    return this.http.get<ListaInterface[]>(url)
  }

  postComment(tweetData: any, tweet_id) {
    const apiUrl= "https://devthreads.es/backend/postTweetComment.php";
    return this.http.post<string>(apiUrl, tweetData)

    
  }
}
