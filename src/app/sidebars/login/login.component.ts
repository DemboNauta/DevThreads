import { Component, EventEmitter, inject, Output, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/authentication.service';
import { DataService } from '../../services/user-data.service';
import { User } from '../../main/interfaces/user.interface';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [NgbModalConfig, NgbModal],
})
export class LoginComponent {
	
	// @Output()
	// nombreCambiado: EventEmitter<string>= new EventEmitter<string>;

	user: User = {};

  constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
		private authService: AuthService,
		private dataService: DataService
	) {
		config.backdrop = 'static';
		config.keyboard = false;
	}

	open(content: any) {
		this.modalService.open(content);
	}

	login(): void {
		const username = (document.getElementById('username') as HTMLInputElement).value;
		const password = (document.getElementById('password') as HTMLInputElement).value;

		this.authService.login(username, password).subscribe({
		  next: (response) => {
			console.log('Validación de inicio de sesión:', response);
			if(response.success){
				this.user=response.user;
				this.dataService.setLoggedInUser(this.user);
				this.modalService.dismissAll();
				

			}
		  },
		  error: (error) => {
			console.error('Error en el inicio de sesión', error);
		  }
		});
	}
}
