import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBooks,
  faFileUpload,
  faPencil,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ActionButtonComponent } from '@wbs/components/action-button';
import { AddPhaseOptions } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-tree-buttons-add',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActionButtonComponent, FontAwesomeModule, TranslateModule],
  template: `<wbs-action-button
    [menu]="menu"
    [customContent]="true"
    (itemClicked)="clicked($event)"
  >
    <fa-icon [icon]="plusIcon" />
    {{ 'Wbs.AddPhase' | translate }}
  </wbs-action-button>`,
})
export class TreeButtonsAddComponent {
  readonly menu = [
    {
      resource: 'General.Create',
      faIcon: faPencil,
      action: 'create',
    },
    {
      resource: 'Wbs.ImportFromFile',
      faIcon: faFileUpload,
      action: 'importFile',
    },
    {
      resource: 'Wbs.ImportFromLibrary',
      faIcon: faBooks,
      action: 'importLibrary',
    },
  ];
  readonly plusIcon = faPlus;
  readonly selected = output<AddPhaseOptions>();

  protected clicked(option: string): void {
    this.selected.emit(option as AddPhaseOptions);
  }
}
