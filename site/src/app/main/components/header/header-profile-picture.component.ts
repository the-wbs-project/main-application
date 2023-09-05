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
      [ngClass]="['profile-icon']"
    />
    <img *ngIf="picture" [src]="picture" class="profile-icon" />`,
})
export class HeaderProfilePictureComponent {
  @Input() picture?: string;

  readonly faUserCircle = faUserCircle;
}
