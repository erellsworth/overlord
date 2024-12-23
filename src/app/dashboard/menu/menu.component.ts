import { Component, computed, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ContentService } from '../../services/content.service';
import { firstValueFrom } from 'rxjs';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [MenubarModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  public items = computed(() => {
    const items: MenuItem[] = [
      {
        label: 'Home',
        routerLink: '/',
      },
      {
        label: 'Menu',
        routerLink: 'menu',
      },
    ];

    return items.concat(
      this.contentService.contentTypes().map((ct) => ({
        label: ct.plural,
        routerLink: `content/${ct.slug}`,
      })),
    );
  });

  constructor(private contentService: ContentService) {}
}
