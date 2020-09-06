import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateTime } from "luxon";
import { Content, ContentTypes } from '../../interfaces/content';
import { PhoenicianData } from '../ui/phoenician/phoenician.interface';
import { PhoenicianComponent } from '../ui/phoenician/phoenician.component';
import { ContentStore } from '../../commissary/content-store';
import { ValidationResult } from '../../interfaces/app';
import { ErrorComponent } from '../ui/error/error.component';

@Component({
  selector: 'app-content-editor',
  templateUrl: './content-editor.component.html',
  styleUrls: ['./content-editor.component.scss']
})
export class ContentEditorComponent implements OnInit {

  @ViewChild(PhoenicianComponent, { static: false }) phoenician: PhoenicianComponent;

  @Input() content: Content;
  @Input() type: ContentTypes = 'post';
  @Input() label: string = "New Post";

  @Output() onSave: EventEmitter<Content> = new EventEmitter();

  public isNew: boolean = false;

  constructor(
    private store: ContentStore,
    private alert: MatSnackBar
  ) { }

  async ngOnInit(): Promise<void> {

    if (!this.content) {
      this.resetData();
    }
  }

  public contentUpdated(data: PhoenicianData) {
    this.content.data = data;
  }

  public statusChange(status: any) {

    if (status.value === 'published'
      && this.content.status === 'draft'
      && !this.content.publicationDate) {
      this.content.publicationDate = DateTime.local().toJSDate();
    }

    this.content.status = status.value;
  }

  public save() {
    this.content.modificationDate = DateTime.local().toJSDate();
    const validation = this.store.validate(this.content);
    if (validation.isValid) {
      this.onSave.emit(this.content);
    } else {
      this.alert.openFromComponent(ErrorComponent, {
        duration: 5000,
        data: {
          errors: validation.errors,
          close: () => { this.alert.dismiss() }
        }
      });
    }
  }

  public async resetData() {
    this.isNew = true;
    this.content = await this.store.createDraft(this.type);;
    if (this.phoenician) {
      this.phoenician.reset();
    }
  }
}
