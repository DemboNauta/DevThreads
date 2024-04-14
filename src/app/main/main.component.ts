import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import {ListaTweetsComponent} from './lista-tweets/lista-tweets.component';
import {TweetFormComponent} from './tweet-form/tweet-form.component';
import { UserDataService } from "../services/user-data.service";
import { User } from './interfaces/user.interface';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  imports: [ListaTweetsComponent,TweetFormComponent],
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy{
  
  loggedInUser: User;
  userDataSubscription: Subscription;

  constructor(private userDataService: UserDataService) {

  }
  ngOnInit() {
    this.userDataSubscription= this.userDataService.loggedInUser.subscribe(
      (user: User) =>{
        this.loggedInUser=user;
      }
    )
  }
  ngOnDestroy(): void {
      this.userDataSubscription.unsubscribe();
  }

}
