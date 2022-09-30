import { NgModule } from '@angular/core';
import { SharedModule } from '@wbs/shared/module';
import { WbsNodeGeneralComponent } from './wbs-node-general.component';

@NgModule({
  imports: [SharedModule],
  providers: [],
  declarations: [WbsNodeGeneralComponent],
  exports: [WbsNodeGeneralComponent],
})
export class WbsNodeGeneralModule {}
