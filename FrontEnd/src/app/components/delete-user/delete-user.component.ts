import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  emailErrorMessage: string = '';
  isLoading: boolean = false;
  verifingEmail: boolean = false;
  verifingPassword: boolean = false;
  
  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  
  // Funzione che verrà chiamata ogni volta che l'input email cambia
  // Funzione che controlla la validità dell'email
  checkEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(this.email)) {
      this.emailErrorMessage = ''; // Email valida
      return true;
    } else {
      this.emailErrorMessage = 'Email non valida'; // Email non valida
      return false;
    }
  }

  

  deleteAccount(): void {
    try {
      if (this.email.length <= 0) {
        this.emailErrorMessage = "Inserisci l'email";
        throw new Error("Inserisci l'email");
      }
  
      if (!this.onVerifyEmail() || !this.checkEmail()) {
        this.emailErrorMessage = "L'email non corrisponde a questo account";
        throw new Error("Email non valida");
      }
  
      if (this.password.length <= 0) {
        this.errorMessage = "Inserisci la password";
        throw new Error("Inserisci la password");
      }
      
      this.onVerifyPassword();
    } catch (err: any) {
      console.log(err);
    }
  }
  

  onVerifyPassword(): boolean {
    
    this.verifingPassword = true;
    this.userService.verifyPassword(this.authService.getToken()!, this.password).subscribe((data: boolean) => {
      this.verifingPassword = false;
      if (data) {
        this.isLoading = true;
        // Verifica dell'email e password e successiva eliminazione dell'account
        this.userService.delete(this.authService.getToken()!).subscribe(
          () => {
            this.isLoading = false;
            this.dialogRef.close(true);
          },
          error => {
            this.isLoading = false;
            this.errorMessage = error.error.message;
          }
        );
      } else {
        this.errorMessage = "Password errata";
      }
    }, error => {
      this.verifingPassword = false;
      this.errorMessage = error.error.title;
    });
    return false;
  }

  

  onVerifyEmail(): boolean {
    return this.email == this.authService.getEmail();
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
