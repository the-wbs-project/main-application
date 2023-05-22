import { NgModule } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@wbs/shared/module';
import {
  ActionDescriptionPipe,
  ActionDescriptionTransformPipe,
  ActionIconPipe,
  ActionTitlePipe,
} from './pipes';
import { TimelineComponent } from './timeline.component';
import { TimelineService } from './services';

@NgModule({
  imports: [NgbDropdownModule, SharedModule],
  declarations: [
    ActionDescriptionPipe,
    ActionDescriptionTransformPipe,
    ActionIconPipe,
    ActionTitlePipe,
    TimelineComponent,
  ],
  providers: [TimelineService],
  exports: [TimelineComponent],
})
export class TimelineModule {}
