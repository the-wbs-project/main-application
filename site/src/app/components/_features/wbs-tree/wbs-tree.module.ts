import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { IconsModule } from '@progress/kendo-angular-icons';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { SharedModule } from '@wbs/shared/module';
import { WbsActionButtonsModule } from '../wbs-action-buttons';
import { WbsNodeGeneralModule } from '../wbs-node-general';
import {
  DisciplineIconComponent,
  DisciplineIconListComponent,
  LegendDisciplineComponent,
} from './components';
import {
  WbsTreeDoubleClickDirective,
  WbsTreeToolbarDirective,
} from './directives';
import { WbsPhaseService } from './services';
import { WbsTreeComponent } from './wbs-tree.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ContextMenuModule,
    IconsModule,
    NgbPopoverModule,
    NgbTooltipModule,
    RouterModule,
    SharedModule,
    TreeListModule,
    WbsActionButtonsModule,
    WbsNodeGeneralModule,
  ],
  providers: [WbsPhaseService],
  declarations: [
    DisciplineIconComponent,
    DisciplineIconListComponent,
    LegendDisciplineComponent,
    WbsTreeComponent,
    WbsTreeDoubleClickDirective,
    WbsTreeToolbarDirective,
  ],
  exports: [WbsTreeComponent, WbsTreeToolbarDirective],
})
export class WbsTreeModule {}
