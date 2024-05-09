import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { SignalStore } from '@wbs/core/services';
import { UploadSaveViewComponent } from '@wbs/main/components/upload-views/save-view';
import { PrepUploadToSave } from '../actions';
import { EntryUploadState } from '../states';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UploadSaveViewComponent],
  template: `<wbs-upload-save-view [url]="url()" [saving]="showSaving()" />`,
})
export class SaveViewComponent implements OnInit {
  private readonly store = inject(SignalStore);

  readonly setup = signal(false);
  readonly entryUrl = input.required<string[]>();
  readonly saving = this.store.select(EntryUploadState.saving);
  readonly url = computed(() => [...this.entryUrl(), 'tasks']);
  readonly showSaving = computed(() => !this.setup() || this.saving() === true);

  ngOnInit(): void {
    this.setup.set(true);
    this.store.dispatch(new PrepUploadToSave());
  }
}
