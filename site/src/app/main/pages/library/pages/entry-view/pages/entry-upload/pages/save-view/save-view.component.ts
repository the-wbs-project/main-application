import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { SignalStore } from '@wbs/core/services';
import { PrepUploadToSave } from '../../actions';
import { EntryUploadState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './save-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, RouterModule, TranslateModule],
})
export class SaveViewComponent implements OnInit {
  private readonly store = inject(SignalStore);

  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly setup = signal(false);
  readonly entryUrl = input.required<string[]>();
  readonly saving = this.store.select(EntryUploadState.saving);
  readonly url = computed(() => [...this.entryUrl(), 'tasks']);

  ngOnInit(): void {
    this.setup.set(true);
    this.store.dispatch(new PrepUploadToSave());
  }
}
