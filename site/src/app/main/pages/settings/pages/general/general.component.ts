import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  templateUrl: './general.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralComponent {}
