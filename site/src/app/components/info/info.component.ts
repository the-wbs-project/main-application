import { Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

const INFO_PAGES: Record<string, string[]> = {
  'page-not-found': ['Info.PageNotFound', 'Info.PageNotFoundDescription'],
  'invite-not-found': ['Info.InviteNotFound', 'Info.InviteNotFoundDescription'],
  'invite-cancelled': [
    'Info.InviteCancelled',
    'Info.InviteCancelledDescription',
  ],
};

@Component({
  standalone: true,
  templateUrl: './info.component.html',
  imports: [TranslateModule],
})
export class InfoComponent {
  readonly messageId = input.required<string>();
  readonly name = computed(() => INFO_PAGES[this.messageId()][0]);
  readonly description = computed(() => INFO_PAGES[this.messageId()][1]);
}
