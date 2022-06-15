import { Pipe, PipeTransform } from '@angular/core';
import {
  PROJECT_CREATION_PAGES as PAGES,
  PROJECT_CREATION_PAGES_TYPE,
} from '../models';

@Pipe({ name: 'projectCreateDescription', pure: false })
export class ProjectCreateDescriptionPipe implements PipeTransform {
  transform(page: PROJECT_CREATION_PAGES_TYPE | null | undefined): string {
    if (page === PAGES.GETTING_STARTED)
      return "This is some basic information about creating a new project. This page may not be needed but we're going to include it for now.";
    if (page === PAGES.BASICS)
      return 'Please provide the title for this project.';
    if (page === PAGES.SCOPE)
      return 'What sort of work will your firm perform on this project?';
    if (page === PAGES.LIB_OR_SCRATCH) return 'How do you want to get started?';
    if (page === PAGES.DESCIPLINES) return 'How do you want to get started?';
    if (page === PAGES.NODE_VIEW)
      return 'Would you like the first significant digit of your project to be Phases or Disciplines?';
    if (page === PAGES.PHASES)
      return 'Choose which phases which apply to your WBS.  You will be able to reorder them later.';

    return '';
  }
}
