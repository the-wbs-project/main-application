import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
} from '@fortawesome/pro-solid-svg-icons';
import { ContextMenuItem } from '@wbs/core/models';

export const MENU_ACTIONS = {
  moveUp: 'moveUp',
  moveDown: 'moveDown',
  moveLeft: 'moveLeft',
  moveRight: 'moveRight',
};

export const MOVE_LEFT: ContextMenuItem = {
  action: MENU_ACTIONS.moveLeft,
  faIcon: faArrowLeft,
  resource: 'Projects.MoveLeft',
};
export const MOVE_UP: ContextMenuItem = {
  action: MENU_ACTIONS.moveUp,
  faIcon: faArrowUp,
  resource: 'Projects.MoveUp',
};

export const MOVE_RIGHT: ContextMenuItem = {
  action: MENU_ACTIONS.moveRight,
  faIcon: faArrowRight,
  resource: 'Projects.MoveRight',
};
export const MOVE_DOWN: ContextMenuItem = {
  action: MENU_ACTIONS.moveDown,
  faIcon: faArrowDown,
  resource: 'Projects.MoveDown',
};
