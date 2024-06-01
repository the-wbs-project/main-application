import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { UploadSaveViewComponent } from '@wbs/components/upload-views/save-view';
import { SignalStore } from '@wbs/core/services';
import { PrepUploadToSave } from '../actions';
import { ProjectUploadState } from '../states';

@Component({
  standalone: true,
  template: `<wbs-upload-save-view [url]="url()" [saving]="showSaving()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UploadSaveViewComponent],
})
export class SaveViewComponent implements OnInit {
  private readonly store = inject(SignalStore);

  readonly projectUrl = input.required<string[]>();

  readonly setup = signal(false);
  readonly saving = this.store.select(ProjectUploadState.saving);

  readonly url = computed(() => [...this.projectUrl(), 'tasks']);
  readonly showSaving = computed(() => !this.setup() || this.saving() === true);

  ngOnInit(): void {
    this.setup.set(true);
    this.store.dispatch(new PrepUploadToSave());
  }
}
