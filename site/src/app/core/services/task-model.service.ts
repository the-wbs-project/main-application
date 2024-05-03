import { Injectable, computed, inject } from '@angular/core';
import { UiStore } from '@wbs/store';

@Injectable()
export class TaskModalService {
  private readonly width = inject(UiStore).mainContentWidth;

  readonly dialogWidth = computed(() => (this.width()! > 700 ? '90%' : '100%'));
  readonly dialogHeight = computed(() =>
    this.width()! > 700 ? '95%' : '100%'
  );
}
