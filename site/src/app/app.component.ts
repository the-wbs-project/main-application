import { Component, ViewEncapsulation } from '@angular/core';
import { DrawerItem, DrawerSelectEvent } from '@progress/kendo-angular-layout';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  public selected = 'Inbox';

  public items: Array<DrawerItem> = [
    { text: 'Inbox', icon: 'k-i-inbox', selected: true },
    { separator: true },
    { text: 'Notifications', icon: 'k-i-bell' },
    { text: 'Calendar', icon: 'k-i-calendar' },
    { separator: true },
    { text: 'Attachments', icon: 'k-i-hyperlink-email' },
    { text: 'Favourites', icon: 'k-i-star-outline' },
  ];

  public onSelect(ev: DrawerSelectEvent): void {
    this.selected = ev.item.text;
  }
}
