import { ArchiveProject } from '../actions';

export enum PROJECT_ACTIONS {
  ARCHIVE = 'archive',
}

export const PROJECT_ACTIONS_LIST = [
  {
    title: 'Projects.ArchiveProject',
    action: new ArchiveProject(),
  },
];
