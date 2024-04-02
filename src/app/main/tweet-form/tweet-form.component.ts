import { Component} from '@angular/core';
import { TweetsUploadService } from '../../services/tweet-upload.service';
import { FormsModule } from '@angular/forms';
import { TweetEventService } from '../../services/tweet-event.service';
import { ListaInterface } from '../interfaces/lista.interface';



@Component({
  selector: 'app-tweet-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tweet-form.component.html',
  styleUrl: './tweet-form.component.css'
})



export class TweetFormComponent {
  
  constructor(private tweetsUploadService: TweetsUploadService, private tweetEventService: TweetEventService) { }

  numCar: number = 0;
  estiloBorde:string = "";
  colorCar: string = "white";

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
    if(this.contenidoTweet!=''){
      const tweetData = { nuevoTweet: this.contenidoTweet };

      console.log(tweetData);
       this.tweetsUploadService.postTweet(tweetData).subscribe({
         next: (tweet: any)=>{
           console.log('Tweet subido correctamente');
           this.tweetEventService.emitTweetAdded(tweet);
           this.contenidoTweet= '';
         },
         error: (err)=>{
           console.log("Error al subir el tweet", err);
         }
       });
    }
    
  }
}
