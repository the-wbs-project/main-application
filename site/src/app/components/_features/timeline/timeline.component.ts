import { Component, Input, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Activity } from '@wbs/shared/models';
import { Messages } from '@wbs/shared/services';
import { TimelineState } from '@wbs/shared/states';
import { Observable } from 'rxjs';

@Component({
  selector: 'wbs-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  @Input() id?: string;
  @Select(TimelineState.timeline) timeline$!: Observable<Activity[]>;

  constructor(private readonly messages: Messages) {}

  ngOnInit(): void {}

  soon() {
    this.messages.info('Discussion Coming Soon...', false);
  }
}
