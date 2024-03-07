import { Signal } from '@angular/core';

export interface DirtyComponent {
  readonly isDirty: Signal<boolean>;
}
