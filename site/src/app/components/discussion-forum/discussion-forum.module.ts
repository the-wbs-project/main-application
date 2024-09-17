import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxsModule } from '@ngxs/store';
import { LabelModule } from '@progress/kendo-angular-label';
import { SharedModule } from '@wbs/shared/module';
import {
  ForumComponent,
  PostComponent,
  ReplyEditorComponent,
  ThreadComponent,
} from './components';
import { DiscussionDataService } from './services';
import { DiscussionForumState } from './states';
import { ThreadLoadGuard } from './guards/thread-load-guard.service';

export const routes: Routes = [
  {
    path: '',
    component: ForumComponent,
  },
  {
    path: ':postId',
    component: ThreadComponent,
    canActivate: [ThreadLoadGuard],
  },
];

@NgModule({
  imports: [
    LabelModule,
    NgbDropdownModule,
    NgxsModule.forFeature([DiscussionForumState]),
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    ForumComponent,
    PostComponent,
    ReplyEditorComponent,
    ThreadComponent,
  ],
  providers: [DiscussionDataService, ThreadLoadGuard],
})
export class DiscussionForumModule {}
