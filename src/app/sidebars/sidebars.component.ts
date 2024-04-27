import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MainComponent } from '../main/main.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { User } from '../main/interfaces/user.interface';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TweetsService } from '../services/tweets.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaInterface } from '../main/interfaces/lista.interface';



@Component({
  selector: 'app-sidebars',
  standalone: true,
  templateUrl: './sidebars.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MainComponent, LoginComponent, UserProfileComponent, RouterOutlet, RouterLink, CommonModule, FormsModule],
  styleUrl: './sidebars.component.css'
})
export class SidebarsComponent implements AfterViewInit{
  contenidoMostrado: string = 'main';
  loggedInUser: User;
  @ViewChild('inputSearchRef') inputSearchRef: ElementRef;


  constructor(private userDataService: UserDataService, private modalService: NgbModal, private tweetsService: TweetsService){

  }
  onNavigate(feature: string){
    this.contenidoMostrado=feature;
  }
  closeModal(){
    this.modalService.dismissAll()
  }

  ngAfterViewInit() {
    this.inputSearchRef.nativeElement.focus();
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

  reloadTweets(){
    this.tweetsService.getTweets()
  }

  onSearchClick(search: string){
    if(search != ''){
      this.tweetsService.getSearch(search)
      this.modalService.dismissAll();
    }
    
  }
  
}
