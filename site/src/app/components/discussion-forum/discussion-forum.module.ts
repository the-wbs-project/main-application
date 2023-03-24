import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { LabelModule } from '@progress/kendo-angular-label';
import { SharedModule } from '@wbs/shared/module';
import {
  EditorComponent,
  ForumComponent,
  PostComponent,
  ThreadComponent,
} from './components';
import { DiscussionDataService } from './services';
import { DiscussionForumState } from './states';

export const routes: Routes = [
  {
    path: '',
    component: ForumComponent,
  },
  {
    path: 'write',
    component: EditorComponent,
  },
];

@NgModule({
  imports: [
    LabelModule,
    NgxsModule.forFeature([DiscussionForumState]),
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    EditorComponent,
    ForumComponent,
    PostComponent,
    ThreadComponent,
  ],
  providers: [DiscussionDataService],
})
export class DiscussionForumModule {}
