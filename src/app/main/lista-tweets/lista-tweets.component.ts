import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Subscription } from 'rxjs';
import { TweetsService } from '../../services/tweets.service';
import { TweetEventService } from '../../services/tweet-event.service';
import { ListaInterface } from '../interfaces/lista.interface';

@Component({
  selector: 'app-lista-tweets',
  standalone: true,
  imports: [],
  templateUrl: './lista-tweets.component.html',
  styleUrl: './lista-tweets.component.css'
})
export class ListaTweetsComponent implements OnInit, OnDestroy {
  tweetList: ListaInterface[] = [];
  private tweetAddedSubscription: Subscription= new Subscription;

  constructor(private tweetsService: TweetsService, private tweetEventService: TweetEventService) {}

  ngOnInit(): void {
    this.getTweets();
    this.subscribeToTweetAdded();
  }

  getTweets(){
    this.tweetsService.getTweets().subscribe({
      next: (result)=>{
        this.tweetList = result;
      },
      error: (err)=>{
        console.error('Error al obtener los tweets:', err);
      }
    })
  }

  private subscribeToTweetAdded() {
    this.tweetAddedSubscription = this.tweetEventService.tweetAdded$.subscribe(tweet => {
      // Agregar el nuevo tweet a la lista de tweets
      this.getTweets();
    });
  }

  ngOnDestroy(): void {
    this.tweetAddedSubscription.unsubscribe();
  }
  

}
