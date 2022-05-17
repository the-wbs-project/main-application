import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ButtonModule,
  DropDownButtonModule,
} from '@progress/kendo-angular-buttons';
import { IconsModule } from '@progress/kendo-angular-icons';
import { TooltipsModule } from '@progress/kendo-angular-tooltip';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { SharedModule } from '@wbs/shared/module';
import {
  DisciplineIconComponent,
  DisciplineIconListComponent,
  LegendDisciplineComponent,
  WbsLevelPopoverComponent,
  WbsTreeComponent,
} from './components';
import { WbsPhaseService } from './services';
import { WbsTreeToolbarDirective } from './directives';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DropDownButtonModule,
    IconsModule,
    SharedModule,
    TooltipsModule,
    TreeListModule,
  ],
  providers: [WbsPhaseService],
  declarations: [
    DisciplineIconComponent,
    DisciplineIconListComponent,
    LegendDisciplineComponent,
    WbsLevelPopoverComponent,
    WbsTreeComponent,
    WbsTreeToolbarDirective,
  ],
  exports: [WbsTreeComponent, WbsTreeToolbarDirective],
})
export class WbsTreeModule {}
