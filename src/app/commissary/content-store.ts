import { BaseStore } from './base-store';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DateTime } from "luxon";
import { ContentTypes, Content } from '../interfaces/content';
import { ValidationResult } from '../interfaces/app';
import { UserService } from '../services/user.service';
import { Utils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class ContentStore extends BaseStore {
  constructor(
    public fireStore: AngularFirestore,
    private user: UserService,
    private utils: Utils) {
    super(fireStore, 'content');
  }

  public async findByType(type: ContentTypes): Promise<Content[]> {
    const contents = await this.search('type', '==', type);
    return contents as Content[];
  }

  public async createDraft(type: ContentTypes): Promise<Content> {
    return {
      id: this.fireStore.createId(),
      title: '',
      slug: '',
      type: type,
      status: 'draft',
      authorId: await this.user.getId(),
      data: {
        html: '',
        text: '',
        content: {}
      },
      modificationDate: DateTime.local().toJSDate()
    }
  }

  public validate(content: Content): ValidationResult {
    const requiredFields: string[] = [
      'title',
      'slug',
    ];

    const missingFields: string[] = requiredFields.filter((field: string): boolean => {
      return !this.utils.getBoolean(content[field]);
    });

    const result: ValidationResult = {
      isValid: missingFields.length === 0
    };

    if (!result.isValid) {
      result.errors = missingFields.map((field: string) => {
        return this.utils.titleCase(field) + ' is required';
      });
    }

    return result;
  }
}
