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
import { LibraryEntryVersion } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-task-setup',
  templateUrl: './task-setup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    NgStyle,
    TextBoxModule,
    TranslateModule,
  ],
})
export class TaskSetupComponent {
  @Output() readonly titleChosen = new EventEmitter<string>();

  readonly version = input.required<LibraryEntryVersion>();
  readonly faFloppyDisk = faFloppyDisk;
}
