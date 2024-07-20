import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContentForm } from '../content-form.interface';
import { InputGroupModule } from 'primeng/inputgroup';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription } from 'rxjs';
import { slugger } from '../../../../../api/utils/misc';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faLockOpen, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-title-input',
  standalone: true,
  imports: [
    ButtonModule,
    FloatLabelModule,
    FontAwesomeModule,
    InputGroupModule,
    InputTextModule,
    ReactiveFormsModule
  ],
  templateUrl: './title-input.component.html',
  styleUrl: './title-input.component.scss'
})
export class TitleInputComponent implements OnInit, OnDestroy {

  @Input({ required: true }) formGroup!: FormGroup<ContentForm>;

  public icons = {
    locked: faLock,
    unlocked: faLockOpen
  };

  private subs: Subscription[] = [];

  ngOnInit(): void {
    const titleControl = this.formGroup.get('title');
    if (titleControl) {
      this.subs.push(titleControl.valueChanges.subscribe(title => {
        if (this.slugControl?.enabled) {
          this.slugControl.setValue(slugger(title));
        }
      }));
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  public get slugIcon(): IconDefinition {
    if (!this.slugControl) { return faLock; }
    return this.slugControl.disabled ? faLock : faLockOpen;
  }

  private get slugControl() {
    return this.formGroup.get('slug');
  }

  public toggleSlugField(): void {
    if (this.slugControl) {
      this.slugControl.disabled ? this.slugControl.enable() : this.slugControl.disable();
    }
  }
}
