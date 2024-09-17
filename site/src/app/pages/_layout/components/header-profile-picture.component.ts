import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarModule } from '@progress/kendo-angular-layout';
import { userIcon } from '@progress/kendo-svg-icons';

@Component({
  standalone: true,
  selector: 'wbs-header-profile-picture',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarModule, NgClass],
  template: `@if (picture(); as pic) {
    <kendo-avatar [imageSrc]="pic" [classList]="['profile-img']" />
    } @else {
    <kendo-avatar [svgIcon]="userIcon" [classList]="['profile-img']" />
    }`,
})
export class HeaderProfilePictureComponent {
  readonly picture = input.required<string | undefined>();
  readonly userIcon = userIcon;
}
