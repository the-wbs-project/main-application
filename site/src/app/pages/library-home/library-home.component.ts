import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LibraryCreateButtonComponent } from '@wbs/components/library/create-button';
import { LibraryFilterComponent } from '@wbs/components/library/library-filter.component';
import { LIBRARY_FILTER_LIBRARIES } from '@wbs/core/models';
import { LibraryHomeService } from './services';
import { WbsBootstrapDialogComponent } from './components/test-dialog/test-dialog.component';

@Component({
  standalone: true,
  templateUrl: './library-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LibraryCreateButtonComponent,
    LibraryFilterComponent,
    RouterModule,
    WbsBootstrapDialogComponent,
  ],
})
export class LibraryHomeComponent {
  readonly service = inject(LibraryHomeService);
  readonly libraries = LIBRARY_FILTER_LIBRARIES;
  isDialogVisible: boolean = false;

  openDialog() {
    this.isDialogVisible = true;
  }

  closeDialog() {
    this.isDialogVisible = false;
  }

  confirmDialog() {
    // Handle confirm action
    this.isDialogVisible = false;
  }

  cancelDialog() {
    // Handle cancel action
    this.isDialogVisible = false;
  }
}
