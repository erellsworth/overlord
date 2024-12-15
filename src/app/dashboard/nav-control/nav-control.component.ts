import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { ContentService } from '../../services/content.service';
import { PickListModule } from 'primeng/picklist';
import { ListboxModule } from 'primeng/listbox';
import { NavMenuItem } from './nav-control.interface';
import { OverlordContentType } from '../../../../interfaces/overlord.config';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav-control',
  standalone: true,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    FormsModule,
    InputGroupAddonModule,
    InputGroupModule,
    ListboxModule,
    PickListModule,
  ],
  templateUrl: './nav-control.component.html',
  styleUrl: './nav-control.component.scss',
})
export class NavControlComponent implements OnInit {
  public icons = {
    add: faPlus,
  };
  public menus: NavMenuItem[] = [];
  public pendingMenuName!: string;
  public selectedMenu!: string;

  constructor(
    private contentService: ContentService,
    private settings: SettingsService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.contentService.fetchContentTypes();

    const menuSettings = await this.settings.getSetting<NavMenuItem[]>(
      'menus',
      {
        name: 'menus',
        data: this.defaultMenus,
      },
    );

    if (menuSettings) {
      this.menus = menuSettings.data;
    }
  }

  public get contentTypes(): OverlordContentType[] {
    return this.contentService.contentTypes();
  }

  public get defaultMenus(): NavMenuItem[] {
    return [
      {
        label: 'Top Nav',
        items: [],
      },
    ];
  }

  public addMenu() {
    //TODO: Add validation to prevent duplicate menu names
    this.menus = [
      ...this.menus,
      {
        label: this.pendingMenuName,
        items: [],
      },
    ];
    this.selectedMenu = this.pendingMenuName;
    this.pendingMenuName = '';
  }

  public menuSelected() {
    console.log('selected', this.selectedMenu);
  }
}
