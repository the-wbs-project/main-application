import { ProjectCategory } from '@wbs/core/models';

export type PhaseListItem =
  | {
      idOrCat: ProjectCategory;
      isEditable: false;
    }
  | {
      text: string;
      sameAs: string[];
      isEditable: true;
    };
