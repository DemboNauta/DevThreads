import { Component } from '@angular/core';
import { MainComponent } from '../main/main.component';
import { LoginComponent } from './login/login.component';



@Component({
  selector: 'app-sidebars',
  standalone: true,
  templateUrl: './sidebars.component.html',
  imports: [MainComponent, LoginComponent],
  styleUrl: './sidebars.component.css'
})
export class SidebarsComponent {

}
