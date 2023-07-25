import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RouteLink } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  imports: [CommonModule, RouterModule, TranslateModule]
})
export class PageHeaderComponent {
  @Input() title!: string;
  @Input() items!: RouteLink[];
  @Input() active_item!: string;
}
