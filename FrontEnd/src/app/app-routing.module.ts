import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: SignInComponent },
  { path: 'register', component: SignUpComponent },
  { 
    path: 'home', component: HomeComponent, //canActivate:[AuthGuard], aggiungere la guardia dopo aver preparato il back
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
  },



  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '404', pathMatch: 'full' },

];

/**
 const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  
  
];
 */

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
