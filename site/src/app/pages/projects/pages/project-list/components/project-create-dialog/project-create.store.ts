import { Injectable, computed, signal } from '@angular/core';
import { ProjectCategory } from '@wbs/core/models';
import { UserViewModel } from '@wbs/core/view-models';

@Injectable()
export class ProjectCreateStore {
  readonly page = signal<number>(0);
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

    if (page === 0) {
      return this.title().trim() !== '';
    }
    if (page === 1) {
      return this.category() !== undefined;
    }
    if (page === 2 || page === 3) {
      return true;
    }
    if (page === 4) {
      return this.pms().length > 0;
    }

    return false;
  });
}
