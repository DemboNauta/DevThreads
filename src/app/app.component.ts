import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarsComponent } from './sidebars/sidebars.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DevThreads';
}
