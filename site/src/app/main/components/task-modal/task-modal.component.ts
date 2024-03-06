import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { faDiagramSubtask } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate, RouterState } from '@ngxs/router-plugin';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { SignalStore } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-task-modal',
  templateUrl: './task-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, RouterModule, TranslateModule],
})
export class TaskModalComponent {
  private readonly store = inject(SignalStore);
  private readonly url = this.store.select(RouterState.url);
  //
  //  Inputs
  //
  readonly width = input.required<number>();
  readonly parentUrl = input.required<string[]>();
  readonly task = input.required<WbsNodeView | undefined>();

  protected readonly faDiagramSubtask = faDiagramSubtask;
  protected readonly dialogWidth = computed(() =>
    this.width() > 700 ? '90%' : '100%'
  );
  protected readonly dialogHeight = computed(() =>
    this.width() > 700 ? '95%' : '100%'
  );
  protected readonly opened = computed(() => {
    const url = this.url();

    if (!url) return false;

    const parts = url.toLowerCase().split('/');
    const index = parts.indexOf('tasks');

    return index !== -1 && index < parts.length - 1;
  });

  closed(): void {
    this.store.dispatch(new Navigate([...this.parentUrl(), 'tasks']));
  }
}
