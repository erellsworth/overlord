import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private router: Router,
    private user: UserService
  ) { }

  ngOnInit(): void {
  }

  public async logout() {
    await this.user.logout();
    this.router.navigate(['login']);
  }
}
