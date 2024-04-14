import { Component, Input, AfterContentInit, OnDestroy } from '@angular/core';
import { User } from '../../main/interfaces/user.interface';
import { ListaTweetsComponent } from '../../main/lista-tweets/lista-tweets.component';
import { UserDataService } from '../../services/user-data.service';
import { Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ListaTweetsComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements AfterContentInit, OnDestroy{

loggedInUser : User;
userDataSubscription: Subscription;

constructor(private userDataService: UserDataService, private router : Router){}

  ngOnInit(): void {
    this.userDataSubscription= this.userDataService.loggedInUser.subscribe(
      (user: User) =>{
        this.loggedInUser=user;
      }
    )
   
    if(!this.loggedInUser){
      this.router.navigate(['/main'])
    }
  }
  ngAfterContentInit(): void {
    if(this.loggedInUser != undefined){
      const dateString: string = this.loggedInUser.created_at;
      const dateObject: Date = new Date(dateString);
      const mes= ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      const formattedDate: string = `${dateObject.getDate()} de ${mes[dateObject.getMonth()]} del ${dateObject.getFullYear()}`;
      this.loggedInUser.created_at=formattedDate;
    }
    
    
  }

  ngOnDestroy(): void {
      this.userDataSubscription.unsubscribe();
  }


}
