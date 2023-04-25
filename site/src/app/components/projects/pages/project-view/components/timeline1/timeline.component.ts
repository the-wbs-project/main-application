import { Component, OnInit } from '@angular/core';
import { faArrowUpArrowDown, faPencil } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'wbs-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class Timeline1Component implements OnInit {
  readonly faArrowUpArrowDown = faArrowUpArrowDown;
  readonly faPencil = faPencil;

  ngOnInit(): void {}
}
