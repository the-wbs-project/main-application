import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  signal,
  viewChild,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion } from '@fortawesome/pro-duotone-svg-icons';
import { faLock } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { PopupModule } from '@progress/kendo-angular-popup';

@Component({
  standalone: true,
  selector: 'wbs-tree-flag-column-header',
  templateUrl: './tree-flag-column-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, PopupModule, TranslateModule],
})
export class TreeFlagColumnHeaderComponent {
  readonly faLock = faLock;
  readonly faCircleQuestion = faCircleQuestion;
  readonly show = signal(false);
  readonly anchor = viewChild<ElementRef>('anchor');
  readonly popup = viewChild<ElementRef>('popup');

  toggle(): void {
    this.show.update((show) => !show);
  }

  @HostListener('document:keydown', ['$event'])
  public keydown(event: KeyboardEvent): void {
    if (event.code === 'Escape') {
      this.show.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: KeyboardEvent): void {
    if (!this.contains(event.target)) {
      this.show.set(false);
    }
  }

  private contains(target: EventTarget | null): boolean {
    return (
      this.anchor()?.nativeElement.contains(target) ||
      (this.popup ? this.popup()?.nativeElement.contains(target) : false)
    );
  }
}
