import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MenuModule } from '@progress/kendo-angular-menu';
import { NavigationLink } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuModule],
  template: `<nav class="app-nav bg-dark">
    <kendo-menu [items]="activeMenu()" (select)="call($event.item)" />
  </nav> `,
})
export class NavigationComponent {
  readonly navigate = output<string[]>();

  readonly menu = input.required<NavigationLink[]>();
  readonly activeSubSection = input<string | undefined>();
  readonly activeMenu = computed(() =>
    this.menuSetup(this.menu(), this.activeSubSection())
  );

  call(action: NavigationLink): void {
    if (action.route) this.navigate.emit(action.route);
  }

  private menuSetup(
    links: NavigationLink[],
    activeSubSection: string | undefined
  ): NavigationLink[] {
    const menu = structuredClone(links);

    for (const link of menu) {
      if (link.section === activeSubSection) {
        if (Array.isArray(link.cssClass)) {
          link.cssClass.push('active');
        } else {
          link.cssClass += ' active';
        }
      }
    }
    return menu;
  }
}
