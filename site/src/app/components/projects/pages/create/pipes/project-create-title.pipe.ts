import { Pipe, PipeTransform } from '@angular/core';
import {
  PROJECT_CREATION_PAGES as PAGES,
  PROJECT_CREATION_PAGES_TYPE,
} from '../models';

@Pipe({ name: 'projectCreateTitle', pure: false })
export class ProjectCreateTitlePipe implements PipeTransform {
  transform(page: PROJECT_CREATION_PAGES_TYPE | null | undefined): string {
    if (page === PAGES.BASICS) return 'Project Title';
    if (page === PAGES.GETTING_STARTED) return 'Getting Started';
    if (page === PAGES.SCOPE) return 'Project Scope';
    if (page === PAGES.LIB_OR_SCRATCH) return 'Library Or By Hand';
    if (page === PAGES.NODE_VIEW) return 'WBS Heirarchy';
    if (page === PAGES.PHASES) return 'Project Phases';

    return '';
  }
}
