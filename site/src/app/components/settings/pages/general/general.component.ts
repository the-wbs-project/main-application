import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './general.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralComponent {}
