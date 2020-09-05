import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Content, ContentTypes } from '../../interfaces/content';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../../services/user.service';
import { PhoenicianData } from '../ui/phoenician/phoenician.interface';

@Component({
  selector: 'app-content-editor',
  templateUrl: './content-editor.component.html',
  styleUrls: ['./content-editor.component.scss']
})
export class ContentEditorComponent implements OnInit {

  @Input() content: Content;
  @Input() type: ContentTypes = 'post';
  @Input() label: string = "New Post";

  @Output() onSave: EventEmitter<Content> = new EventEmitter();

  public isNew: boolean = false;

  constructor(
    private fireStore: AngularFirestore,
    private user: UserService
  ) { }

  async ngOnInit(): Promise<void> {

    if (!this.content) {
      this.isNew = true;
      this.content = {
        id: this.fireStore.createId(),
        title: '',
        slug: '',
        type: this.type,
        status: 'draft',
        authorId: await this.user.getId(),
        data: {
          html: '',
          text: '',
          content: {}
        }
      };
    }
  }

  public contentUpdated(data: PhoenicianData) {
    this.content.data = data;
  }

  public statusChange(event: any) {
    this.content.status = event.value;
  }

  public save() {
    this.onSave.emit(this.content);
  }
}
