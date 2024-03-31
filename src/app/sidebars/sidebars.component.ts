import { Component } from '@angular/core';
import { MainComponent } from '../main/main.component';



@Component({
  selector: 'app-sidebars',
  standalone: true,
  templateUrl: './sidebars.component.html',
  imports: [MainComponent],
  styleUrl: './sidebars.component.css'
})
export class SidebarsComponent {

}
