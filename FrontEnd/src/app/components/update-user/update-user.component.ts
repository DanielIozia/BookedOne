import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { merge } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user/User';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'], // Modificato 'styleUrl' in 'styleUrls'
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateUserComponent {
  
  constructor(
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User, private userService: UserService, private auth:AuthService) {}
  showErrorMessage: boolean = false;
  errorMessage: string | null = null;
  loading:boolean = false;


  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  isValidEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }


  onCancel(): void {
    this.showErrorMessage = false;
    this.dialogRef.close();
  }

  onUpdate(form: NgForm): void {
    this.loading = true;
    this.errorMessage = null;
  
    let updatedUser: User = {
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      role: this.data.role,  
      password: this.data.password,
      email: form.value.email,
    };
  
    if (!this.isValidEmail(updatedUser.email)) {
      this.loading = false;
      this.showErrorMessage = true;
      this.errorMessage = 'Invalid Email';
      console.error(this.errorMessage);
      return;
    }
  
    if (form.valid) {
      this.showErrorMessage = false;
      this.userService.update(this.auth.getToken()!,updatedUser).subscribe(
        (data: User) => {
          this.loading = false;
          this.dialogRef.close(form.value);
        },
        error => {
          this.loading = false;
          this.showErrorMessage = true;
          this.resetFormControl(form, 'email');
          this.errorMessage = 'Email già in uso o non valida';
        }
      );
    } else {
      this.loading = false;
      this.showErrorMessage = true;
      this.errorMessage = 'Il modulo non è valido';
      console.error(this.errorMessage);
    }
  }
  

  resetFormControl(form: NgForm, controlName: string): void {
    if (form.controls[controlName]) {
      form.controls[controlName].reset();
    }
  }
}
