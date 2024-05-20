import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { PageHeaderComponent } from '@wbs/components/page-header';
import { FillElementDirective } from '@wbs/core/directives/fill-element.directive';
import { ProjectCreateState } from './states';

@Component({
  standalone: true,
  templateUrl: './project-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FillElementDirective,
    PageHeaderComponent,
    RouterModule,
    TranslateModule,
  ],
})
export class ProjectCreateComponent {
  title = toSignal(this.store.select(ProjectCreateState.headerTitle));
  description = toSignal(
    this.store.select(ProjectCreateState.headerDescription)
  );

  constructor(private readonly store: Store) {}
}
