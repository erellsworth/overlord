import { PhoenicianData } from '../components/ui/phoenician/phoenician.interface';
import { Taxonomy } from './taxonomy';

export type ContentTypes = 'post' | 'page';

export interface Content {
  id: string;
  title: string;
  slug: string;
  type: ContentTypes;
  authorId: string;
  data?: PhoenicianData;
  taxonomies?: Taxonomy[];
}
