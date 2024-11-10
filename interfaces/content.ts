import { Model, Optional } from 'sequelize';
import { baseInterface } from './base';
import { Image } from './media';
import { TaxonomyInterface } from './taxonomy';
import { Content } from '@tiptap/core';

export enum ContentTypes {
  POST = 'post',
  PAGE = 'page',
}

export type ContentType = `${ContentTypes}`;
export type ContentStatus = 'published' | 'draft';

export interface ContentMetaData {
  media_id?: number;
  wordCount?: number;
  [key: string]: string | number | undefined;
}

export interface ContentBase extends baseInterface {
  title: string;
  type: ContentType;
  status: ContentStatus;
  text: string;
  html: string;
  content: Content;
  metaData: ContentMetaData;
}

export interface ContentInterface extends ContentBase {
  seo: {
    description: string;
    [key: string]: string;
  };
  Taxonomies?: TaxonomyInterface[];
  image?: Image;
  revisions: ContentBase[];
}

export interface ContentCreation extends ContentInterface {
  newTaxonomies?: string[];
}

// Some fields are optional when calling UserModel.create() or UserModel.build()
interface ContentCreationAttributes extends Optional<ContentInterface, 'id'> {
  Tag: any;
}

// We need to declare an interface for our model that is basically what our class would be
export interface ContentInstance
  extends Model<any, ContentCreationAttributes>,
    ContentInterface {}

export interface ContentQuery {
  type?: ContentType;
}

export interface ContentQueryParams extends ContentQuery {
  limit?: number;
  page?: number;
  noPagination?: boolean;
}
