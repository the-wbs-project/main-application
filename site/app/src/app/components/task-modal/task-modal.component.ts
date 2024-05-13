import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  viewChild,
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
  //changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, RouterModule, TranslateModule],
})
export class TaskModalComponent implements AfterViewInit {
  private readonly store = inject(SignalStore);
  //
  //  Inputs
  //
  readonly width = input.required<number>();
  readonly parentUrl = input.required<string[]>();
  readonly task = input.required<WbsNodeView | undefined>();
  readonly templateRef = input<TemplateRef<any>>();
  //
  //  View Children
  //
  @ViewChild('templateOutlet', { read: ViewContainerRef, static: true })
  templateOutlet!: ViewContainerRef;

  protected readonly dialogWidth = computed(() =>
    this.width() > 700 ? '90%' : '100%'
  );
  protected readonly dialogHeight = computed(() =>
    this.width() > 700 ? '95%' : '100%'
  );

  constructor() {}

  ngAfterViewInit() {
    console.log(this.templateOutlet);
    this.templateOutlet.createEmbeddedView(this.templateRef()!);
  }

  closed(): void {
    this.store.dispatch(new Navigate([...this.parentUrl(), 'tasks']));
  }
}
