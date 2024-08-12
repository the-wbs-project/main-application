import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faBoltLightning } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { MenuModule } from '@progress/kendo-angular-menu';
import { PopupModule } from '@progress/kendo-angular-popup';
import { ActionButtonMenuItem } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-action-button',
  templateUrl: './action-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    MenuModule,
    PopupModule,
    TranslateModule,
  ],
})
export class ActionButtonComponent2 {
  private readonly store = inject(Store);

  readonly popup = viewChild<ElementRef>('popup');
  readonly anchor = viewChild<ElementRef>('anchor');
  readonly itemClicked = output<string>();
  readonly show = signal(false);
  readonly uiVersion = input<'v1' | 'v2'>('v1');

  readonly menu = input.required<ActionButtonMenuItem[] | undefined>();
  readonly menuIcon = faBars;
  readonly faBoltLightning = faBoltLightning;

  @HostListener('document:keydown', ['$event'])
  public keydown(event: KeyboardEvent): void {
    if (event.code === 'Escape') {
      this.toggle(false);
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: KeyboardEvent): void {
    if (!this.contains(event.target)) {
      this.toggle(false);
    }
  }

  toggle(show: boolean = !this.show()): void {
    this.show.set(show);
  }

  selected(item: ActionButtonMenuItem): void {
    if (item.route) {
      this.store.dispatch(new Navigate(item.route));
    } else if (item.action) {
      this.itemClicked.emit(item.action);
    }
  }

  private contains(target: EventTarget | null): boolean {
    const anchor = this.anchor()?.nativeElement;

    if (anchor && anchor.contains(target)) return true;

    const popup = this.popup()?.nativeElement;

    return popup && popup.contains(target);
  }
}
