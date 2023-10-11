import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { RecordResource } from '@wbs/core/models';
import { ResourceListComponent } from './components/resource-list/resource-list.component';
import { Store } from '@ngxs/store';

@Component({
  standalone: true,
  selector: 'wbs-record-resources',
  templateUrl: './record-resources.component.html',
  imports: [FontAwesomeModule, NgIf, ResourceListComponent, TranslateModule],
})
export class RecordResourcesComponent {
  @Input({ required: true }) list!: RecordResource[];
  @Input({ required: true }) claims!: string[];

  @Output() readonly save = new EventEmitter<RecordResource>();

  constructor(private readonly store: Store) {}
}
