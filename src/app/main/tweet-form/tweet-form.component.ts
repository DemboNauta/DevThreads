import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../../services/user-data.service';
import { User } from '../interfaces/user.interface'
import { Subscription } from 'rxjs';
import { TweetsService } from '../../services/tweets.service';





@Component({
  selector: 'app-tweet-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tweet-form.component.html',
  styleUrl: './tweet-form.component.css'
})



export class TweetFormComponent implements OnInit, OnDestroy {

  loggedInUser: User;





  constructor(private tweetsService: TweetsService, private userDataService: UserDataService) { }

  numCar: number = 0;
  estiloBorde: string = "";
  colorCar: string = "white";
  logged: string = "";
  userDataSubscription: Subscription;


  actualizaNumCar(e: Event): void {
    if (this.numCar <= 0) {
      this.numCar = 1;
    }
    const target = e.target as HTMLTextAreaElement;
    this.numCar = target.value.length;

    if (this.numCar >= 200) {
      this.colorCar = "red";
    } else if (this.numCar >= 100) {
      this.colorCar = "rgb(254, 201, 201)";
    } else {
      this.colorCar = "white";
    }

  }

  focusTextArea() {
    this.estiloBorde = "1px solid white";
  }
  blurTextArea() {
    this.estiloBorde = "1px solid transparent";
  }

  nuevoTweet: any = {};
  contenidoTweet: string = '';



  postTweet(ev: Event) {
    ev.preventDefault();

    if (this.loggedInUser) {
      if (this.contenidoTweet != '') {
        const tweetData = { nuevoTweet: this.contenidoTweet, userID: this.loggedInUser.user_id };

        this.tweetsService.postTweet(tweetData)
        this.contenidoTweet = '';
        this.numCar = 0;

      }
    }

  }
  ngOnInit(): void {
    if (!this.loggedInUser) {
      this.logged = "disabled";
    }

    this.userDataSubscription = this.userDataService.loggedInUser.subscribe(
      (user: User) => {
        this.loggedInUser = user;

        if (this.loggedInUser) {
          this.logged = "";
        }
      }
    )

  }

  ngOnDestroy(): void {

    this.userDataSubscription.unsubscribe();
  }

}

