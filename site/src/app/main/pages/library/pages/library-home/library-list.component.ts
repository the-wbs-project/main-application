import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCactus } from '@fortawesome/pro-thin-svg-icons';
import { faFilters } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { plusIcon } from '@progress/kendo-svg-icons';
import { PROJECT_STATI } from '@wbs/core/models';
import { PageHeaderComponent } from '@wbs/main/components/page-header/page-header.component';
import { EditedDateTextPipe } from '@wbs/main/pipes/edited-date-text.pipe';
import { ProjectCategoryLabelPipe } from '@wbs/main/pipes/project-category-label.pipe';
import { MetadataState } from '@wbs/main/states';

@Component({
  standalone: true,
  templateUrl: './library-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EditedDateTextPipe,
    FontAwesomeModule,
    NgClass,
    PageHeaderComponent,
    ProjectCategoryLabelPipe,
    RouterModule,
    TranslateModule,
  ],
})
export class LibraryListComponent {
  @Input() status?: string;
  @Input() type?: string;

  readonly faCactus = faCactus;
  readonly faFilters = faFilters;

  filterToggle = false;

  expanded = true;

  readonly plusIcon = plusIcon;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly store: Store
  ) {}

  force() {
    this.cd.detectChanges();
  }
}
