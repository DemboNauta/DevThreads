import { Component, ViewEncapsulation } from '@angular/core';
import { MainComponent } from '../main/main.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { User } from '../main/interfaces/user.interface';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-sidebars',
  standalone: true,
  templateUrl: './sidebars.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MainComponent, LoginComponent, UserProfileComponent, RouterOutlet, RouterLink],
  styleUrl: './sidebars.component.css'
})
export class SidebarsComponent {
  contenidoMostrado: string = 'main';
  loggedInUser: User;


  constructor(private userDataService: UserDataService, private modalService: NgbModal){

  }
  onNavigate(feature: string){
    this.contenidoMostrado=feature;
  }
  closeModal(){
    this.modalService.dismissAll()
  }

ngOnInit(): void {
  this.userDataService.loggedInUser.subscribe(
    (user: User) =>{
      this.loggedInUser=user;
    }
  )
  
}



onSearchModal(content: any) {
  this.modalService.dismissAll();
  this.modalService.open(content, {windowClass: "searchModal"});
  
}
  
}
