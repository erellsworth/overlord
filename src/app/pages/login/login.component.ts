import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private user: UserService
  ) { }

  ngOnInit(): void {
  }

  public async login() {
    await this.user.login();
    this.router.navigate(['dashboard']);
  }
}
