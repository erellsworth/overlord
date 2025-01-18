import { Component } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { ReactiveFormsModule } from '@angular/forms';
import { AbstractInputComponent } from '../abstract-input/abstract-input.component';

@Component({
  selector: 'app-text-input',
  imports: [FloatLabel, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
})
export class TextInputComponent extends AbstractInputComponent {}
