import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'wbs-app',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    //@ts-ignore
    Notiflix.Loading.remove();
  }
}
