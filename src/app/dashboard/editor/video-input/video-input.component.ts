import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-video-input',
  standalone: true,
  imports: [
    ButtonModule,
    DividerModule,
    FontAwesomeModule,
    FormsModule,
    FloatLabelModule,
    InputTextModule
  ],
  templateUrl: './video-input.component.html',
  styleUrl: './video-input.component.scss'
})
export class VideoInputComponent {

  public icon = faFileImport;
  public url!: string;

  constructor(private ref: DynamicDialogRef) {

  }

  public close(): void {
    /**
     * Right now only the YouTube embed url will work
     * For example: 
     * This works - https://www.youtube.com/embed/t2c-X8HiBng?si=lYMLunJosGi_Vqe1
     * This doesn't - https://youtu.be/t2c-X8HiBng?si=XcPBUcvU1gVWJzWb
     * The url that doesn't work is the one that YouTube fist gives you when you click on the "Share" button
     * TODO: parse youtu.be short links to transform them into embed links
     */
    this.ref.close(this.url);
  }

}
