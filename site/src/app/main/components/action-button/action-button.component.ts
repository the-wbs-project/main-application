import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  input,
  output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoltLightning } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { PopupModule } from '@progress/kendo-angular-popup';
import { ActionButtonMenuItem } from '@wbs/main/models';

@Component({
  standalone: true,
  selector: 'wbs-action-button',
  templateUrl: './action-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, PopupModule, RouterModule, TranslateModule],
})
export class ActionButtonComponent {
  @ViewChild('anchor', { read: ElementRef, static: false }) anchor!: ElementRef;
  @ViewChild('popup', { read: ElementRef, static: false }) popup!: ElementRef;
  readonly itemClicked = output<string>();

  readonly menu = input.required<ActionButtonMenuItem[] | undefined>();
  readonly faBoltLightning = faBoltLightning;

  show = false;

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

  toggle(show?: boolean): void {
    this.show = show !== undefined ? show : !this.show;
  }

  private contains(target: EventTarget | null): boolean {
    if (!this.anchor?.nativeElement || !this.popup?.nativeElement) return false;

    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }
}
