import { ListItem, Project, ResourceSections, WbsNodeView } from '@wbs/models';

export interface DragPage {
  deleteReasons: ListItem[];
  resources: ResourceSections;
  project: Project;
  nodes: WbsNodeView[];
  node?: WbsNodeView;
}
