import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserCircle } from '@fortawesome/pro-solid-svg-icons';
import { SVGIconModule } from '@progress/kendo-angular-icons';

@Component({
  standalone: true,
  selector: 'wbs-header-profile-picture',
  imports: [FontAwesomeModule, NgClass, NgIf, SVGIconModule],
  template: `<fa-icon
      *ngIf="!picture"
      [icon]="faUserCircle"
      style="font-size: 1.2rem"
      size="2x"
      [ngClass]="['profile-img']"
    />
    <img *ngIf="picture" [src]="picture" class="profile-img" />`,
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
  @Input() picture?: string;

  readonly faUserCircle = faUserCircle;
}
