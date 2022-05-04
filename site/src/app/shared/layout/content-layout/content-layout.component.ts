import {
  AfterContentInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ContainerService, SwitcherService } from '@wbs/shared/services';

@Component({
  selector: 'app-content-layout',
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
    public SwitcherService: SwitcherService
  ) {}

  ngAfterContentInit() {
    this.container.register(undefined, this.body);
  }

  toggleSwitcherBody() {
    this.SwitcherService.emitChange(false);
  }
}
