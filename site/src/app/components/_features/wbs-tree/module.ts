import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
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
  LegendPhaseComponent,
  WbsDisciplineTreeComponent,
  WbsLevelPopoverComponent,
  WbsPhaseTreeComponent,
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
    TranslateModule,
    TreeListModule,
  ],
  providers: [WbsPhaseService],
  declarations: [
    DisciplineIconComponent,
    DisciplineIconListComponent,
    LegendDisciplineComponent,
    LegendPhaseComponent,
    WbsDisciplineTreeComponent,
    WbsLevelPopoverComponent,
    WbsPhaseTreeComponent,
    WbsTreeToolbarDirective,
  ],
  exports: [
    WbsDisciplineTreeComponent,
    WbsPhaseTreeComponent,
    WbsTreeToolbarDirective,
  ],
})
export class WbsTreeModule {}
