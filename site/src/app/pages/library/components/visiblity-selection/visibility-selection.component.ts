import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEarth, faLock } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { VisibilityTextComponent } from '@wbs/dummy_components/visibility-text.component';

@Component({
  standalone: true,
  selector: 'wbs-visibility-selection',
  templateUrl: './visibility-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    NgClass,
    TranslateModule,
    VisibilityTextComponent,
  ],
})
export class VisibilitySelectionComponent {
  readonly visibility = model<string | undefined>();
  readonly faEarth = faEarth;
  readonly faLock = faLock;
}
