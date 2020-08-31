import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { PhoenicianData } from '../../components/ui/phoenician/phoenician.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private contentData: PhoenicianData;

  constructor(
    private router: Router,
    private user: UserService
  ) { }

  ngOnInit(): void {
  }

  /**
   * contentUpdated
   */
  public contentUpdated(data: PhoenicianData) {
    this.contentData = data;
  }

  public save() {
    console.log('save', this.contentData);
  }
}
