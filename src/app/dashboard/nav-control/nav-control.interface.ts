export interface NavMenuItem {
  label: string;
  route?: string;
  children?: NavMenuItem[];
  isGenerated?: boolean;
}
