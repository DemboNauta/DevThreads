import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/authentication.service';
import { UserDataService } from '../../services/user-data.service';
import { User } from '../../main/interfaces/user.interface';
import { RegisterUserService } from '../../services/register-user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecuperarContrasenaComponent } from './recuperar-contrasena/recuperar-contrasena.component';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RecuperarContrasenaComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [NgbModalConfig, NgbModal],
})
export class LoginComponent implements OnInit{
	user: User;
	notificationMessage: string = '';
	notificacionVisible: boolean = false;
	loggedIn:boolean=false;
	errorLogin: string= " ";
	registerForm: FormGroup;
	errorUsuarioEmailMessage: string;
	errorUsuarioEmail: boolean;
	resetPassword: boolean= false;


  constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
		private authService: AuthService,
		private userDataService: UserDataService,
		private registerService: RegisterUserService,
		private fb: FormBuilder,
	) {
		config.backdrop = 'static';
		config.keyboard = false;

		this.registerForm = this.fb.group({
			userNameRegister: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			phoneNumber: ['', [Validators.pattern('[0-9]{9}')]],
			passwordRegister: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/)]],
			confirmPassword: ['', Validators.required],
			profileImage: ['']
		  }, { validator: this.passwordMatchValidator });
	}

	open(content: any) {
		this.resetPassword=false;
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

	  passwordMatchValidator(form: FormGroup) {
		return form.get('passwordRegister')?.value === form.get('confirmPassword')?.value
		  ? null : { mismatch: true };
	  }

	  ngOnInit(): void {
		this.autoLogin()
		this.userDataService.getLoggedInUser().subscribe(
			user=>{
				if(user){
					this.loggedIn=true;
					this.user=user
				}
			}
		)
		
		}
		
		autoLogin(){
			if(sessionStorage){
				const userData: User=JSON.parse(sessionStorage.getItem('userData'));
			if(!userData){
				return;
			}else{
				this.user=userData;
				this.userDataService.setLoggedInUser(this.user)
				this.loggedIn=true;
			}

			}
			
		}
		
		login(ev: Event): void {
			ev.preventDefault();
			const username = (document.getElementById('username') as HTMLInputElement).value;
			const password = (document.getElementById('password') as HTMLInputElement).value;
			
			this.authService.login(username, password).subscribe({
			next: (response) => {
				if(response.success){
					this.user=response.user;
			
					sessionStorage.setItem('userData', JSON.stringify(this.user))
					
					this.userDataService.setLoggedInUser(this.user);
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
		sessionStorage.removeItem('userData')
		this.notificationMessage= `Vuelve prontoo ${this.user.user_name}`;
		this.notificacionVisible=true;
		this.userDataService.setLoggedInUser(null)
		this.loggedIn=false;
		setTimeout(()=>{
			window.location.reload()
		}, 100)
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
	  
		if (this.registerForm.invalid) {
			// Marcar todos los controles como tocados para mostrar los mensajes de error
			this.registerForm.markAllAsTouched();
			return;
		}
	  
		const registerData = new FormData();
		const formValues = this.registerForm.value;
	  
		registerData.append('userName', formValues.userNameRegister);
		registerData.append('email', formValues.email);
		registerData.append('firstName', formValues.firstName);
		registerData.append('lastName', formValues.lastName);
		registerData.append('phoneNumber', formValues.phoneNumber);
		registerData.append('password', formValues.passwordRegister);
		registerData.append('confirmPassword', formValues.confirmPassword);
	  
		const profileImage = (document.getElementById('profileImage') as HTMLInputElement);
		let imageFile = profileImage?.files ? profileImage.files[0] : null;
	  
		if (!imageFile) {
			const defaultImagePath = '../../../../frontend/assets/img/Default.webp';
			fetch(defaultImagePath)
				.then(response => response.blob())
				.then(blob => {
					imageFile = new File([blob], 'Default.webp', { type: 'image/webp' });
					this.imageToBlob(imageFile, 200, 200)
						.then((blob) => {
							registerData.append('profileImage', blob);
							this.sendRegisterData(registerData);
						})
						.catch((error) => {
							console.error('Error al convertir la imagen en Blob:', error);
						});
				})
				.catch(error => {
					console.error('Error fetching default image:', error);
				});
		} else {
			this.imageToBlob(imageFile, 200, 200)
				.then((blob) => {
					registerData.append('profileImage', blob);
					this.sendRegisterData(registerData);
				})
				.catch((error) => {
					console.error('Error al convertir la imagen en Blob:', error);
				});
		}
	}
	
	sendRegisterData(registerData: FormData): void {
		this.registerService.registerUser(registerData).subscribe({
			next: (response) => {
				if (response.success) {
					this.modalService.dismissAll();
					// Manejar el éxito del registro (por ejemplo, mostrar un mensaje de éxito)
				} else {
					// Manejar el error del registro (por ejemplo, mostrar un mensaje de error)
					console.error('Error en el registro de usuario:', response.message);
					this.errorUsuarioEmailMessage = response.message;
					this.errorUsuarioEmail = true;
				}
			},
			error: (error) => {
				console.error('Error en el registro de usuario', error);
			}
		});
	}
	

	onResetPassword(){
		this.resetPassword = !this.resetPassword;
	}
	
}
