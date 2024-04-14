import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Subscription } from 'rxjs';
import { TweetsService } from '../../services/tweets.service';
import { TweetEventService } from '../../services/tweet-event.service';
import { ListaInterface } from '../interfaces/lista.interface';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-lista-tweets',
  standalone: true,
  imports: [],
  templateUrl: './lista-tweets.component.html',
  styleUrl: './lista-tweets.component.css'
})
export class ListaTweetsComponent implements OnInit, OnDestroy {
  tweetList: ListaInterface[] = [];
  private tweetAddedSubscription: Subscription = new Subscription;

  constructor(private tweetsService: TweetsService, private tweetEventService: TweetEventService, private userProfileService : UserProfileService) {}

  ngOnInit(): void {
    this.getTweets();
    this.subscribeToTweetAdded();
    this.subscribeToUserIdChanges()
  }

  getTweets(userId?: number){
    this.tweetsService.getTweets(userId).subscribe({
      next: (result) => {
        console.log(result)
        this.tweetList = result;
      },
      error: (err) => {
        console.error('Error al obtener los tweets:', err);
      }
    });
  }

  private subscribeToTweetAdded() {
    this.tweetAddedSubscription = this.tweetEventService.tweetAdded$.subscribe(tweet => {
      // Agregar el nuevo tweet a la lista de tweets
      this.getTweets();
    });
  }

  private subscribeToUserIdChanges() {
    this.userProfileService.userId$.subscribe(userId => {
      if (userId) {
        console.log("prueba")
        this.getTweets(userId);
      }
    });
  }

  ngOnDestroy(): void {
    this.tweetAddedSubscription.unsubscribe();
  }


}
