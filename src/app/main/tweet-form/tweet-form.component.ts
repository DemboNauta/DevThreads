import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { TweetsUploadService } from '../../services/tweet-upload.service';
import { FormsModule } from '@angular/forms';
import { TweetEventService } from '../../services/tweet-event.service';
import { UserDataService } from '../../services/user-data.service';
import {User} from '../interfaces/user.interface'
import { Data } from '@angular/router';
import { Subscription } from 'rxjs';





@Component({
  selector: 'app-tweet-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tweet-form.component.html',
  styleUrl: './tweet-form.component.css'
})



export class TweetFormComponent implements OnInit, OnDestroy{

  loggedInUser: User;




  
  constructor(private tweetsUploadService: TweetsUploadService, private tweetEventService: TweetEventService, private userDataService: UserDataService) { }

  numCar: number = 0;
  estiloBorde:string = "";
  colorCar: string = "white";
  logged:string= "";
  userDataSubscription: Subscription;


  actualizaNumCar(e: Event): void {
    if(this.numCar<=0){
      this.numCar=1;
    }
    const target = e.target as HTMLTextAreaElement;
    this.numCar = target.value.length;

    if(this.numCar>=200){
      this.colorCar="red";
    }else if(this.numCar>=100){
      this.colorCar="rgb(254, 201, 201)";
    }else{
      this.colorCar="white";
    }
    
  }

  focusTextArea(){
    this.estiloBorde = "1px solid white";
  }
  blurTextArea(){
    this.estiloBorde= "1px solid transparent";
  }

  nuevoTweet: any = {}; // Modelo para almacenar los datos del nuevo tweet
  contenidoTweet: string = ''; // Propiedad para almacenar el contenido del textarea



  postTweet(ev:Event){
    ev.preventDefault();

    if(this.loggedInUser){
      if(this.contenidoTweet!=''){
        const tweetData = { nuevoTweet: this.contenidoTweet, userID: this.loggedInUser.user_id};
  
         this.tweetsUploadService.postTweet(tweetData).subscribe({
           next: (tweet: any)=>{
             this.tweetEventService.emitTweetAdded(tweet);
             this.contenidoTweet= '';
             this.numCar=0;
           },
           error: (err)=>{
             console.log("Error al subir el tweet", err);
           }
         });
      }
    }
    
  }
  ngOnInit(): void {
    if(!this.loggedInUser){
      this.logged="disabled";
    }
    
    this.userDataSubscription= this.userDataService.loggedInUser.subscribe(
      (user: User) =>{
        this.loggedInUser=user;

        if(this.loggedInUser){
          this.logged="";
        }
      }
    )

  }

  ngOnDestroy(): void {
    
    this.userDataSubscription.unsubscribe();
  }

  }

