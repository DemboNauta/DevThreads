import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MainComponent } from '../main/main.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from '../main/user-profile/user-profile.component';
import { User } from '../main/interfaces/user.interface';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
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
export class SidebarsComponent {
  loggedInUser: User;
  @ViewChild('inputSearchRef') inputSearchRef: ElementRef;
  mostrarBotonOffcanvas= true;

  constructor(private userDataService: UserDataService, private modalService: NgbModal, private tweetsService: TweetsService, private offcanvas: NgbOffcanvas) {

  }

  closeModal() {
    this.modalService.dismissAll()
  }

  closeOffcanvas() {
    this.offcanvas.dismiss(); 
  }

  openCanvas(canvas){
    this.offcanvas.open(canvas)
  }


  ngOnInit(): void {
    this.userDataService.loggedInUser.subscribe(
      (user: User) => {
        this.loggedInUser = user;
      }
    )

  }
  toggleBotonOffcanvasVisibility() {
    this.mostrarBotonOffcanvas = !this.mostrarBotonOffcanvas;
  }


  onSearchModal(content: any) {
    this.modalService.dismissAll();

    this.modalService.open(content, { windowClass: "searchModal" });

  }

  reloadTweets() {
    this.tweetsService.getTweets()
  }

  onSearchClick(search: string) {
    if (search != '') {
      this.tweetsService.getSearch(search)
      this.modalService.dismissAll();
    }

  }

}
