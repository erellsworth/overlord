import { Component, computed, input } from '@angular/core';
import { OverlordField } from '../../../../../interfaces/overlord.config';
import { FormService } from '../../form.service';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-string-input',
  imports: [FloatLabel, InputTextModule, ReactiveFormsModule],
  templateUrl: './string-input.component.html',
  styleUrl: './string-input.component.scss',
})
export class StringInputComponent {
  public field = input.required<OverlordField>();
  public groupName = computed(() => this.field().group || 'metaData');

  constructor(private formService: FormService) {}

  public get formGroup() {
    return this.formService.form();
  }
}
