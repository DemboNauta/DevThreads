import { Component, ViewChild, ElementRef } from '@angular/core';
import {ListaTweetsComponent} from './lista-tweets/lista-tweets.component';
import {TweetFormComponent} from './tweet-form/tweet-form.component';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  imports: [ListaTweetsComponent,TweetFormComponent],
  styleUrls: ['./main.component.css']
})
export class MainComponent{


}
