import { ListItem, ResourceSections } from '@wbs/shared/models';

export interface ViewViewModel {
  deleteReasons: ListItem[];
  resources: ResourceSections;
}
