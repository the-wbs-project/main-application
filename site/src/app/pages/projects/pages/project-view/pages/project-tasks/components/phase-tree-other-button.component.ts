import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEllipsisH,
  faExpand,
  faPencil,
  faX,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ActionButtonComponent } from '@wbs/components/action-button';

@Component({
  standalone: true,
  selector: 'wbs-phase-tree-other-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActionButtonComponent, FontAwesomeModule, TranslateModule],
  template: `<wbs-action-button
    [menu]="menu()"
    [customContent]="true"
    (itemClicked)="selected.emit($event)"
  >
    <fa-icon [icon]="menuIcon" />
  </wbs-action-button>`,
})
export class PhaseTreeOtherButtonComponent {
  readonly menuIcon = faEllipsisH;
  private readonly fullMenu = [
    {
      resource: 'General.FullScreen',
      faIcon: faExpand,
      action: 'goFullScreen',
    },
    {
      resource: 'General.ExitFullScreen',
      faIcon: faX,
      action: 'exitFullScreen',
    },
    {
      resource: 'Projects.EditAbs',
      faIcon: faPencil,
      action: 'editAbs',
    },
  ];

  readonly isFullScreen = input.required<boolean>();
  readonly menu = computed(() => {
    const remove = this.isFullScreen() ? 'goFullScreen' : 'exitFullScreen';

    return this.fullMenu.filter((x) => x.action !== remove);
  });
  readonly selected = output<string>();
}
