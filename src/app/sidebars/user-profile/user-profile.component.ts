import { Component, Input, AfterContentInit } from '@angular/core';
import { User } from '../../main/interfaces/user.interface';
import { ListaTweetsComponent } from '../../main/lista-tweets/lista-tweets.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ListaTweetsComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements AfterContentInit{

@Input() user! : User;


  ngAfterContentInit(): void {
    if(this.user != undefined){
      const dateString: string = this.user.created_at;
      const dateObject: Date = new Date(dateString);
      const mes= ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      const formattedDate: string = `${dateObject.getDate()} de ${mes[dateObject.getMonth()]} del ${dateObject.getFullYear()}`;
      this.user.created_at=formattedDate;
    }
    
    
  }
}
