import {
  AfterContentInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ContainerService, SwitcherService } from '@wbs/shared/services';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
})
export class ContentLayoutComponent implements AfterContentInit {
  @ViewChild('body', { static: true, read: ViewContainerRef })
  body: ViewContainerRef | undefined;
  layoutSub!: Subscription;
  sidenavtoggled1: any;

  constructor(
    private readonly container: ContainerService,
    private readonly switcher: SwitcherService
  ) {}

  ngAfterContentInit() {
    this.container.register(undefined, this.body);
  }

  toggleSwitcherBody() {
    this.switcher.emitChange(false);
  }
}
