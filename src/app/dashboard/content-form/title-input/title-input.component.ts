import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContentForm } from '../content-form.interface';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription } from 'rxjs';
import { slugger } from '../../../../../api/utils/misc';

@Component({
  selector: 'app-title-input',
  standalone: true,
  imports: [
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule
  ],
  templateUrl: './title-input.component.html',
  styleUrl: './title-input.component.scss'
})
export class TitleInputComponent implements OnInit, OnDestroy {

  @Input({ required: true }) formGroup!: FormGroup<ContentForm>;

  private subs: Subscription[] = [];

  ngOnInit(): void {
    const titleControl = this.formGroup.get('title');
    if (titleControl) {
      const slugControl = this.formGroup.get('slug');
      this.subs.push(titleControl.valueChanges.subscribe(title => {
        if (slugControl?.enabled) {
          slugControl.setValue(slugger(title));
        }
      }));
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
