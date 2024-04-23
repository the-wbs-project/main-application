import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { Messages } from '@wbs/core/services';
import { DirtyComponent } from '../../main/models';

export const dirtyGuard: CanDeactivateFn<DirtyComponent> = (
  component: DirtyComponent
) =>
  !component.isDirty()
    ? true
    : inject(Messages).confirm.show(
        'General.ConfirmDiscardTitle',
        'General.ConfirmDiscardMessage'
      );
