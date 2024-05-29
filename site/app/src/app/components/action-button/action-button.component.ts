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
import { faBoltLightning } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { PopupModule } from '@progress/kendo-angular-popup';
import { ActionButtonMenuItem } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-action-button',
  templateUrl: './action-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, FontAwesomeModule, PopupModule, TranslateModule],
})
export class ActionButtonComponent {
  private readonly store = inject(Store);

  readonly popup = viewChild<ElementRef>('popup');
  readonly anchor = viewChild<ElementRef>('anchor');
  readonly itemClicked = output<string>();
  readonly show = signal(false);

  readonly menu = input.required<ActionButtonMenuItem[] | undefined>();
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

  goto(route: string[]): void {
    this.store.dispatch(new Navigate(route));
  }

  private contains(target: EventTarget | null): boolean {
    const anchor = this.anchor()?.nativeElement;

    if (anchor && anchor.contains(target)) return true;

    const popup = this.popup()?.nativeElement;

    return popup && popup.contains(target);
  }
}
