import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { User } from '../main/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { DirectMessagesService } from '../services/direct-messages.service';
import { DirectMessage } from '../main/interfaces/direct-message.interface';
import { DirectMessageUser } from '../main/interfaces/direct.message-user.interface';
import { UserSmall } from '../main/interfaces/userSmall.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mensajes-directos',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './mensajes-directos.component.html',
  styleUrl: './mensajes-directos.component.css'
})
export class MensajesDirectosComponent implements OnInit, AfterContentChecked {

  constructor(private userDataService: UserDataService, private directMessageService: DirectMessagesService, private cdr: ChangeDetectorRef) { }
  loggedInUser: User;
  userMessageConversations: DirectMessageUser[] = [];
  usersConversations: DirectMessage[] = [];
  userConversationDetail: UserSmall = {};
  mostrar: boolean = false;
  value: string = ""
  interval: any;
  conversationDetail: boolean = false

  searchedUsersArray: UserSmall[];

  buscaUsuarios: boolean = false;



  ngOnInit(): void {
    this.userDataService.loggedInUser.subscribe(
      (user: User) => {
        this.userMessageConversations = []
        this.mostrar = false;
        this.loggedInUser = user
      }
    );

    this.directMessageService.clickEvent$.subscribe((click)=>{
      this.mostrarMensajes()
    })
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges()

  }



  mostrarMensajes(): void {
    this.conversationDetail = false
    this.buscaUsuarios=false;

    this.mostrar = !this.mostrar;
    clearInterval(this.interval);
    this.directMessageService.getDirectMessages(this.loggedInUser.user_id).subscribe(
      (response) => {
        this.userMessageConversations = response
      }
    )


  }

  onLoadConversation(sender_id: number, sender_name: string, sender_image: string) {
    this.value='';
    this.buscaUsuarios=false;
    this.searchedUsersArray= [];

    this.userConversationDetail.user_name = sender_name;
    this.userConversationDetail.user_image = sender_image;
    this.userConversationDetail.user_id = sender_id

    this.directMessageService.getConversation(this.loggedInUser.user_id, sender_id).subscribe(
      (response) => {
        this.usersConversations = response
        this.conversationDetail = true;

        this.interval = setInterval(() => {
          this.directMessageService.getConversation(this.loggedInUser.user_id, sender_id).subscribe(
            (response) => {
              this.usersConversations = response
              this.conversationDetail = true;
            }
          );
        }, 1000)


      }
    )
  }
  onNuevaConversacion(){
    this.buscaUsuarios=true
  }

  onBuscaUsuarios(){
    if(this.value != ''){
      this.directMessageService.getUserByUsername(this.value).subscribe(
        res=>{
          this.searchedUsersArray=res;
          console.log(this.searchedUsersArray)

        }
      )

    }
    
  }

  onSentMessage() {
    if (this.value != "") {
      this.directMessageService.sentMessage(this.loggedInUser.user_id, this.userConversationDetail.user_id, this.value).subscribe(() => {
        this.directMessageService.getConversation(this.loggedInUser.user_id, this.userConversationDetail.user_id).subscribe(
          (response) => {
            this.usersConversations = response

            this.value = ""
          }
        )

      })
    }
  }

  onOutOfConversation() {
    clearInterval(this.interval);
    this.directMessageService.getDirectMessages(this.loggedInUser.user_id).subscribe(
      (response) => {
        this.userMessageConversations = response
        this.conversationDetail = false;
      }
    )
    
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
