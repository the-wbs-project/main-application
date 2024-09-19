import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { LibraryTypeTextComponent } from '@wbs/components/_utils/library-type-text.component';
import { LoadingComponent } from '@wbs/components/_utils/loading.component';
import { WatchIndicatorComponent } from '@wbs/components/watch-indicator.component';
import { LibraryViewModel } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';

@Component({
  standalone: true,
  selector: 'wbs-library-list',
  templateUrl: './library-list.component.html',
  styleUrl: './library-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block overflow-auto flex-fill' },
  imports: [
    DateTextPipe,
    LibraryTypeTextComponent,
    LoadingComponent,
    NgClass,
    RouterModule,
    TooltipModule,
    TranslateModule,
    WatchIndicatorComponent,
  ],
})
export class LibraryListComponent {
  readonly showLoading = input(false);
  readonly showWatchedColumn = input(true);
  readonly selected = model<LibraryViewModel | undefined>(undefined);
  readonly entries = input.required<LibraryViewModel[]>();
  readonly showOwner = input(false);
  readonly dblClick = output<void>();
}
