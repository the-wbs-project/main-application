import { NgModule } from '@angular/core';
import { SharedModule } from '@wbs/shared/module';
import {
  ActionDescriptionPipe,
  ActionDescriptionTransformPipe,
  ActionIconPipe,
  ActionTitlePipe,
} from './pipes';
import { TimelineComponent } from './timeline.component';

@NgModule({
  imports: [SharedModule],
  providers: [],
  declarations: [
    ActionDescriptionPipe,
    ActionDescriptionTransformPipe,
    ActionIconPipe,
    ActionTitlePipe,
    TimelineComponent,
  ],
  exports: [TimelineComponent],
})
export class TimelineModule {}
