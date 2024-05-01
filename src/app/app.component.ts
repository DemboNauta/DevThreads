import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarsComponent } from './sidebars/sidebars.component';
import { MensajesDirectosComponent } from './mensajes-directos/mensajes-directos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarsComponent, MensajesDirectosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DevThreads';
  private shouldClearLocalStorage = true;

 

  @HostListener("window:onbeforeunload",["$event"])
    clearLocalStorage(event){
        localStorage.clear();
    }
}