export interface OverlordContentType {
  slug?: string;
  label?: string;
  plural?: string;
  hierarchical?: boolean;
  fields?: (OverlordField | string)[];
  noTitle?: boolean;
}

export interface OverlordField {
  name: string;
  label?: string;
  type: OverlordFieldType;
  group?: 'seo' | 'metaData';
  defaultValue?: any;
}

export type OverlordFieldType =
  | 'editor'
  | 'text'
  | 'textarea'
  | 'image'
  | 'tags'
  | 'number'
  | 'rating'
  | 'boolean';

export interface OverlordConfig {
  contentTypes: OverlordContentType[];
}

export interface OverlordConfigFile {
  contentTypes: {
    [key: string]: OverlordContentType;
  };
}
