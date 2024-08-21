import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  TreeButtonsAddComponent,
  TreeButtonsDownloadComponent,
  TreeButtonsFullscreenComponent,
  TreeButtonsTogglerComponent,
  TreeButtonsUploadComponent,
} from '@wbs/components/_utils/tree-buttons';

@Component({
  standalone: true,
  selector: 'wbs-library-tree-actions',
  templateUrl: './library-tree-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    TreeButtonsAddComponent,
    TreeButtonsFullscreenComponent,
    TreeButtonsTogglerComponent,
  ],
})
export class LibraryTreeActionsComponent {
  readonly showAdd = input.required<boolean>();
  readonly showFullscreen = input.required<boolean>();

  readonly addClicked = output<void>();
  readonly collapseAllClicked = output<void>();
  readonly expandAllClicked = output<void>();
  readonly fullscreenClicked = output<void>();
}
