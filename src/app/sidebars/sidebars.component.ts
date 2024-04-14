import { Component } from '@angular/core';
import { MainComponent } from '../main/main.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { User } from '../main/interfaces/user.interface';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserDataService } from '../services/user-data.service';



@Component({
  selector: 'app-sidebars',
  standalone: true,
  templateUrl: './sidebars.component.html',
  imports: [MainComponent, LoginComponent, UserProfileComponent, RouterOutlet, RouterLink],
  styleUrl: './sidebars.component.css'
})
export class SidebarsComponent {
  contenidoMostrado: string = 'main';
  loggedInUser: User;


  constructor(private userDataService: UserDataService){

  }
  onNavigate(feature: string){
    this.contenidoMostrado=feature;
  }

ngOnInit(): void {
  this.userDataService.loggedInUser.subscribe(
    (user: User) =>{
      this.loggedInUser=user;
    }
  )
  
}
  
}
