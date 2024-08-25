import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user/User';
import { LoginUser } from '../../interfaces/user/loginUser';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  loginForm: FormGroup;
  user:User = {} as User;
  errorMessage: string | null = null;
  isLoading:boolean = false;

  constructor(private userService:UserService, private router:Router, private fb: FormBuilder, private authService:AuthService){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }



  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      let userForm: LoginUser = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };
  
      this.userService.login(userForm).subscribe({
        next: (data) => {
          this.isLoading = false;
          this.authService.login(data.token!, data.email, data.id!, data.firstName, data.lastName, data.role);
          let navigateTo = data.role === 'customer' ? 'customer' : 'seller';
  
          this.router.navigate([`${navigateTo}`]);
        },
        error: (error: HttpErrorResponse) => {  // Modifica qui: specifica il tipo di errore
          this.isLoading = false;
          console.log(error);
          // Gestione dell'errore
          if (error.error && error.error.title) {
            this.errorMessage = error.error.title;  // Modifica qui: Salva il messaggio dell'errore
          } else {
            this.errorMessage = 'Errore scononosciuto.';  // Messaggio di errore generico
          }
        }
      });
    }
  }
}



