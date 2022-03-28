import { NgModule } from '@angular/core';
import { FillElementDirective } from './directives';
import {
  LengthPipe,
  ProjectListFilterLengthPipe,
  ProjectListFilterPipe,
} from './pipes';

@NgModule({
  imports: [],
  providers: [],
  declarations: [
    FillElementDirective,
    LengthPipe,
    ProjectListFilterPipe,
    ProjectListFilterLengthPipe,
  ],
  exports: [FillElementDirective],
})
export class SharedModule {}
