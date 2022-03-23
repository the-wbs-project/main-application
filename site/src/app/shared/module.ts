import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CoreModule } from '@app/core';
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
