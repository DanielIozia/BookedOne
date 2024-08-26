import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user/User';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  constructor(private userService:UserService, private auth:AuthService){}


  user:User = {} as User
  isLoading:boolean = false;

  loadUser(){
    return this.userService.profile(this.auth.getToken()!).subscribe( (user:User) => {
      this.isLoading = false;
      this.user = user
    })
  }

  ngOnInit(): void {
      this.isLoading = true;
      this.loadUser();
  }

  update(){}

  delete(){}

}
