import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserCircle } from '@fortawesome/pro-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'wbs-header-profile-picture',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass],
  template: `@if (picture()) {
    <img [src]="picture()" class="profile-img" />
    } @else {
    <fa-icon
      [icon]="faUserCircle"
      style="font-size: 1.2rem"
      size="2x"
      [ngClass]="'profile-img'"
    />
    }`,
  styles: [
    `
      .profile-img {
        width: 37px;
        height: 37px;
        border-radius: 50%;
        box-shadow: 0px 4px 4px 0px #dbe4f9;
      }
    `,
  ],
})
export class HeaderProfilePictureComponent {
  readonly picture = input.required<string | undefined>();
  readonly faUserCircle = faUserCircle;
}
