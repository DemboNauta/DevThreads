import { Component, EventEmitter, inject, Output, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/authentication.service';
import { DataService } from '../../services/user-data.service';
import { User } from '../../main/interfaces/user.interface';
import { RegisterUserService } from '../../services/register-user.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [NgbModalConfig, NgbModal],
})
export class LoginComponent {
	user: User = {};
	notificationMessage: string = '';
	notificacionVisible: boolean = false;



  constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
		private authService: AuthService,
		private dataService: DataService,
		private registerService: RegisterUserService
	) {
		config.backdrop = 'static';
		config.keyboard = false;
	}

	open(content: any) {
		this.modalService.dismissAll();
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
				this.notificacionVisible= true;
				this.notificationMessage = `Holaa ${this.user.user_name}!!`;

				this.modalService.dismissAll();
				

			}
		  },
		  error: (error) => {
			console.error('Error en el inicio de sesión', error);
		  }
		});
	}

	imageToBlob(blob:any): Promise<string>{
		return new Promise((resolve, reject) =>{
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend= () =>{
				let resultado= reader.result as string;
				resolve(resultado.split(',')[1] as string);
			};
		})
	}
	register(ev: Event): void {
		ev.preventDefault();
		const userNameRegister = (document.getElementById('userNameRegister') as HTMLInputElement).value;
		const email = (document.getElementById('email') as HTMLInputElement).value;
		const firstName = (document.getElementById('firstName') as HTMLInputElement).value;
		const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
		const phoneNumber = (document.getElementById('phoneNumber') as HTMLInputElement).value;
		const passwordRegister = (document.getElementById('passwordRegister') as HTMLInputElement).value;
		const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
		const profileImage = (document.getElementById('profileImage') as HTMLInputElement);
	
		const registerData = new FormData();
		registerData.append('userName', userNameRegister);
		registerData.append('email', email);
		registerData.append('firstName', firstName);
		registerData.append('lastName', lastName);
		registerData.append('phoneNumber', phoneNumber);
		registerData.append('password', passwordRegister);
		registerData.append('confirmPassword', confirmPassword);
		const imageFile = profileImage?.files ? profileImage.files[0] : null;
		if (imageFile) {
			this.imageToBlob(imageFile)
				.then((blob) => {
					console.log(blob);
					registerData.append('profileImage', blob);
	
					// Aquí va la lógica de registro dentro del then
					console.log('Datos de registro:', registerData);
					this.registerService.registerUser(registerData).subscribe({
						next: (response) => {
							console.log('Validación de registro:', response);
							if (response.success) {
								console.log("Usuario registrado correctamente");
								this.modalService.dismissAll();
							}
						},
						error: (error) => {
							console.error('Error en el registro de usuario', error);
						}
					});
				})
				.catch((error) => {
					console.error('Error al convertir la imagen en Blob:', error);
				});
		} else {
			console.warn('No se seleccionó ninguna imagen.');
		}
	}
}
