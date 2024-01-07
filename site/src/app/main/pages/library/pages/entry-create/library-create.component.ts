import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { PageHeaderComponent } from '@wbs/main/components/page-header/page-header.component';
import { LibraryCreateState } from './states';

@Component({
  standalone: true,
  templateUrl: './library-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, RouterModule, TranslateModule],
})
export class LibraryCreateComponent {
  title = toSignal(this.store.select(LibraryCreateState.pageTitle));
  description = toSignal(this.store.select(LibraryCreateState.pageDescription));

  constructor(private readonly store: Store) {}
}
