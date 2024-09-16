import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { SellerComponent } from './seller.component';
import { AuthService } from '../../services/auth/auth.service';
import { DialogLogoutComponent } from '../dialog-logout/dialog-logout.component';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 






// Mock per MatDialog
class MatDialogMock {
  open(component: any, config?: any) {
    return {
      afterClosed: () => of(true)  // Simula l'output della chiusura del dialog
    };
  }
}

// Mock per AuthService
class AuthServiceMock {
  logout() {
    // Simula il comportamento del metodo logout
    return of(null);
  }
}

// Mock per Router
class RouterMock {
  navigate() {
    // Simula il comportamento del metodo navigate
    return Promise.resolve(true);
  }
}

describe('SellerComponent', () => {
  let component: SellerComponent;
  let fixture: ComponentFixture<SellerComponent>;
  let authService: AuthService;
  let router: Router;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerComponent ],
      imports:[
        MatIconModule, 
        MatMenuModule,
        HttpClientTestingModule
    ],
      providers: [
        
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: Router, useClass: RouterMock },
        { provide: MatDialog, useClass: MatDialogMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]  
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout', () => {
    it('should open the DialogLogoutComponent dialog', () => {
      const dialogOpenSpy = spyOn(dialog, 'open').and.callThrough();
      component.logout();
      expect(dialogOpenSpy).toHaveBeenCalled();
      expect(dialogOpenSpy).toHaveBeenCalledWith(DialogLogoutComponent, {
        width: '300px',
        disableClose: true
      });
    });

    it('should log out the user and navigate to login if dialog is confirmed', () => {
      spyOn(dialog.open(DialogLogoutComponent, { width: '300px', disableClose: true }), 'afterClosed').and.returnValue(of(true));  // Simula la conferma nel dialog
      const authServiceLogoutSpy = spyOn(authService, 'logout').and.callThrough();
      const routerNavigateSpy = spyOn(router, 'navigate').and.callThrough();

      component.logout();

      expect(authServiceLogoutSpy).toHaveBeenCalled();
      expect(routerNavigateSpy).toHaveBeenCalledWith(['/login']);
    });

    it('should not log out the user if dialog is cancelled', () => {
      // Spy su dialog.open e configura il valore di ritorno di afterClosed
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(false));  // Simula il cancellamento del dialogo
      
      const dialogOpenSpy = spyOn(dialog, 'open').and.returnValue(dialogRefSpy);
      const authServiceLogoutSpy = spyOn(authService, 'logout');
      const routerNavigateSpy = spyOn(router, 'navigate');
    
      component.logout();
    
      // Verifica che dialog.open sia stato chiamato con i parametri giusti
      expect(dialogOpenSpy).toHaveBeenCalledWith(DialogLogoutComponent, {
        width: '300px',
        disableClose: true
      });
    
      // Verifica che authService.logout non sia stato chiamato
      expect(authServiceLogoutSpy).not.toHaveBeenCalled();
      
      // Verifica che router.navigate non sia stato chiamato
      expect(routerNavigateSpy).not.toHaveBeenCalled();
    });
    
    
  });
});
