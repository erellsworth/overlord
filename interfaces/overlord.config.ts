export interface OverlordContentType {
  slug?: string;
  label?: string;
  plural?: string;
}

export interface OverlordConfig {
  contentTypes: {
    [key: string]: OverlordContentType;
  };
}
