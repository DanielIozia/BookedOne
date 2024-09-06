import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-logout',
  templateUrl: './dialog-logout.component.html',
  styleUrl: './dialog-logout.component.scss'
})
export class DialogLogoutComponent {

  constructor(public dialogRef: MatDialogRef<DialogLogoutComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true); // L'utente ha confermato il logout
  }

  onCancel(): void {
    this.dialogRef.close(false); // L'utente ha annullato il logout
  }

}