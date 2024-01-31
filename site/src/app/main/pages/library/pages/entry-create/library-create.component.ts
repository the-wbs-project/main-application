import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SignalStore } from '@wbs/core/services';
import { PageHeaderComponent } from '@wbs/main/components/page-header/page-header.component';
import { LibraryCreateState } from './states';

@Component({
  standalone: true,
  templateUrl: './library-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, RouterModule, TranslateModule],
})
export class LibraryCreateComponent {
  title = this.store.select(LibraryCreateState.pageTitle);
  description = this.store.select(LibraryCreateState.pageDescription);

  constructor(private readonly store: SignalStore) {}
}
