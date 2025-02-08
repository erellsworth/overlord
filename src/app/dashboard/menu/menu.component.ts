import { Component, computed, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { ContentService } from '../../services/content.service';
import { ConfigService } from '@services/config.service';

@Component({
  selector: 'app-menu',
  imports: [AvatarModule, MenubarModule],
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

  constructor(
    private config: ConfigService,
    private contentService: ContentService,
  ) {}

  public get version(): string {
    return this.config.version();
  }
}
