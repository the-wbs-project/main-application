import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer/wizard-footer.component';
import { LibraryEntryCreateService } from '../../services';
import {
  faChartGantt,
  faDiagramSubtask,
  faTasks,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SelectButtonComponent } from '@wbs/main/pages/library/components/select-button.component';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: './getting-started.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EditorModule,
    FontAwesomeModule,
    FormsModule,
    NgClass,
    SelectButtonComponent,
    TextBoxModule,
    TranslateModule,
    WizardFooterComponent,
  ],
})
export class GettingStartedComponent {
  @Input() org!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() type?: string;

  constructor(private readonly service: LibraryEntryCreateService) {}

  readonly faChartGantt = faChartGantt;
  readonly faDiagramSubtask = faDiagramSubtask;
  readonly faTasks = faTasks;

  continue(): void {
    this.service.setBasics(this.org, this.title, this.description, this.type!);
  }
}
