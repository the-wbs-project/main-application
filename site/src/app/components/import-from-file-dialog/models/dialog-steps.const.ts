import {
  faDiagramSubtask,
  faFileUpload,
  faPeople,
  faTicket,
} from '@fortawesome/pro-solid-svg-icons';
import { DialogStep } from './dialog-step.model';

export const STEPS_STARTER: DialogStep[] = [
  {
    id: 'start',
    num: 0,
    label: 'Upload.UploadProjectPlan',
    icon: faFileUpload,
  },
];

export const STEPS_TICKET: DialogStep[] = [
  ...STEPS_STARTER,
  {
    num: 1,
    id: 'ticket',
    label: 'Upload.Page_Ticket',
    icon: faTicket,
  },
];

export const STEPS_EXCEL: DialogStep[] = [
  ...STEPS_STARTER,
  { num: 1, id: 'tasks', label: 'General.Tasks', icon: faDiagramSubtask },
];

export const STEPS_PROJECT: DialogStep[] = [
  ...STEPS_STARTER,
  {
    num: 1,
    id: 'disciplines',
    label: 'Upload.Page_Disciplines',
    icon: faPeople,
  },
  { num: 2, id: 'tasks', label: 'General.Tasks', icon: faDiagramSubtask },
];
