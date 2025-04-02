import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserService} from "../../shared/services/userService/user.service";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true
})
export class SignupComponent {
  // user = {
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   password: '',
  //   role: 'USER',
  // };
  //
  // // constructor(private userService: UserService) {}
  //
  // onSignup() {
  //   // this.userService.signup(this.user).subscribe((response) => {
  //   //   console.log('User signed up', response);
  //   // });
  //   // 7ta n9adou l back b3da
  //   console.log('User Data:', this.user);
  // }
}
