import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'wbs-post',
  templateUrl: './post.component.html',
  //styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: any;

  constructor() {}

  ngOnInit(): void {}
}
