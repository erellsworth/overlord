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

  private content: Content;
  private user: User;

  constructor(
    private store: ContentStore,
    private userService: UserService
  ) {
    this.userService.user.subscribe((user: User) => {
      this.user = user;
    });

    this.store.data.subscribe((content: Content[]) => {
      console.log('contents', content);
    });

  }

  ngOnInit(): void {

  }

  private prepareContent(): void {
    // if (!this.content && this.user) {
    //   this.content = {
    //     id: this.store.createId(),
    //     title: '',
    //     slug: '',
    //     type: 'post',
    //     authorId: this.user.uid
    //   }
    // }
  }

  /**
   * contentUpdated
   */
  public contentUpdated(data: PhoenicianData) {
    this.prepareContent();
    this.content.data = data;
  }

  public save(content: Content) {
    console.log('save', content);
    // this.store.collection()
    // this.store.save<Content>('content', this.content);
  }
}
