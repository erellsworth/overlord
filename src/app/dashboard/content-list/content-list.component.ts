import { Component, effect, input } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [
    ButtonModule,
    ConfirmPopupModule,
    FontAwesomeModule,
    PaginatorModule,
    RouterModule,
    ToastModule,
  ],
  templateUrl: './content-list.component.html',
  styleUrl: './content-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ContentListComponent {
  public contentType = input<string>();
  public icons = {
    create: faSquarePlus,
    delete: faTrashCan,
    edit: faPenToSquare,
  };
  public page = 1;

  constructor(
    private confirmationService: ConfirmationService,
    private contentService: ContentService,
    private messageService: MessageService,
  ) {
    effect(async () => {
      if (this.contentType()) {
        await this.contentService.fetchContentsByType(
          this.contentType() as string,
        );
      }
    });
  }

  public get contents() {
    return (
      this.contentService.contentLists()[this.contentType() as string]
        ?.contents || []
    );
  }

  public get total() {
    return (
      this.contentService.contentLists()[this.contentType() as string]?.total ||
      0
    );
  }

  public async delete(event: MouseEvent, id?: number): Promise<void> {
    if (!id) {
      return;
    }
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to delete this ${this.contentType()}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteContent(id);
      },
    });
  }

  public pageChanged(state: PaginatorState): void {
    if (state.page) {
      this.page = state.page;
      this.refreshContents();
    }
  }

  private async deleteContent(id: number): Promise<void> {
    const response = await this.contentService.deleteContent(id);

    if (response.success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Buh Bye',
        detail: `${this.contentType()} deleted`,
      });
      this.refreshContents();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Oh shit!',
        detail: response.error?.message,
      });
    }
  }

  private refreshContents(): void {
    this.contentService.fetchContentsByType(
      this.contentType() as string,
      this.page,
    );
  }
}
