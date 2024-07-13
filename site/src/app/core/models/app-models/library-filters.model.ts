import {
  faChartGantt,
  faDiagramSubtask,
  faTasks,
} from '@fortawesome/pro-solid-svg-icons';

export const LIBRARY_FILTER_LIBRARIES = [
  { value: 'organizational', label: 'General.Organizational' },
  { value: 'public', label: 'General.Public' },
];

export const LIBRARY_FILTER_ROLES = [
  { value: 'all', label: 'General.All' },
  { value: 'author', label: 'General.Author' },
  //{ value: 'contributor', label: 'General.Organizational' },
  { value: 'watching', label: 'General.Watching' },
];

export const LIBRARY_FILTER_TYPES = [
  { value: 'all', label: 'General.All' },
  { value: 'project', label: 'General.Project', icon: faChartGantt },
  { value: 'phase', label: 'General.Phase', icon: faDiagramSubtask },
  { value: 'task', label: 'General.Task', icon: faTasks },
];
