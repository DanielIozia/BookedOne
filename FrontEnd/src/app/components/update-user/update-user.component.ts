import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user/User';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateUserComponent {

  isDisabledName = true;
  isDisabledSurname = true;
  isDisabledPassword = true;

  constructor(
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public user: User,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.user.firstName = this.authService.getFirstName() || '';
    this.user.lastName = this.authService.getLastName() || '';
  }

  toggleEditName(): void {
    this.isDisabledName = !this.isDisabledName;
    if (this.isDisabledName === false) {
      this.update();
    }
  }

  toggleEditSurname(): void {
    this.isDisabledSurname = !this.isDisabledSurname;
    if (this.isDisabledSurname === false) {
      this.update();
    }
  }

  toggleEditPassword(): void {
    this.isDisabledPassword = !this.isDisabledPassword;
    if (this.isDisabledPassword === false) {
      this.update();
    }
  }

  update(): void {
    console.log('User data updated:', this.user);
  }
}
