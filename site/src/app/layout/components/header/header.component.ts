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
import { AuthState } from '@wbs/core/states';
import { Observable } from 'rxjs';
import { LayoutService, NavService, SwitcherService } from '../../services';

@Component({
  selector: 'wbs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Select(AuthState.fullName) fullName$!: Observable<string>;
  @Select(AuthState.isAdmin) isAdmin$!: Observable<boolean>;
  @Select(AuthState.roles) roles$!: Observable<string[]>;

  private readonly switcher = new SwitcherService();
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
    readonly navServices: NavService,
    private readonly layoutService: LayoutService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {}
  toggleSwitcher() {
    this.switcher.emitChange(true);
  }

  toggleSidebarNotification() {
    this.layoutService.emitSidebarNotifyChange(true);
  }

  navigate(url: string[]): void {
    this.store.dispatch(new Navigate(url));
  }
}
