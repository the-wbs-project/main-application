import {
  faDiagramSubtask,
  faFileUpload,
  faPeople,
  faTicket,
} from '@fortawesome/pro-solid-svg-icons';
import { StepperItem } from '@wbs/core/models';

export const STEPS_STARTER: StepperItem[] = [
  { id: 'start', label: 'Upload.UploadProjectPlan', icon: faFileUpload },
];

export const STEPS_TICKET: StepperItem[] = [
  ...STEPS_STARTER,
  { id: 'ticket', label: 'Upload.Page_Ticket', icon: faTicket },
];

export const STEPS_EXCEL: StepperItem[] = [
  ...STEPS_STARTER,
  { id: 'tasks', label: 'General.Tasks', icon: faDiagramSubtask },
];

export const STEPS_PROJECT: StepperItem[] = [
  ...STEPS_STARTER,
  { id: 'disciplines', label: 'Upload.Page_Disciplines', icon: faPeople },
  { id: 'tasks', label: 'General.Tasks', icon: faDiagramSubtask },
];
