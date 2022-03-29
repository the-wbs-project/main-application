import { Injectable } from '@angular/core';
import { DeviceType } from '@wbs/models';
import * as is from 'is_js';

@Injectable({ providedIn: 'root' })
export class Device {
  readonly type: DeviceType;

  constructor() {
    this.type = is.desktop()
      ? 'Desktop'
      : is.mobile()
      ? 'Mobile'
      : is.tablet()
      ? 'Tablet'
      : 'Unknown';
  }
}
