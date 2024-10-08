import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { Router } from '@angular/router';

//interfaces
import { User } from '../../interfaces/user/User';
import { updateUser } from '../../interfaces/user/updateUser';

//services
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateUserComponent {


  isLoading: boolean = false;
  isDisabledName = false;
  isDisabledSurname = false;
  isDisabledPassword = false;
  passwordIsVerified: boolean = false;
  isVerifingPassword: boolean = false;
  confirmPassword: string = '';
  newPassword: string = '';
  errorMessage: string | null = null;
  email: any;
  password: any;
  isFormVisible: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public user: User, // Dati passati tramite MAT_DIALOG_DATA
    private userService: UserService,
    public authService: AuthService,
    private dialog:MatDialog,
    private router:Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  // Carica i dati dell'utente usando il servizio di autenticazione
  loadUserData(): void {
    this.user.firstName = this.authService.getFirstName() || '';
    this.user.lastName = this.authService.getLastName() || '';
  }

  // Funzioni per abilitare/disabilitare i campi di input
  toggleEditName(): void {
    this.isDisabledName = !this.isDisabledName;
  }

  toggleEditLastName(): void {
    this.isDisabledSurname = !this.isDisabledSurname;
  }

  toggleEditPassword(): void {
    this.isDisabledPassword = !this.isDisabledPassword;
  }

  // Funzione per aggiornare i dati dell'utente
  update(): void {
    // Verifica se ci sono campi invalidi
    if (this.isAnyInputInvalid()) {
      return; // Non procedere se ci sono errori
    }

    this.isLoading = true;

    const form: updateUser = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      password: '', 
    };

    

    if(this.passwordIsVerified && this.newPassword != '' && this.newPassword != null) {
      form.password = this.newPassword; // Usa la nuova password solo se la vecchia è stata verificata
    }
    else{
      form.password = this.user.password;
    }

    // Esegui l'aggiornamento chiamando il servizio
    this.userService.update(this.authService.getToken()!, form).subscribe((data: User) => {
      this.isLoading = false;
      this.authService.login(this.authService.getToken()!, this.authService.getEmail()!, this.authService.getId()?.toString()!, data.firstName, data.lastName, this.authService.getRole()!);
      this.dialogRef.close(true); 
    }, error => {
      console.log("Errore durante l'aggiornamento");
      this.isLoading = false;
    });
  }

  // Funzione chiamata per annullare e chiudere il dialogo
  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Funzione per verificare se uno degli input è invalido
  isAnyInputInvalid(): boolean{
    return (
      !this.user.firstName ||  // Controllo che il nome non sia vuoto
      !this.user.lastName ||   // Controllo che il cognome non sia vuoto
      (this.confirmPassword !== this.newPassword)  // Verifica che la password di conferma corrisponda
    );
  }

  // Funzione per verificare la password corrente
  verifyPassword(pass: string): void {
    this.isVerifingPassword = true;
    this.errorMessage = null;
    this.userService.verifyPassword(this.authService.getToken()!, pass).subscribe(
      (isValid: boolean) => {
        this.isVerifingPassword = false;
        this.passwordIsVerified = isValid;
        this.errorMessage = isValid ? null : 'Password errata';
        this.cd.markForCheck();  // Forza il rilevamento delle modifiche
      },
      error => {
        this.isVerifingPassword = false;
        this.passwordIsVerified = false;
        this.errorMessage = error?.error?.title || 'Errore durante la verifica della password';
        this.cd.markForCheck();  // Forza il rilevamento delle modifiche
      }
    );
  }
  

  
  
  
  
   // Funzione per aprire il dialogo di eliminazione account
   deleteAccount(): void {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      width: '400px',
      data: { userId: this.user.id } // Passiamo dati opzionali se necessario
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close(true);
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
}

