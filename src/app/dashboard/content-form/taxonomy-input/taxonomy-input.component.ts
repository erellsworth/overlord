import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ChipModule } from 'primeng/chip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ContentForm } from '../content-form.interface';
import { TaxonomyService } from '../../../services/taxonomy.service';
import { TaxonomyInterface } from '../../../../../interfaces/taxonomy';
import { Subscription } from 'rxjs';
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
    InputTextModule
  ],
  templateUrl: './taxonomy-input.component.html',
  styleUrl: './taxonomy-input.component.scss'
})
export class TaxonomyInputComponent implements OnInit, OnDestroy {
  @Input({ required: true }) formGroup!: FormGroup<ContentForm>;
  @ViewChild('tagSearch') tagSearch!: AutoComplete;

  public currentFilter = '';
  public selectedTag!: string;

  private _subs: Subscription[] = [];
  private _taxonomyList: TaxonomyInterface[] = [];

  constructor(private taxonomyService: TaxonomyService) { }

  ngOnInit(): void {
    this._subs.push(this.taxonomyService.getTaxonomies$()
      .subscribe(tags => this._taxonomyList = tags));
  }

  ngOnDestroy(): void {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  public get currentTaxonomies() {
    const ids = this.formGroup.get('taxonomyIds');
    if (!ids) { return []; }
    return ids.value.map((id) => {
      return this._taxonomyList.find(tag => tag.id === id);
    }).filter(tag => Boolean(tag))
      .concat(this._newTaxonomies.value.map(
        name => this.placeholderTag(name))
      ) as TaxonomyInterface[];
  }

  public get filteredTaxonomies(): TaxonomyInterface[] {
    if (!this.currentFilter) { return []; }
    return this._taxonomyList.filter((tag) => {
      return tag.name.toLowerCase().includes(this.currentFilter);
    });
  }

  private get _newTaxonomies() {
    return this.formGroup.get('newTaxonomies') as FormControl<string[]>;
  }

  private get _newTagNames(): string[] {
    return this._newTaxonomies.value.map(tag => tag.toLowerCase());
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
    console.log('filter', this.selectedTag);
    this.currentFilter = event.query.toLowerCase();
  }

  public checkCurrentFilter(): boolean {

    return this._newTagNames.includes(this.currentFilter.toLowerCase());
  }

  public taxonomySelected(event?: AutoCompleteSelectEvent): void {
    if (!event) { return; }
    console.log('tag selected', event);
    const idControl = this.formGroup.get('taxonomyIds');
    const ids = idControl?.value;
    if (!ids?.length) { return; }

    ids.push(event.value.id);
    idControl?.setValue(ids);

    this.selectedTag = '';

  }

  private placeholderTag(name: string): TaxonomyInterface {
    return {
      name,
      slug: slugger(name),
      metaData: {}
    }
  }
}
