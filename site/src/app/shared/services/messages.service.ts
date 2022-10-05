import { Injectable } from '@angular/core';
import {
  NotificationService,
  Position,
} from '@progress/kendo-angular-notification';
import { Device } from './device.service';
import { Resources } from './resource.service';

const prefixOfPrefix = 'notification';

@Injectable({ providedIn: 'root' })
export class Messages {
  private cssClassPrefix = prefixOfPrefix;
  private starterCss: string[];
  private readonly position: Position;

  constructor(
    device: Device,
    private readonly notificationService: NotificationService,
    private readonly resources: Resources
  ) {
    this.starterCss = [
      'notification',
      'notification-' + device.type.toLowerCase(),
    ];
    this.position =
      device.type === 'Desktop'
        ? { horizontal: 'right', vertical: 'top' }
        : { horizontal: 'center', vertical: 'bottom' };
  }

  changeColorClass(altColors: boolean): void {
    this.cssClassPrefix = prefixOfPrefix + (altColors ? '-alt' : '');
  }

  info(resource: string, isResource = true): void {
    this.show(resource, isResource, 'info');
  }

  error(resource: string, isResource = true): void {
    this.show(resource, isResource, 'error');
  }

  success(resource: string, isResource = true): void {
    console.log(resource);
    this.show(resource, isResource, 'success');
  }

  show(
    label: string,
    isResource: boolean,
    toastr: 'success' | 'error' | 'info'
  ) {
    if (isResource) label = this.resources.get(label);

    this.notificationService.show({
      content: label,
      hideAfter: 2400,
      type: { style: 'none', icon: true },
      animation: { type: 'fade', duration: 400 },
      position: this.position,
      cssClass: [...this.starterCss, `${this.cssClassPrefix}-${toastr}`].join(
        ' '
      ),
    });
  }
}
