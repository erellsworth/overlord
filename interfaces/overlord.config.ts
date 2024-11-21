export interface OverlordContentType {
  slug?: string;
  label?: string;
  plural?: string;
  hierarchical?: boolean;
  fields?: string[];
}

export interface OverlordField {
  name: string;
  label?: string;
  type:
    | 'editor'
    | 'text'
    | 'textarea'
    | 'image'
    | 'tags'
    | 'number'
    | 'rating'
    | 'boolean';
}

export interface OverlordConfig {
  contentTypes: {
    [key: string]: OverlordContentType;
  };
  fieldTypes: {
    [key: string]: OverlordField;
  };
}
