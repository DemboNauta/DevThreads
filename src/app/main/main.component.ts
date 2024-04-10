import { Component, ViewChild, ElementRef } from '@angular/core';
import {ListaTweetsComponent} from './lista-tweets/lista-tweets.component';
import {TweetFormComponent} from './tweet-form/tweet-form.component';
import { DataService } from "../services/user-data.service";
import { User } from './interfaces/user.interface';


@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  imports: [ListaTweetsComponent,TweetFormComponent],
  styleUrls: ['./main.component.css']
})
export class MainComponent  {
  
  loggedInUser: User;

  constructor(private dataService: DataService) {

  }
  ngOnInit() {
    this.dataService.loggedInUser$.subscribe(user => {
      this.loggedInUser = user;
      if (this.loggedInUser && this.loggedInUser.user_name) {
        this.dataService.changeMessage(this.loggedInUser.user_name);
      }

    });
  }

}
