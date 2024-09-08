import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user/User';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  registerForm: FormGroup;
  errorMessage: string | null = null;
  navigateTo: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService, 
    private userService: UserService, 
    private fb: FormBuilder, 
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, this.emailValidator]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      ruolo: ['', [Validators.required]]
    });
  }
  
  emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null; // Se il controllo è vuoto, non fa nulla (si aspetta la validazione dei campi obbligatori)
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(control.value);
    return isValid ? null : { invalidEmail: true };
  }



  onSubmit() {
    this.isLoading = true;

    if (this.registerForm.valid) {
      let p1 = this.registerForm.get('password')!.value;
      let p2 = this.registerForm.get('confirmPassword')!.value;
      if (p1 != p2) {
        this.errorMessage = "Le password non corrispondono";
        this.registerForm.get('password')?.setValue('');
        this.registerForm.get('confirmPassword')?.setValue('');
        this.isLoading = false;
        return;
      }

      let ruolo: "customer" | "seller" = this.registerForm.get('ruolo')!.value == "cliente" ? "customer" : "seller";

      let newUser: User = {
        firstName: this.registerForm.get('firstName')!.value,
        lastName: this.registerForm.get('lastName')!.value,
        email: this.registerForm.get('email')!.value,
        password: this.registerForm.get('password')!.value,
        role: ruolo
      }

      this.userService.register(newUser).subscribe((data: User) => {
        console.log("Utente registrato:\n", data);
        this.isLoading = false;

        this.authService.login(data.token!, data.email, data.id!, data.firstName, data.lastName, data.role);
        this.router.navigate([`${data.role}`]);

      }, (error: HttpErrorResponse) => {
        if(error.error.title == "Email già esistente"){
          this.registerForm.get('email')?.setValue('');
          this.registerForm.get('password')?.setValue('');
          this.registerForm.get('confirmPassword')?.setValue('');
        }
        
        this.errorMessage = error.error.title;

        this.isLoading = false;
      });

    } else {
      let p1 = this.registerForm.get('password')!.value;
      let p2 = this.registerForm.get('confirmPassword')!.value;

      if (this.registerForm.get('email')?.errors?.['invalidEmail']) {
        this.errorMessage = 'Email non valida';
      } 
      else if (p1 != p2) {
        this.errorMessage = 'Le password non corrispondono';
      }
      this.isLoading = false;
    }
  }
}
