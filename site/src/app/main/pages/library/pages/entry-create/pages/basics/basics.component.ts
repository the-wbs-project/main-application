import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChartGantt,
  faDiagramSubtask,
  faTasks,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SignalStore } from '@wbs/core/services';
import { SelectButtonComponent } from '@wbs/main/components/select-button.component';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer';
import { LibraryEntryCreateService } from '../../services';
import { LibraryCreateState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './basics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    NgClass,
    SelectButtonComponent,
    TextBoxModule,
    TranslateModule,
    WizardFooterComponent,
  ],
})
export class BasicsComponent {
  readonly org = input.required<string>();
  readonly faChartGantt = faChartGantt;
  readonly faDiagramSubtask = faDiagramSubtask;
  readonly faTasks = faTasks;
  readonly title = this.store.selectSignalSnapshot(LibraryCreateState.title);
  readonly type = this.store.selectSignalSnapshot(LibraryCreateState.type);

  constructor(
    private readonly service: LibraryEntryCreateService,
    private readonly store: SignalStore
  ) {}

  continue(title: string, type: string): void {
    this.service.setBasics(this.org(), title, type);
  }
}
