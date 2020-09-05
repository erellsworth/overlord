export interface Taxonomy {
  id: string;
  name: string;
  slug: string;
  type: 'category' | 'tag';
  description?: string;
}
