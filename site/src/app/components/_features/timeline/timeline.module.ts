import { NgModule } from '@angular/core';
import { SharedModule } from '@wbs/shared/module';
import {
  ActionDescriptionPipe,
  ActionIconPipe,
  ActionTitlePipe,
} from './pipes';
import { TimelineComponent } from './timeline.component';

@NgModule({
  imports: [SharedModule],
  providers: [],
  declarations: [
    ActionDescriptionPipe,
    ActionIconPipe,
    ActionTitlePipe,
    TimelineComponent,
  ],
  exports: [TimelineComponent],
})
export class TimelineModule {}
