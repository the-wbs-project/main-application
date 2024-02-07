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
import { LibraryEntryVersion, ListItem } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { SelectButtonComponent } from '@wbs/main/components/select-button.component';

@Component({
  standalone: true,
  selector: 'wbs-phase-setup',
  templateUrl: './phase-setup.component.html',
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
export class PhaseSetupComponent {
  @Output() readonly phaseTitleChosen = new EventEmitter<string>();

  readonly version = input.required<LibraryEntryVersion>();
  readonly phases = input.required<ListItem[]>();
  readonly faFloppyDisk = faFloppyDisk;

  constructor(private readonly resources: Resources) {}

  chooseResource(label: string): void {
    this.phaseTitleChosen.emit(this.resources.get(label));
  }
}
