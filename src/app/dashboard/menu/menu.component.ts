import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ContentService } from '../../services/content.service';
import { firstValueFrom } from 'rxjs';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  public items: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/',
    },
  ];
  public ready = false;

  constructor(private content: ContentService) {}

  async ngOnInit(): Promise<void> {
    const result = await firstValueFrom(this.content.getContentTypes$());

    if (result.success) {
      result.data?.forEach((ct) =>
        this.items.push({
          label: ct.plural,
          routerLink: `content/${ct.slug}`,
        })
      );
    } else {
      console.error('Failed to get content types', result.error);
    }

    this.ready = true;
  }
}
