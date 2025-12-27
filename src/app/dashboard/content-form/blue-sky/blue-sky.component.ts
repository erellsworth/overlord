import { Component, computed, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ATProService } from '@services/atpro.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { FormService } from '../../form.service';
import { DividerModule } from 'primeng/divider';
import { ConfigService } from '@services/config.service';
import { TooltipModule } from 'primeng/tooltip';
import { ContentInterface } from '@overlord/types';
import { ShareListComponent } from './share-list/share-list.component';

@Component({
  selector: 'app-blue-sky',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    DividerModule,
    FloatLabelModule,
    FormsModule,
    MessageModule,
    ShareListComponent,
    TextareaModule,
    ToastModule,
    TooltipModule,
  ],
  templateUrl: './blue-sky.component.html',
  styleUrl: './blue-sky.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class BlueSkyComponent {
  public content = input.required<ContentInterface>();
  public introText: string = '';
  public shared = output();
  public characterLimit = computed(() => {
    return 300 - this.permalink().length;
  });
  public permalink = computed(() => this.config.getPermalink(this.id()));

  private id = computed(() => this.content().id as number);

  constructor(
    private atPro: ATProService,
    private config: ConfigService,
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
