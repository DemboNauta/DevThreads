import { Component, OnInit, OnDestroy, Input  } from '@angular/core';
import { Subscription } from 'rxjs';
import { TweetsService } from '../../services/tweets.service';
import { TweetEventService } from '../../services/tweet-event.service';
import { ListaInterface } from '../interfaces/lista.interface';
import { UserProfileService } from '../../services/user-profile.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-tweets',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lista-tweets.component.html',
  styleUrl: './lista-tweets.component.css'
})
export class ListaTweetsComponent implements OnInit, OnDestroy {
  tweetList: ListaInterface[] = [];

  private tweetAddedSubscription: Subscription = new Subscription;

  private tweetListSubscription: Subscription;


  constructor(private tweetsService: TweetsService, private tweetEventService: TweetEventService, private userProfileService : UserProfileService) {}

  ngOnInit(): void {
    this.subscribeToTweetListChanges();
    this.getTweets(); 

  }

  subscribeToTweetListChanges(): void {
    this.tweetListSubscription = this.tweetsService.getTweetListObservable().subscribe(
      (tweets: ListaInterface[]) => {
        this.tweetList = tweets;
      }
    );
  }

  getTweets(){
    this.tweetsService.getTweets()
    
    
  }


  ngOnDestroy(): void {
    if (this.tweetListSubscription) {
      this.tweetListSubscription.unsubscribe();
    }
  }


}
