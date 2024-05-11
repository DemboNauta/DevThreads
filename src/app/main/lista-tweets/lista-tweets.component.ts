import { Component, OnInit, OnDestroy, Input  } from '@angular/core';
import { Subscription } from 'rxjs';
import { TweetsService } from '../../services/tweets.service';
import { TweetEventService } from '../../services/tweet-event.service';
import { ListaInterface } from '../interfaces/lista.interface';
import { UserProfileService } from '../../services/user-profile.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/authentication.service';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-lista-tweets',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lista-tweets.component.html',
  styleUrl: './lista-tweets.component.css'
})
export class ListaTweetsComponent implements OnInit, OnDestroy {
  tweetList: ListaInterface[] = [];

  @Input() userProfileUserName: string;
  @Input() userFollowingId: number;

  likedTweets: string[];

  userId: number;

  private tweetAddedSubscription: Subscription = new Subscription;

  private tweetListSubscription: Subscription;


  constructor(private tweetsService: TweetsService, private tweetEventService: TweetEventService, private userProfileService : UserProfileService, private userDataService: UserDataService) {}

  ngOnInit(): void {
    this.subscribeToTweetListChanges();
    if(this.userProfileUserName){
      this.getTweets(this.userProfileUserName); 
    }else if(this.userFollowingId){
      this.getFollowingTweets(this.userFollowingId);
    }
    else{
      this.getTweets()
    }
    this.subscribeToTweetListLikeChanges();
  }

  subscribeToTweetListChanges(): void {
    this.tweetListSubscription = this.tweetsService.getTweetListObservable().subscribe(
      (tweets: ListaInterface[]) => {
        this.tweetList = tweets;
      }
    );
  }
  subscribeToTweetListLikeChanges(): void {
    this.tweetListSubscription = this.tweetsService.getFavoriteTweetListObservable().subscribe(
      (tweetLikes: string[]) => {
        this.likedTweets = tweetLikes;
      }
    );
  }

  getTweets(username?:string){
    
    this.tweetsService.getTweets(username)
    this.userDataService.loggedInUser.subscribe(
      (user)=>{
        if(user){
          this.tweetsService.getFavoriteTweets(user.user_id)
          this.userId=user.user_id
        }
        

      }
    )
    
    
  }

  getFollowingTweets(userId: number){
    this.tweetsService.getFollowingTweets(userId)
  }

  onSetLike(tweetId: string): void{
    if(this.userProfileUserName){
      this.tweetsService.setFavoriteTweet(this.userId, tweetId, this.userProfileUserName);
    }else{
      this.tweetsService.setFavoriteTweet(this.userId, tweetId,);
    }
  }


  ngOnDestroy(): void {
    if (this.tweetListSubscription) {
      this.tweetListSubscription.unsubscribe();
    }
    this.tweetList=[]
  }

  getFavoriteTweets(userId: number): void {
    this.tweetsService.getFavoriteTweets(userId);
  }


}
