import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChartGantt,
  faDiagramSubtask,
  faTasks,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SelectButtonComponent } from '@wbs/main/components/select-button.component';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer';
import { LibraryEntryCreateService } from '../../services';
import { ProjectCategoryMultipleListComponent } from '@wbs/main/components/project-category-multiple-list';
import { ListItem } from '@wbs/core/models';

@Component({
  standalone: true,
  templateUrl: './basics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    FormsModule,
    NgClass,
    ProjectCategoryMultipleListComponent,
    SelectButtonComponent,
    TextBoxModule,
    TranslateModule,
    WizardFooterComponent,
  ],
})
export class BasicsComponent {
  @Input() org!: string;
  @Input() title?: string;
  @Input() type?: string;
  @Input() categories!: ListItem[];
  @Input() selectedCategories!: string[];

  readonly faChartGantt = faChartGantt;
  readonly faDiagramSubtask = faDiagramSubtask;
  readonly faTasks = faTasks;

  constructor(
    private readonly service: LibraryEntryCreateService,
    private readonly store: Store
  ) {}

  continue(): void {
    this.service.setBasics(this.org, this.title!, this.type!);
  }
}
