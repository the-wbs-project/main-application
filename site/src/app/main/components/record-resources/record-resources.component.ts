import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { RecordResource } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-record-resources',
  templateUrl: './record-resources.component.html',
  imports: [FontAwesomeModule, NgIf, TranslateModule],
})
export class RecordResourcesComponent {
  @Input({ required: true }) list!: RecordResource[];

  @Output() readonly save = new EventEmitter<RecordResource>();
}
