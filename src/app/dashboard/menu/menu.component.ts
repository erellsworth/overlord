import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  public items: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/'
    },
    {
      label: 'Pages',
      routerLink: 'content/page'
    },
    {
      label: 'Posts',
      routerLink: 'content/post'
    }
  ];
}
