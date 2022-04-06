import { Project, ResourceSections, WbsNodeView } from '@wbs/models';

export interface DragPage {
  resources: ResourceSections;
  project: Project;
  nodes: WbsNodeView[];
  node?: WbsNodeView;
}
