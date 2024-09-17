import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExpand } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-tree-buttons-fullscreen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, FontAwesomeModule, TranslateModule],
  template: `<button kendoButton size="small">
    <fa-icon [icon]="icon" class="mg-r-5" />
    {{ 'General.FullScreen' | translate }}
  </button>`,
})
export class TreeButtonsFullscreenComponent {
  readonly icon = faExpand;
}
