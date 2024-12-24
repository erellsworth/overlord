import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { AbstractInputComponent } from '../abstract-input/abstract-input.component';

@Component({
  selector: 'app-string-input',
  imports: [FloatLabel, InputTextModule, ReactiveFormsModule],
  templateUrl: './string-input.component.html',
  styleUrl: './string-input.component.scss',
})
export class StringInputComponent extends AbstractInputComponent {}
