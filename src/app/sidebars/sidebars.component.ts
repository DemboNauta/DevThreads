import { Component } from '@angular/core';
import { MainComponent } from '../main/main.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { User } from '../main/interfaces/user.interface';



@Component({
  selector: 'app-sidebars',
  standalone: true,
  templateUrl: './sidebars.component.html',
  imports: [MainComponent, LoginComponent, UserProfileComponent],
  styleUrl: './sidebars.component.css'
})
export class SidebarsComponent {
  contenidoMostrado: string = 'main';
  loggedInUser: User;

  onNavigate(feature: string){
    this.contenidoMostrado=feature;
  }


  setLoggedInUser(user: User){
    this.loggedInUser=user;
    
  }
}
