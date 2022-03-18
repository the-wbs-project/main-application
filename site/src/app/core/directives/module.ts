import { NgModule } from '@angular/core';
import { FillElementDirective } from './fill-element.directive';
import { MatchRowHeightDirective } from './match-row-height.directive copy';

@NgModule({
  declarations: [FillElementDirective, MatchRowHeightDirective],
  exports: [FillElementDirective, MatchRowHeightDirective],
})
export class DirectivesModule {}
