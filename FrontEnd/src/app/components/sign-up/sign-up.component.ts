import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user/User';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  registerForm:FormGroup = new FormGroup({});
  errorMessage: string | null = null;
  navigateTo:string = '';
  isLoading:boolean = false;

  constructor(private authService:AuthService, private userService:UserService,private fb: FormBuilder, private router:Router){
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      ruolo: ['', [Validators.required]]
    });
  }

  onSubmit(){ 
    this.isLoading = true;

    if (this.registerForm.valid) {

     if(this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value){
      this.errorMessage = "Le password non corrispondono";
      return;
     }

     let ruolo: "customer" | "seller" = this.registerForm.get('ruolo')!.value == "cliente" ? "customer" : "seller";


     let newUser:User = {
      firstName: this.registerForm.get('firstName')!.value,
      lastName: this.registerForm.get('lastName')!.value,
      email: this.registerForm.get('email')!.value,
      password:this.registerForm.get('password')!.value,
      role: ruolo
     }


     this.userService.register(newUser).subscribe( (data:User) => {
      console.log("Utente registrato:\n", data);
      this.isLoading = false;
      
      this.authService.login(data.token!, data.email, data.id!, data.firstName, data.lastName, data.role);
      this.router.navigate([`${data.role}`]);


     }, (error:HttpErrorResponse) => {
      this.errorMessage = error.error.title;
      this.isLoading = false;
     }
    )

    

    }
  }
}