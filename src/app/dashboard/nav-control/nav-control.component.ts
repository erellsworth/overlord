import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { ContentService } from '../../services/content.service';
import { ListboxModule } from 'primeng/listbox';
import { DividerModule } from 'primeng/divider';
import { TreeModule } from 'primeng/tree';
import { NavMenuItem } from './nav-control.interface';
import { OverlordContentType } from '@overlord/types';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { faPlus, faRobot } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { TaxonomyService } from '../../services/taxonomy.service';
import { ConfirmationService, TreeDragDropService } from 'primeng/api';
import { DragDropModule } from 'primeng/dragdrop';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-nav-control',
  imports: [
    ButtonModule,
    ConfirmPopupModule,
    DividerModule,
    DragDropModule,
    FontAwesomeModule,
    FormsModule,
    InplaceModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputSwitchModule,
    InputTextModule,
    ListboxModule,
    TooltipModule,
    TreeModule,
  ],
  templateUrl: './nav-control.component.html',
  styleUrl: './nav-control.component.scss',
  providers: [ConfirmationService, TreeDragDropService],
})
export class NavControlComponent implements OnInit {
  public icons = {
    add: faPlus,
    autoGenerated: faRobot,
  };
  public menus: NavMenuItem[] = [];
  public pendingItem: NavMenuItem = {
    label: '',
    slug: '',
  };
  public pendingMenuName!: string;
  public selectedMenu!: string;
  public selectableItems: NavMenuItem[] = [];

  private draggingItem!: NavMenuItem | null;

  constructor(
    private confirmationService: ConfirmationService,
    private contentService: ContentService,
    private settings: SettingsService,
    private taxonomiesService: TaxonomyService,
  ) {}

  async ngOnInit(): Promise<void> {
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
        label: 'Home',
      },
      {
        label: 'Tags',
        isGenerated: true,
      },
    ];

    this.selectableItems = items
      .concat(
        this.taxonomiesService.taxonomies().map((tag) => {
          return {
            label: tag.name,
            slug: `tag/${tag.slug}`, //TODO: make these prefixes configurable
          };
        }),
      )
      .concat(
        this.contentTypes.map((ct) => {
          return {
            label: ct.plural as string,
            slug: `type/${ct.slug}`,
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

  public addItem() {
    if (this.selectedMenuObj) {
      this.selectedMenuObj.children?.push(this.pendingItem);

      this.pendingItem = {
        label: '',
        slug: '',
      };
    }
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

  public deleteMenu(event: Event, menu: NavMenuItem) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to delete ${menu.label}?`,
      accept: () => {
        this.menus = this.menus.filter((m) => m.label !== menu.label);
      },
    });
  }

  public dragEnd() {
    this.draggingItem = null;
  }

  public dragStart(item: NavMenuItem) {
    this.draggingItem = item;
  }

  public itemDropped() {
    if (this.draggingItem) {
      this.selectedMenuObj?.children?.push({
        ...this.draggingItem,
        ...{ droppable: !this.draggingItem.isGenerated },
      });
    }
  }

  public log() {
    console.log(this.selectedMenuObj);
  }

  public removeItem(node: any) {
    if (!this.selectedMenuObj) {
      return;
    }

    if (node.parent) {
      node.parent.children = node.parent.children.filter(
        (child: NavMenuItem) => child.label !== node.label,
      );
      return;
    }

    this.selectedMenuObj.children = this.selectedMenuObj?.children?.filter(
      (child) => child.label !== node.label,
    );
  }

  public async save() {
    const menus = [...this.menus];

    this.settings.saveSetting({
      name: 'menus',
      data: menus.map((menu) => this.cleanItems(menu)),
    });
  }

  private cleanItems(item: NavMenuItem) {
    const returnItem = { ...item };
    if (returnItem.children) {
      returnItem.children = returnItem.children.map((child) =>
        this.killParent(child),
      );
    }

    return returnItem;
  }

  private killParent(item: NavMenuItem) {
    const returnItem = { ...item };
    delete returnItem.parent;

    const hasChildrenWithParents = item.children?.find((child) => child.parent);

    if (hasChildrenWithParents) {
      returnItem.children = item.children?.map((child) => {
        return this.killParent(child);
      });
    }

    return returnItem;
  }
}
