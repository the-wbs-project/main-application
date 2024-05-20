import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { DirtyComponent } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';

export const dirtyGuard: CanDeactivateFn<DirtyComponent> = (
  component: DirtyComponent
) =>
  !component.isDirty()
    ? true
    : inject(Messages).confirm.show(
        'General.ConfirmDiscardTitle',
        'General.ConfirmDiscardMessage'
      );
