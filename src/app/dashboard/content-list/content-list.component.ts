import { Component, input, OnDestroy, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEye,
  faEyeSlash,
  faPenToSquare,
  faTrashCan,
} from '@fortawesome/free-regular-svg-icons';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { ContentInterface } from '@overlord/types';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content-list',
  imports: [
    ButtonModule,
    ConfirmPopupModule,
    FontAwesomeModule,
    ProgressBarModule,
    PaginatorModule,
    RouterModule,
    ToastModule,
    TooltipModule,
  ],
  templateUrl: './content-list.component.html',
  styleUrl: './content-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ContentListComponent implements OnInit, OnDestroy {
  public contentType = input('', {
    transform: (value: string | undefined): string => value || 'all',
  });
  public icons = {
    create: faSquarePlus,
    delete: faTrashCan,
    edit: faPenToSquare,
    publish: faEyeSlash,
    unpublish: faEye,
  };
  public isLoading = false;
  public page = 1;
  public first = 0;

  private _subs: Subscription[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private contentService: ContentService,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this._subs.push(
      this.route.data.subscribe(async (data) => {
        const params = data.queryParams || {};
        this.isLoading = true;
        await this.contentService.fetchContentsByType(
          this.contentType() as string,
          this.page,
          params,
        );
        this.isLoading = false;
      }),
    );
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }

  public get contents() {
    return (
      this.contentService.contentLists()[this.contentType() as string]
        ?.contents || []
    );
  }

  public get createButtonRouterLink() {
    const type = this.contentType() === 'all' ? 'post' : this.contentType();
    return ['/', 'create', type];
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
    this.first = state.first ?? 0;
    this.page = state.page ? state.page + 1 : 1;
    this.refreshContents();
  }

  public async setStatus(
    content: ContentInterface,
    status: ContentInterface['status'],
  ): Promise<void> {
    const originalStatus = content.status;
    content.status = status;
    const response = await this.contentService.updateContent(content);

    if (response.success) {
      const summary = originalStatus === 'draft' ? 'Published' : 'Unpublished';
      this.messageService.add({
        severity: 'success',
        summary: `${content.type} ${summary}`,
      });
    } else {
      content.status = originalStatus;
      this.messageService.add({
        severity: 'error',
        summary: 'Oh shit!',
        detail: response.error?.message,
      });
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
