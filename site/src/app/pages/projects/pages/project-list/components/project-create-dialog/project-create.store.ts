import { Injectable, computed, signal } from '@angular/core';
import { ProjectCategory } from '@wbs/core/models';
import { UserViewModel } from '@wbs/core/view-models';

@Injectable()
export class ProjectCreateStore {
  readonly page = signal<number>(1);
  readonly pageDescription = signal<string>('');
  readonly title = signal<string>('');
  readonly description = signal<string>('');
  readonly category = signal<string | undefined>(undefined);
  readonly phases = signal<ProjectCategory[]>([]);
  readonly disciplines = signal<ProjectCategory[]>([]);
  readonly pms = signal<UserViewModel[]>([]);
  readonly smes = signal<UserViewModel[]>([]);
  readonly approvers = signal<UserViewModel[]>([]);

  readonly canContinue = computed(() => {
    const page = this.page();

    if (page === 1) {
      return this.title().trim() !== '';
    }
    if (page === 2) {
      return this.category() !== undefined;
    }
    if (page === 3 || page === 4) {
      return true;
    }
    if (page === 5) {
      return this.pms().length > 0;
    }

    return false;
  });
}
