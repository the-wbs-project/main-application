import { Component, ViewEncapsulation } from '@angular/core';
import { faClock, faHardHat, faUser } from '@fortawesome/pro-solid-svg-icons';
import { BottomNavigationSelectEvent } from '@progress/kendo-angular-navigation';
import * as is from 'is_js';
import { Device, Messages } from './services';

const bottomNavigationRoutes = [
  { path: '', text: 'Projects', icon: faHardHat },
  { path: 'calendar', text: 'Recent', icon: faClock },
  { path: 'profile', text: 'Profile', icon: faUser },
];

@Component({
  selector: 'wbs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  public selected = 'Inbox';

  bItems = bottomNavigationRoutes;
  public items: Array<any> = [
    { text: 'Inbox', icon: 'k-i-inbox', selected: true },
    { separator: true },
    { text: 'Notifications', icon: 'k-i-bell' },
    { text: 'Calendar', icon: 'k-i-calendar' },
    { separator: true },
    { text: 'Attachments', icon: 'k-i-hyperlink-email' },
    { text: 'Favourites', icon: 'k-i-star-outline' },
  ];
  constructor(readonly device: Device, private readonly messages: Messages) {}

  hello() {
    this.messages.success(
      'hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello',
      false
    );
  }
  navigate(e: BottomNavigationSelectEvent): void {
    console.log(e.item.text);
    this.messages.success(e.item.text, false);
    //console.log(e);
  }
}
