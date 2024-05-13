import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuItem } from '@wbs/main/models';

@Component({
  standalone: true,
  selector: 'wbs-context-menu-item',
  template: `@if (item(); as item) {
    <span class="d-inline-block wd-30">
      @if (item.faIcon) { @if (stringIcon(); as icon) {
      <i class="fa-solid fa-sm" [ngClass]="icon"></i>
      } @if (objIcon(); as icon) {
      <fa-icon [icon]="icon" /> } }
    </span>
    @if (item.isNotResource) { {{ item.text }} } @else {
    {{ item.text | translate }}
    } }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass, TranslateModule],
})
export class ContextMenuItemComponent {
  readonly item = input.required<ContextMenuItem>();
  readonly stringIcon = computed(() => {
    const item = this.item();

    return typeof item.faIcon === 'string' ? item.faIcon : undefined;
  });
  readonly objIcon = computed(() => {
    const item = this.item();

    return typeof item.faIcon === 'string' ? undefined : item.faIcon;
  });

  isString = (value: any): boolean => typeof value === 'string';
}
