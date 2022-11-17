import { NgModule } from '@angular/core';
import { SharedModule } from '@wbs/shared/module';
import { WbsNodeGeneralComponent } from './wbs-node-general.component';

@NgModule({
  imports: [SharedModule],
  declarations: [WbsNodeGeneralComponent],
  exports: [WbsNodeGeneralComponent],
})
export class WbsNodeGeneralModule {}
