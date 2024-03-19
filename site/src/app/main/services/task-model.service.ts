import { Injectable, computed, inject } from '@angular/core';
import { SignalStore } from '@wbs/core/services';
import { UiState } from '../states';

@Injectable()
export class TaskModalService {
  private readonly store = inject(SignalStore);
  private readonly width = this.store.select(UiState.mainContentWidth);

  readonly dialogWidth = computed(() => (this.width()! > 700 ? '90%' : '100%'));
  readonly dialogHeight = computed(() =>
    this.width()! > 700 ? '95%' : '100%'
  );
}
