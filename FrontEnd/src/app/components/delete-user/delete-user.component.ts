import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { timingSafeEqual } from 'crypto';
import { Router } from '@angular/router';
import { AnyARecord } from 'dns';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  verifingEmail: boolean = false;
  verifingPassword: boolean = false;
  

  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    private userService: UserService,
    private authService: AuthService,
    private router:Router
  ) {}

  deleteAccount(): void {
    try{
     
      if(!this.onVerifyEmail()){
        this.errorMessage = "Email non valida";
        throw new Error("Email non valida");
      }

      if (this.password.length <= 0) {
        this.errorMessage = "Inserisci la password";
        throw new Error("Inserisci la password") 
      }

      if(this.email.length <= 0){
        this.errorMessage = "Inserisci l'email";
        throw new Error("Inserisci l'email");
      }
      this.onVerifyPassword();
    }
    catch(err:any){
      console.log(err);
    } 
  }

  onVerifyPassword(): boolean {
    this.verifingPassword = true;
    this.userService.verifyPassword(this.authService.getToken()!,this.password).subscribe ((data:boolean) =>{
      this.verifingPassword = false;
      if(data){
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
      }
    }, error => {
      this.verifingPassword = false;
      this.errorMessage = error.error.title;
    })
    return false;
  }

  onVerifyEmail():boolean{
    return this.email == this.authService.getEmail();
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
