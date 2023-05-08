import { Component } from '@angular/core';
import { faAlignLeft, faX } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'wbs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  readonly faAlignLeft = faAlignLeft;
  readonly faX = faX;
  isCollapsed = true;
}
