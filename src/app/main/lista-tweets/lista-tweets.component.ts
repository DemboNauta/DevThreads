import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { TweetsService } from '../../services/tweets.service';
import { TweetEventService } from '../../services/tweet-event.service';
import { ListaInterface } from '../interfaces/lista.interface';
import { UserProfileService } from '../../services/user-profile.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/authentication.service';
import { UserDataService } from '../../services/user-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-lista-tweets',
  standalone: true,
  imports: [RouterLink, FormsModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './lista-tweets.component.html',
  styleUrl: './lista-tweets.component.css'
})
export class ListaTweetsComponent implements OnInit, OnDestroy {
  tweetList: ListaInterface[] = [];
  commentsTweet: ListaInterface[] = [];
  commentText: string;

  @Input() userProfileUserName: string;
  @Input() userFollowingId: number;

  likedTweets: string[];
  userId: number;
  tweetToComment: ListaInterface
  loggedInUser: User;

  private tweetAddedSubscription: Subscription = new Subscription;

  private tweetListSubscription: Subscription;


  constructor(
    private tweetsService: TweetsService,
    private tweetEventService: TweetEventService,
    private userProfileService: UserProfileService,
    private userDataService: UserDataService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.subscribeToTweetListChanges();
    if (this.userProfileUserName) {
      this.getTweets(this.userProfileUserName);
    } else if (this.userFollowingId) {
      this.getFollowingTweets(this.userFollowingId);
    }
    else {
      this.getTweets()
    }
    this.subscribeToTweetListLikeChanges();
    this.userDataService.loggedInUser.subscribe(
      (res) => {
        this.loggedInUser = res
      }
    )
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

  getTweets(username?: string) {

    this.tweetsService.getTweets(username)
    this.userDataService.loggedInUser.subscribe(
      (user) => {
        if (user) {
          this.tweetsService.getFavoriteTweets(user.user_id)
          this.userId = user.user_id
        }


      }
    )


  }

  getCommentTweets(tweet_id: string) {
    this.tweetsService.getCommentTweets(tweet_id).subscribe(
      (res) => {
        this.commentsTweet = res
      }
    );
  }

  getFollowingTweets(userId: number) {
    this.tweetsService.getFollowingTweets(userId)
  }

  onSetLike(tweetId: string): void {
    if (this.userProfileUserName) {
      this.tweetsService.setFavoriteTweet(this.userId, tweetId, this.userProfileUserName).subscribe(
        () => {
          if (this.modalService.hasOpenModals()) {
            this.getCommentTweets(this.tweetToComment.tweet_id)
          }
        }
      )
    } else {
      this.tweetsService.setFavoriteTweet(this.userId, tweetId).subscribe(
        () => {
          if (this.modalService.hasOpenModals()) {
            this.getCommentTweets(this.tweetToComment.tweet_id)
            console.log(this.likedTweets)
          }
        }
      )
    }

  }


  ngOnDestroy(): void {
    if (this.tweetListSubscription) {
      this.tweetListSubscription.unsubscribe();
    }
    this.tweetList = []
  }

  getFavoriteTweets(userId: number): void {
    this.tweetsService.getFavoriteTweets(userId);
  }

  openTweetComments(content: any, tweet: ListaInterface) {
    this.modalService.dismissAll();
    this.tweetToComment = tweet;
    this.getCommentTweets(tweet.tweet_id)
    this.modalService.open(content, { windowClass: "tweetModal" });

  }

  postComment(ev: Event) {
    ev.preventDefault();
    if (this.commentText != '') {
      const tweetData = { nuevoTweet: this.commentText, userID: this.loggedInUser.user_id, tweet_id: this.tweetToComment.tweet_id };

      this.tweetsService.postComment(tweetData, this.tweetToComment.tweet_id).subscribe(
        (res) => {
          this.getCommentTweets(this.tweetToComment.tweet_id)
          this.getTweets()
          this.commentText = '';

        }
      )
    }
  }
  closeModal() {
    this.modalService.dismissAll()
  }

  checkLikes(tweet_id: string): boolean {
    if (this.likedTweets) {
      for (const likedTweetId of this.likedTweets) {
        if (likedTweetId === tweet_id) {
          return true; 
        }
      }
    }
    return false; 
  }
  
}
