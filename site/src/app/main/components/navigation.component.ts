import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { MenuModule } from '@progress/kendo-angular-menu';
import { NavigationLink } from '../models';

@Component({
  standalone: true,
  selector: 'wbs-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuModule],
  template: `<nav class="app-nav bg-dark">
    <kendo-menu [items]="menu()" (select)="call($event.item)" />
  </nav> `,
})
export class NavigationComponent {
  readonly menu = input.required<NavigationLink[]>();
  @Output() readonly navigate = new EventEmitter<string[]>();

  call(action: NavigationLink): void {
    if (action.route) this.navigate.emit(action.route);
  }
}
