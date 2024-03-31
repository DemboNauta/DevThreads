import { Component, OnInit } from '@angular/core';
import { TweetsService } from '../../../services/tweets.service';
import { ListaInterface } from '../interfaces/lista.interface';

@Component({
  selector: 'app-lista-tweets',
  standalone: true,
  imports: [],
  templateUrl: './lista-tweets.component.html',
  styleUrl: './lista-tweets.component.css'
})
export class ListaTweetsComponent implements OnInit {
  tweetList: ListaInterface[] = [];

  constructor(private tweetsService: TweetsService) {}

  ngOnInit(): void {
    this.getTweets();
  }

  getTweets(){
    this.tweetsService.getTweets().subscribe({
      next: (result)=>{
        this.tweetList = result;
      },
      error: (err)=>{
        console.error('Error al obtener los tweets:', err);
      }
    })
  }
  // getTweets()({
  //   this.tweetsService.getTweets().subscribe({
  //   next: (tweets: any[]) => {
  //     this.tweets = tweets;
  //   },
  //   error: (error) => {
  //     console.error('Error al obtener los tweets:', error);
  //   }
  // });
}
