import { Component, OnInit } from '@angular/core';
import { faTriangleExclamation } from '@fortawesome/pro-light-svg-icons';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { DiscussionForumState } from '../../states';

@Component({
  templateUrl: './forum.component.html',
  //styleUrls: ['./forum.component.css'],
})
export class ForumComponent implements OnInit {
  readonly threads$ = this.store.select(DiscussionForumState.threads);

  readonly faPlus = faPlus;
  readonly faTriangleExclamation = faTriangleExclamation;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {}
}
