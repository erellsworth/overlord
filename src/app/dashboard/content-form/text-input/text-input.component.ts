import { Component, computed, input } from '@angular/core';
import { OverlordField } from '../../../../../interfaces/overlord.config';
import { FloatLabel } from 'primeng/floatlabel';
import { ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../form.service';

@Component({
  selector: 'app-text-input',
  imports: [FloatLabel, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
})
export class TextInputComponent {
  public field = input.required<OverlordField>();
  public groupName = computed(() => this.field().group || 'metaData');

  constructor(private formService: FormService) {}

  public get formGroup() {
    return this.formService.form();
  }
}
