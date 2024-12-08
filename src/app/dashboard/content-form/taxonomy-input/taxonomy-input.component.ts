import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {

  FormControl,
  FormGroup,
  FormsModule,
} from '@angular/forms';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { ChipModule } from 'primeng/chip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ContentForm } from '../content-form.interface';
import { TaxonomyService } from '../../../services/taxonomy.service';
import { TaxonomyInterface } from '../../../../../interfaces/taxonomy';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { slugger } from '../../../../../api/utils/misc';

@Component({
  selector: 'app-taxonomy-input',
  standalone: true,
  imports: [
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    ChipModule,
    CommonModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
  ],
  templateUrl: './taxonomy-input.component.html',
  styleUrl: './taxonomy-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxonomyInputComponent implements OnInit {
  @Input({ required: true }) formGroup!: FormGroup<ContentForm>;
  @ViewChild('tagSearch') tagSearch!: AutoComplete;

  public currentFilter = '';
  public selectedTag!: string;

  constructor(private taxonomyService: TaxonomyService) { }

  ngOnInit(): void {
    this.taxonomyService.fetchTaxonomies();
  }

  public get currentTaxonomies() {
    const ids = this.formGroup.get('taxonomyIds');
    if (!ids) {
      return [];
    }
    return ids.value
      .map((id) => {
        return this.taxonomyService.taxonomies().find((tag) => tag.id === id);
      })
      .filter((tag) => Boolean(tag))
      .concat(
        this._newTaxonomies.value.map((name) => this.placeholderTag(name)),
      ) as TaxonomyInterface[];
  }

  public get filteredTaxonomies(): TaxonomyInterface[] {
    if (!this.currentFilter) {
      return [];
    }
    return this.taxonomyService.taxonomies().filter((tag) => {
      return tag.name.toLowerCase().includes(this.currentFilter);
    });
  }

  private get _newTaxonomies() {
    return this.formGroup.get('newTaxonomies') as FormControl<string[]>;
  }

  private get _newTagNames(): string[] {
    return this._newTaxonomies.value.map((tag) => tag.toLowerCase());
  }

  private get _taxonomyIdsControl() {
    return this.formGroup.get('taxonomyIds');
  }

  public checkCurrentFilter(): boolean {
    return this._newTagNames.includes(this.currentFilter.toLowerCase());
  }

  public createNewTag(): void {
    if (!this._newTagNames.includes(this.currentFilter.toLowerCase())) {
      const tagNames = this._newTaxonomies.value;
      tagNames.push(new TitleCasePipe().transform(this.currentFilter));
      this._newTaxonomies.setValue(tagNames);
      this.tagSearch.updateModel('');
      this.tagSearch.hide();
    }
  }

  public filterTaxonomies(event: AutoCompleteCompleteEvent): void {
    this.currentFilter = event.query.toLowerCase();
  }

  public getChipClass(name: string): string {
    return this._newTagNames.includes(name.toLowerCase()) ? 'bg-primary' : '';
  }

  public taxonomyRemoved(tag: TaxonomyInterface): void {
    const ids =
      this._taxonomyIdsControl?.value.filter((id) => id !== tag.id) || [];
    this._taxonomyIdsControl?.setValue(ids);
  }

  public taxonomySelected(event?: AutoCompleteSelectEvent): void {
    if (!event) {
      return;
    }
    const ids = this._taxonomyIdsControl?.value || [];

    ids.push(event.value.id);
    this._taxonomyIdsControl?.setValue(ids);

    this.selectedTag = '';
  }

  private placeholderTag(name: string): TaxonomyInterface {
    return {
      name,
      slug: slugger(name),
      metaData: {},
    };
  }
}
