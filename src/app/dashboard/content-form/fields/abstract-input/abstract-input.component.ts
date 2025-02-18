import { Component, computed, input } from '@angular/core';
import { OverlordField } from '@overlord/types';
import { FormService } from '../../../form.service';

@Component({
  selector: 'app-abstract-input',
  templateUrl: './abstract-input.component.html',
})
export class AbstractInputComponent {
  public field = input.required<OverlordField>();
  public groupName = computed(() => this.field().group || 'metaData');

  constructor(private formService: FormService) {}

  public get formGroup() {
    return this.formService.form();
  }
}
