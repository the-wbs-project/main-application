import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBuilding,
  faEarth,
  faQuestion,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-visibility-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, TranslateModule],
  template: `<fa-icon [icon]="icon()" class="mg-r-5" />
    {{ text() | translate }}`,
})
export class VisibilityTextComponent {
  readonly visibility = input.required<string>();

  readonly text = computed(() => {
    const visibility = this.visibility();

    if (visibility === 'public') return 'General.Public';
    if (visibility === 'private') return 'General.Internal';

    return '';
  });
  readonly icon = computed(() => {
    const visibility = this.visibility();

    if (visibility === 'public') return faEarth;
    if (visibility === 'private') return faBuilding;

    return faQuestion;
  });
}
