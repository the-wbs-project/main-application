import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LibraryFilterComponent } from '@wbs/components/library/library-filter.component';
import { PageHeaderComponent } from '@wbs/components/page-header';
import { LIBRARY_FILTER_LIBRARIES } from '@wbs/core/models';
import { LibraryCreateButtonComponent } from './components';
import { LibraryHomeService } from './services';

@Component({
  standalone: true,
  templateUrl: './library-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LibraryCreateButtonComponent,
    LibraryFilterComponent,
    PageHeaderComponent,
    RouterModule,
  ],
})
export class LibraryHomeComponent {
  readonly service = inject(LibraryHomeService);
  readonly libraries = LIBRARY_FILTER_LIBRARIES;
}
