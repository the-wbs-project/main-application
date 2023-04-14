import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { DiscussionForumState } from '../../states';

@Component({
  templateUrl: './thread.component.html',
  //styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent implements OnInit {
  readonly posts$ = this.store.select(DiscussionForumState.posts);
  readonly thread$ = this.store.select(DiscussionForumState.thread);
  readonly threadTextUrl$ = this.store.select(
    DiscussionForumState.threadTextUrl
  );

  constructor(
    private readonly modalService: NgbModal,
    private readonly store: Store
  ) {}

  ngOnInit(): void {}
}
