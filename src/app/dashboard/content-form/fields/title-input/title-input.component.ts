import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription } from 'rxjs';
import { slugger } from '@app/utils';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faLock,
  faLockOpen,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonModule } from 'primeng/button';
import { FormService } from '../../../form.service';

@Component({
  selector: 'app-title-input',
  imports: [
    ButtonModule,
    FloatLabelModule,
    FontAwesomeModule,
    InputGroupModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './title-input.component.html',
  styleUrl: './title-input.component.scss',
})
export class TitleInputComponent implements OnInit, OnDestroy {
  public icons = {
    locked: faLock,
    unlocked: faLockOpen,
  };

  private subs: Subscription[] = [];

  constructor(private formService: FormService) {}

  ngOnInit(): void {
    const titleControl = this.formGroup.get('title');
    if (titleControl) {
      this.subs.push(
        titleControl.valueChanges.subscribe((title) => {
          if (this.slugControl?.enabled) {
            this.slugControl.setValue(slugger(title));
          }
        }),
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  public get formGroup() {
    return this.formService.form();
  }

  public get slugIcon(): IconDefinition {
    if (!this.slugControl) {
      return faLock;
    }
    return this.slugControl.disabled ? faLock : faLockOpen;
  }

  public get slugControl() {
    return this.formGroup.get('slug');
  }

  public toggleSlugField(): void {
    if (this.slugControl) {
      this.slugControl.disabled
        ? this.slugControl.enable()
        : this.slugControl.disable();
    }
  }
}
