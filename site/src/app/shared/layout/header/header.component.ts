import { Component, OnInit } from '@angular/core';
import {
  faAlignLeft,
  faArrowAltCircleLeft,
  faCog,
  faUserCircle,
  faX,
} from '@fortawesome/pro-solid-svg-icons';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import {
  LayoutService,
  NavService,
  SwitcherService,
} from '@wbs/shared/services';
import { AuthState } from '@wbs/shared/states';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Select(AuthState.fullName) fullName$!: Observable<string>;
  @Select(AuthState.isAdmin) isAdmin$!: Observable<boolean>;

  readonly faAlignLeft = faAlignLeft;
  readonly faArrowAltCircleLeft = faArrowAltCircleLeft;
  readonly faCog = faCog;
  readonly faUserCircle = faUserCircle;
  readonly faX = faX;
  readonly settings = [
    {
      text: 'General.CreateProject',
      url: ['/projects', 'create'],
    },
  ];
  isCollapsed = true;
  activated: boolean = false;

  constructor(
    readonly SwitcherService: SwitcherService,
    readonly navServices: NavService,
    private readonly layoutService: LayoutService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {}
  toggleSwitcher() {
    this.SwitcherService.emitChange(true);
  }

  toggleSidebarNotification() {
    this.layoutService.emitSidebarNotifyChange(true);
  }

  navigate(url: string[]): void {
    this.store.dispatch(new Navigate(url));
  }
}
