import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChartGantt,
  faDiagramSubtask,
  faTasks,
} from '@fortawesome/pro-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SelectButtonComponent } from '@wbs/main/components/select-button.component';
import { TypeSelectionComponent } from './components/type-selection';
import { VisiblitySelectionComponent } from './components/visiblity-selection';

@Component({
  standalone: true,
  templateUrl: './entry-creation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    FormsModule,
    NgClass,
    SelectButtonComponent,
    TextBoxModule,
    TranslateModule,
    TypeSelectionComponent,
    VisiblitySelectionComponent,
  ],
})
export class EntryCreationDialogComponent {
  readonly faChartGantt = faChartGantt;
  readonly faDiagramSubtask = faDiagramSubtask;
  readonly faTasks = faTasks;

  title = '';
  type?: string;
  visibility?: string;

  constructor(readonly modal: NgbActiveModal) {}
}
