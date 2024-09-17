import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, ButtonRounded } from '@progress/kendo-angular-buttons';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { ActionButtonMenuItem } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-action-button',
  templateUrl: './action-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    ContextMenuModule,
    NgClass,
    FontAwesomeModule,
    TranslateModule,
  ],
})
export class ActionButtonComponent {
  private readonly router = inject(Router);

  readonly menuIcon = faBars;
  readonly customContent = input(false);
  readonly rounded = input<ButtonRounded>('none');
  readonly buttonClass = input<string>();
  readonly menu = input.required<ActionButtonMenuItem[] | undefined>();
  readonly itemClicked = output<string>();

  selected(item: ActionButtonMenuItem): void {
    if (item.route) {
      this.router.navigate(item.route);
    } else if (item.action) {
      this.itemClicked.emit(item.action);
    }
  }
}
