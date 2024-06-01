import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordResetService } from '../../../services/password-reset.service';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})
export class RecuperarContrasenaComponent {
  requestForm: FormGroup;
  resetForm: FormGroup;
  emailSent = false;
  tokenVerified = false;

  @Output() passwordChangeComplete = new EventEmitter<boolean>();


  constructor(private fb: FormBuilder, private passwordResetService: PasswordResetService) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetForm = this.fb.group({
      token: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  sendResetEmail() {
    if (this.requestForm.valid) {
      const email = this.requestForm.get('email')?.value;
      this.passwordResetService.sendResetEmail(email).subscribe(
        () => {
          this.emailSent = true;
        },
        (error) => {
          console.error('Error enviando el correo de restablecimiento', error);
        }
      );
    }
  }

  verifyResetToken() {
    if (this.resetForm.valid) {
      const token = this.resetForm.get('token')?.value;
      const newPassword = this.resetForm.get('newPassword')?.value;
      this.passwordResetService.verifyResetToken(token, newPassword).subscribe(
        () => {
          this.tokenVerified = true;
          this.passwordChangeComplete.emit(false)
        },
        (error) => {
          console.error('Error verificando el token', error);
        }
      );
    }
  }

}
