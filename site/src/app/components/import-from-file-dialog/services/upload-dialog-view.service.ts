import { computed, Injectable, signal } from '@angular/core';
import { StepperItem } from '@wbs/core/models';
import {
  STEPS_EXCEL,
  STEPS_PROJECT,
  STEPS_STARTER,
  STEPS_TICKET,
} from '../models';

@Injectable()
export class UploadDialogViewService {
  readonly page = signal<StepperItem>(STEPS_STARTER[0]);
  readonly viewType = signal<'ticket' | 'excel' | 'project' | 'starter'>(
    'starter'
  );
  readonly view = computed(() => {
    const page = this.page();
    const steps = this.steps();

    return steps.findIndex((x) => x.id === page.id);
  });

  readonly steps = computed(() => {
    switch (this.viewType()) {
      case 'ticket':
        return STEPS_TICKET;
      case 'excel':
        return STEPS_EXCEL;
      case 'project':
        return STEPS_PROJECT;
      default:
        return STEPS_STARTER;
    }
  });

  back(): void {
    this.page.update((page) => {
      const steps = this.steps();

      const index = steps.findIndex((x) => x.id === page.id);

      return steps[index - 1];
    });
  }

  next(): void {
    const steps = this.steps();
    const currentPage = this.page().id;

    const index = steps.findIndex((x) => x.id === currentPage);

    if (index < steps.length - 1) {
      this.page.set(steps[index + 1]);
    }
  }

  nextDisabled(): boolean {
    return false;
  }

  nextButtonLabel(): string {
    return 'General.Next';
  }
}
