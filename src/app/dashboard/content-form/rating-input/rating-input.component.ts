import { Component } from '@angular/core';
import { Rating } from 'primeng/rating';
import { AbstractInputComponent } from '../abstract-input/abstract-input.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-rating-input',
  imports: [Rating, ReactiveFormsModule],
  templateUrl: './rating-input.component.html',
  styleUrl: './rating-input.component.scss',
})
export class RatingInputComponent extends AbstractInputComponent {}
