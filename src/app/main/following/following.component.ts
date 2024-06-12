import { Component } from '@angular/core';
import { TweetFormComponent } from '../tweet-form/tweet-form.component';
import { UserDataService } from '../../services/user-data.service';
import { User } from '../interfaces/user.interface';
import { ListaTweetsComponent } from '../lista-tweets/lista-tweets.component';
import { UserProfileService } from '../../services/user-profile.service';
import { TweetsService } from '../../services/tweets.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [TweetFormComponent, ListaTweetsComponent, RouterOutlet, RouterLink],
  templateUrl: './following.component.html',
  styleUrl: './following.component.css'
})
export class FollowingComponent {
  constructor(private userDataService: UserDataService, private userProfileService: UserProfileService, public tweetService: TweetsService, private router: Router){}

  loggedInUser: User;
  followingList: number[];
  checkFollowing: boolean;

  ngOnInit(): void {
    this.userDataService.getLoggedInUser().subscribe(
      res=>{
        this.loggedInUser=res
        if(!this.loggedInUser){
          this.router.navigate(['main'])
        }
      }
    )

    this.tweetService.tweetListSubject.subscribe(
      (res)=>{
        if(res.length<=0){
          this.checkFollowing=false;
        }else{
          this.checkFollowing=true;
        }
      }
    )
  }

  
}
