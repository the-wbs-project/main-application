import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './thread.component.html',
  //styleUrls: ['./thread.component.css'],
})
export class ThreadComponent implements OnInit {
  posts: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
