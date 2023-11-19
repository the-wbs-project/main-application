import { SVGIcon } from '@progress/kendo-svg-icons';
import { PROJECT_STATI_TYPE } from '@wbs/core/models';

export interface ContextMenuItem {
  text: string;
  svgIcon: SVGIcon;
  action: string;
  filters?: {
    excludeFromCat?: boolean;
    stati?: PROJECT_STATI_TYPE[];
  };
  claim?: string;
}
