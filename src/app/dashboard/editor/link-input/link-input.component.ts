import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { LinkConfig, LinkForm } from './link-input.interface';

@Component({
  selector: 'app-link-input',
  imports: [
    ButtonModule,
    DividerModule,
    FloatLabelModule,
    ToggleSwitchModule,
    ReactiveFormsModule,
  ],
  templateUrl: './link-input.component.html',
  styleUrl: './link-input.component.scss',
})
export class LinkInputComponent implements OnInit {
  public formGroup!: FormGroup<LinkForm>;

  constructor(
    private config: DynamicDialogConfig<LinkConfig>,
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
  ) {}

  ngOnInit(): void {
    const href: string = this.config.data?.href || '';
    const target: string = this.config.data?.target || '_blank';
    const className: string = this.config.data?.class || '';
    const rel: string = this.config.data?.rel || '';

    const formGroup: LinkForm = {
      href: this.fb.nonNullable.control(href, Validators.required),
      target: this.fb.nonNullable.control(target),
      class: this.fb.nonNullable.control(className),
      rel: this.fb.nonNullable.control(rel),
    };

    this.formGroup = this.fb.group(formGroup);
  }

  public insertLink(): void {
    this.ref.close(this.formGroup.value);
  }

  public removeLink(): void {
    this.ref.close();
  }
}
