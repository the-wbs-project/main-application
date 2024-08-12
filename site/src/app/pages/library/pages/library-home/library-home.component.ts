import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { LibraryFilterComponent } from '@wbs/components/library/library-filter.component';
import { PageHeaderComponent } from '@wbs/components/page-header';
import { LIBRARY_FILTER_LIBRARIES } from '@wbs/core/models';
import { LibraryCreateButtonComponent } from './components';
import { LibraryHomeService } from './services';
import { filter } from 'rxjs';

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
export class LibraryHomeComponent implements OnInit {
  private readonly router = inject(Router);

  readonly service = inject(LibraryHomeService);
  readonly library = signal<string>('draft');
  readonly libraries = LIBRARY_FILTER_LIBRARIES;

  ngOnInit(): void {
    
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log(event.url.split('/').at(-1));
      });
  }

  libraryChanged(library: string): void {
    if (library === this.library()) return;

    this.service.libraryChanged(library);
  }
}
