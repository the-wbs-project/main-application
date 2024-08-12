import {
  faChartGantt,
  faDiagramSubtask,
  faTasks,
} from '@fortawesome/pro-solid-svg-icons';

export const LIBRARY_FILTER_LIBRARIES = [
  { value: 'draft', label: 'General.Drafts' },
  { value: 'internal', label: 'General.Organizational' },
  { value: 'public', label: 'General.Public' },
];

export const LIBRARY_FILTER_ROLES = [
  { value: 'author', label: 'General.Author' },
  { value: 'watching', label: 'General.Watching' },
];

export const LIBRARY_FILTER_TYPES = [
  { value: 'project', label: 'General.Project', icon: faChartGantt },
  { value: 'phase', label: 'General.Phase', icon: faDiagramSubtask },
  { value: 'task', label: 'General.Task', icon: faTasks },
];
