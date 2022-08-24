import {
  faBolt,
  faBridgeSuspension,
  faBuilding,
  faDroneAlt,
  faFlask,
  faGears,
  faHeadSideBrain,
  faListCheck,
  faPipeValve,
  faStamp,
} from '@fortawesome/pro-solid-svg-icons';

export const DISCIPLINE_ICONS = [
  { id: 'mechanical', icon: faGears },
  { id: 'electrical', icon: faBolt },
  { id: 'structural', icon: faBridgeSuspension },
  { id: 'survey', icon: faDroneAlt },
  { id: 'civil', icon: faBuilding },
  { id: 'plumbing', icon: faPipeValve },
  { id: 'scientist', icon: faFlask },
];

export const ROLE_ICONS = {
  pm: faListCheck,
  approver: faStamp,
  sme: faHeadSideBrain,
};
