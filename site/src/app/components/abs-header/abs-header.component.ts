import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule, Position } from '@progress/kendo-angular-tooltip';

@Component({
  standalone: true,
  selector: 'wbs-abs-header',
  templateUrl: './abs-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, PopoverModule, TranslateModule],
})
export class AbsHeaderComponent {
  readonly icon = faCircleQuestion;
  readonly text = input.required<'abbrev' | 'full'>();
  readonly position = input<Position>('bottom');
  readonly title = computed(() =>
    this.text() === 'abbrev' ? 'Wbs.ABS' : 'Wbs.ABS-Full'
  );
}
