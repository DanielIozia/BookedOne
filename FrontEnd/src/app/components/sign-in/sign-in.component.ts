import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

//interfaces
import { User } from '../../interfaces/user/User';
import { LoginUser } from '../../interfaces/user/loginUser';

//services
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  loginForm: FormGroup;
  user: User = {} as User;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, this.emailValidator]],
      password: ['', [Validators.required]]
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
    if (this.loginForm.valid) {
      this.isLoading = true;
      const userForm: LoginUser = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.userService.login(userForm).subscribe({
        next: (data:User) => {
          this.isLoading = false;
          this.authService.login(data.token!, data.email, data.id!, data.firstName, data.lastName, data.role);
          const navigateTo = data.role === 'customer' ? 'customer' : 'seller';
          this.router.navigate([`${navigateTo}`]);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          if (error.error && error.error.message) {
            this.errorMessage = "Credenziali non valide";
            this.loginForm.get('password')?.setValue('');

          } else {
            this.errorMessage = 'Errore sconosciuto.';
          }
        }
      });
    }
  }
}
