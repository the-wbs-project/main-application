import { ListItem, ResourceSections } from '@wbs/models';

export interface ViewViewModel {
  deleteReasons: ListItem[];
  resources: ResourceSections;
}
