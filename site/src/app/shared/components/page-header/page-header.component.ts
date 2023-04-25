import { Component, Input } from '@angular/core';
import { RouteLink } from '@wbs/core/models';

@Component({
  selector: 'wbs-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  @Input() title!: string;
  @Input() items!: RouteLink[];
  @Input() active_item!: string;
}
