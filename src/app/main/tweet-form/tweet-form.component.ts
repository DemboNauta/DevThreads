import { Component, Input, OnInit} from '@angular/core';
import { TweetsUploadService } from '../../services/tweet-upload.service';
import { FormsModule } from '@angular/forms';
import { TweetEventService } from '../../services/tweet-event.service';
import { DataService } from '../../services/user-data.service';
import {User} from '../interfaces/user.interface'





@Component({
  selector: 'app-tweet-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tweet-form.component.html',
  styleUrl: './tweet-form.component.css'
})



export class TweetFormComponent implements OnInit{

  @Input() loggedInUser: User = {};



  username:string='UsuarioNoRegistrado';
  user_image: any;
  
  constructor(private tweetsUploadService: TweetsUploadService, private tweetEventService: TweetEventService, private dataService: DataService) { }

  numCar: number = 0;
  estiloBorde:string = "";
  colorCar: string = "white";
  logged:string= "";

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
  
        console.log(tweetData);
         this.tweetsUploadService.postTweet(tweetData).subscribe({
           next: (tweet: any)=>{
             console.log('Tweet subido correctamente');
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
      
    
    this.dataService.loggedInUser$.subscribe(user => {
      if (user) {
        this.setLoggedInUser(user);
      }

      if(!this.loggedInUser){
        this.logged="disabled";
      }
    });
  }

  setLoggedInUser(user: User): void {
    this.loggedInUser = user;
    this.username = user.user_name ?? 'UsuarioNoRegistrado';
    console.log(user);
    this.user_image=user.user_image;
    this.logged="";

  }
      
    
  }

