export interface NavMenuItem {
  label: string;
  slug?: string;
  children?: NavMenuItem[];
  isGenerated?: boolean;
  parent?: NavMenuItem;
}
