import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AtproResult } from '@interfaces/misc';
import { ATProService } from '@services/atpro.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { FormService } from '../../form.service';
import { ContentInterface } from '@interfaces/content';

@Component({
  selector: 'app-blue-sky',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    FloatLabelModule,
    FormsModule,
    TextareaModule,
    ToastModule,
  ],
  templateUrl: './blue-sky.component.html',
  styleUrl: './blue-sky.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class BlueSkyComponent {
  public id = input.required<number>();
  public introText!: string;

  public shared = output();

  constructor(
    private atPro: ATProService,
    private confirmationService: ConfirmationService,
    private formService: FormService,
  ) {}

  public confirm(event: MouseEvent) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Share link on Blue Sky with this text?',
      message: this.introText,
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.share(),
    });
  }

  public async share() {
    const result = await this.atPro.share(this.id(), this.introText);

    if (result) {
      this.formService.pushMetaData('atProShares', result);
      this.shared.emit();
    }
  }
}
