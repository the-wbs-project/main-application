import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChartGantt,
  faDiagramSubtask,
  faTasks,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { SelectButtonComponent } from '@wbs/main/components/select-button.component';

@Component({
  standalone: true,
  selector: 'wbs-type-selection',
  templateUrl: './type-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass, SelectButtonComponent, TranslateModule],
})
export class TypeSelectionComponent {
  @Output() readonly typeChange = new EventEmitter<string | undefined>();

  readonly type = input.required<string | undefined>();
  readonly faChartGantt = faChartGantt;
  readonly faDiagramSubtask = faDiagramSubtask;
  readonly faTasks = faTasks;
}
