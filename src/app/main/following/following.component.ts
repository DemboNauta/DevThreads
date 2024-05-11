import { Component } from '@angular/core';
import { TweetFormComponent } from '../tweet-form/tweet-form.component';
import { UserDataService } from '../../services/user-data.service';
import { User } from '../interfaces/user.interface';
import { ListaTweetsComponent } from '../lista-tweets/lista-tweets.component';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [TweetFormComponent, ListaTweetsComponent],
  templateUrl: './following.component.html',
  styleUrl: './following.component.css'
})
export class FollowingComponent {
  constructor(private userDataService: UserDataService, private userProfileService: UserProfileService){}

  loggedInUser: User;
  followingList: number[];

  ngOnInit(): void {
    this.userDataService.getLoggedInUser().subscribe(
      res=>{
        this.loggedInUser=res
      }
    )
  }

  
}
