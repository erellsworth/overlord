import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { ContentService } from '../../services/content.service';
import { ListboxModule } from 'primeng/listbox';
import { DividerModule } from 'primeng/divider';
import { TreeModule } from 'primeng/tree';
import { NavMenuItem } from './nav-control.interface';
import { OverlordContentType } from '../../../../interfaces/overlord.config';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { TaxonomyService } from '../../services/taxonomy.service';
import { TreeDragDropService } from 'primeng/api';
import { DragDropModule } from 'primeng/dragdrop';

@Component({
  selector: 'app-nav-control',
  standalone: true,
  imports: [
    ButtonModule,
    DividerModule,
    DragDropModule,
    FontAwesomeModule,
    FormsModule,
    InputGroupAddonModule,
    InputGroupModule,
    ListboxModule,
    TreeModule,
  ],
  templateUrl: './nav-control.component.html',
  styleUrl: './nav-control.component.scss',
  providers: [TreeDragDropService],
})
export class NavControlComponent implements OnInit {
  public icons = {
    add: faPlus,
  };
  public menus: NavMenuItem[] = [];
  public pendingMenuName!: string;
  public selectedMenu!: string;
  public selectableItems: NavMenuItem[] = [];

  private draggingItem!: NavMenuItem | null;

  constructor(
    private contentService: ContentService,
    private settings: SettingsService,
    private taxonomiesService: TaxonomyService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.contentService.fetchContentTypes();
    await this.taxonomiesService.fetchTaxonomies();

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

    let items: NavMenuItem[] = [
      {
        label: 'Tags',
        children: this.taxonomiesService.taxonomies().map((tag) => {
          return {
            label: tag.name,
          };
        }),
      },
    ];

    this.selectableItems = items.concat(
      this.contentTypes.map((ct) => {
        return {
          label: ct.plural as string,
        };
      }),
    );
  }

  public get contentTypes(): OverlordContentType[] {
    return this.contentService.contentTypes();
  }

  public get defaultMenus(): NavMenuItem[] {
    return [
      {
        label: 'Top Nav',
        children: [],
      },
    ];
  }

  public get selectedMenuObj() {
    return this.menus.find(
      (menu) => menu.label.toLowerCase() === this.selectedMenu?.toLowerCase(),
    );
  }

  public addMenu() {
    //TODO: Add validation to prevent duplicate menu names
    this.menus = [
      ...this.menus,
      {
        label: this.pendingMenuName,
        children: [],
      },
    ];
    this.selectedMenu = this.pendingMenuName;
    this.pendingMenuName = '';
  }

  public dragEnd() {
    this.draggingItem = null;
  }

  public dragStart(item: NavMenuItem) {
    this.draggingItem = item;
  }

  public itemDropped() {
    if (this.draggingItem) {
      console.log('item', this.draggingItem);
      this.selectedMenuObj?.children?.push({ ...this.draggingItem });
    }
  }

  public removeItem(node: any) {
    console.log('node', node);
  }

  public removeMenu(menu: NavMenuItem) {
    console.log('remove', menu);
    this.menus = this.menus.filter((m) => m.label !== menu.label);
  }
}
