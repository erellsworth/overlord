import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PhoenicianData } from '../../components/ui/phoenician/phoenician.interface';
import { Content } from '../../interfaces/content';
import { User } from '../../interfaces/user';
import { ContentStore } from '../../commissary/content-store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public contentList: Content[] = [];

  constructor(
    private store: ContentStore
  ) {
    this.store.data.subscribe((contents: Content[]) => {
      this.contentList = contents;
    });

  }

  ngOnInit(): void { }

  public save(content: Content) {
    this.store.add(content);
  }
}
