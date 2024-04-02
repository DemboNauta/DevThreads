import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ListaInterface } from '../main/interfaces/lista.interface';

@Injectable({
  providedIn: 'root'
})
export class TweetEventService {
  private tweetAddedSubject = new Subject<ListaInterface>();

  tweetAdded$ = this.tweetAddedSubject.asObservable();

  emitTweetAdded(tweet: ListaInterface) {
    this.tweetAddedSubject.next(tweet);
  }
}
