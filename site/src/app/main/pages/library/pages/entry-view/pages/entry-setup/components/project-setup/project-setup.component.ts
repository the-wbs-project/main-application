import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { ListItem, ProjectCategory } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { SelectButtonComponent } from '@wbs/main/components/select-button.component';

@Component({
  standalone: true,
  selector: 'wbs-project-setup',
  templateUrl: './project-setup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    NgStyle,
    SelectButtonComponent,
    TextBoxModule,
    TranslateModule,
  ],
})
export class ProjectSetupComponent {
  @Output() readonly phasesChosen = new EventEmitter<ProjectCategory[]>();

  readonly phases = input.required<ListItem[]>();
  readonly faFloppyDisk = faFloppyDisk;

  constructor(private readonly resources: Resources) {}
}
