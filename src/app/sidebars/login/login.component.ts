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
	loggedIn:boolean=false;
	errorLogin: string= " ";


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
		const modalRef = this.modalService.open(content);
		modalRef.result.then(
		  () => {
			
			this.errorLogin = '';
		  },
		  () => {
	
			this.errorLogin = ''; 
		  }
		);
	  }

	login(ev: Event): void {
		ev.preventDefault();
		const username = (document.getElementById('username') as HTMLInputElement).value;
		const password = (document.getElementById('password') as HTMLInputElement).value;

		this.authService.login(username, password).subscribe({
		  next: (response) => {
			console.log('Validación de inicio de sesión:', response);
			if(response.success){
				this.user=response.user;
				this.dataService.setLoggedInUser(this.user);
				this.notificationMessage = `Holaa ${this.user.user_name}!!`;
				this.notificacionVisible= true;
				this.loggedIn=true;
				

				this.modalService.dismissAll();

				let notificacion=document.getElementById("notificacion");

			}else{
				this.errorLogin=response.message;
			}
		  },
		  error: (error) => {
			console.error('Error en el inicio de sesión', error);
		  }
		});
	}
	eliminarNotificacion():void{
		this.notificacionVisible=false;

	}
	cerrarSesion():void{
		this.notificationMessage= `Vuelve prontoo ${this.user.user_name}`;
		this.notificacionVisible=true;
		this.user={};
		this.dataService.setLoggedInUser(this.user);
		this.loggedIn=false;

	}

	imageToBlob(blob: any, maxWidth: number, maxHeight: number): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onload = () => {
				const img = new Image();
				img.src = reader.result as string;
				img.onload = () => {
					const canvas = document.createElement('canvas');
					const context = canvas.getContext('2d');
					let width = img.width;
					let height = img.height;
	
					
					if (width > height) {
						if (width > maxWidth) {
							height *= maxWidth / width;
							width = maxWidth;
						}
					} else {
						if (height > maxHeight) {
							width *= maxHeight / height;
							height = maxHeight;
						}
					}
	
					canvas.width = width;
					canvas.height = height;
					if (context) {
						context.drawImage(img, 0, 0, width, height);
						const base64String = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
						resolve(base64String);
					} else {
						reject(new Error('Error al obtener el contexto del lienzo'));
					}
				};
			};
			reader.onerror = (error) => {
				reject(error);
			};
		});
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
			this.imageToBlob(imageFile, 50, 50)
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
