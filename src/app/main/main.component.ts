import { Component, ViewChild, ElementRef } from '@angular/core';
import {ListaTweetsComponent} from './lista-tweets/lista-tweets.component';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  imports: [ListaTweetsComponent],
  styleUrls: ['./main.component.css']
})
export class MainComponent{
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

}
