import { PhoenicianData } from '../components/ui/phoenician/phoenician.interface';
import { Taxonomy } from './taxonomy';

export type ContentTypes = 'post' | 'page';
export type ContentStatus = 'publish' | 'draft' | 'trash' | 'scheduled';

export interface Content {
  id: string;
  title: string;
  slug: string;
  type: ContentTypes;
  status: ContentStatus;
  authorId: string;
  data?: PhoenicianData;
  taxonomies?: Taxonomy[];
}
