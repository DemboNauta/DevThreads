import { Component, OnDestroy } from '@angular/core';
import { User } from '../../main/interfaces/user.interface';
import { ListaTweetsComponent } from '../../main/lista-tweets/lista-tweets.component';
import { UserDataService } from '../../services/user-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserProfileService } from '../../services/user-profile.service';
import { TweetsService } from '../../services/tweets.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ListaTweetsComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements  OnDestroy{

loggedInUser : User;
userDataSubscription: Subscription;
fechaUnion: string;
username: string;

constructor(private userDataService: UserDataService, private router : Router, private userProfileService: UserProfileService, private activatedRoute: ActivatedRoute, private tweetsService: TweetsService){}

  ngOnInit(): void {
    this.username=this.activatedRoute.snapshot.params['username'];
    this.tweetsService.username=this.username;
    this.userDataSubscription= this.userDataService.loggedInUser.subscribe(
      (user: User) =>{
        this.loggedInUser=user;
        
        
        this.userProfileService.setUserId(this.loggedInUser.user_id);
      }
    )
    
    const dateString: string = this.loggedInUser.created_at;
    const dateObject: Date = new Date(dateString);

    const mes= ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio','Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    this.fechaUnion= `${dateObject.getDate()} de ${mes[dateObject.getMonth()]} del ${dateObject.getFullYear()}`;
    
  }


  ngOnDestroy(): void {
      this.userDataSubscription.unsubscribe();
      this.tweetsService.username=null;

  }


}
