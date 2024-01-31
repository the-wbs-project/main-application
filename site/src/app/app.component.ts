import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'wbs-app',
  template: '<router-outlet />',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterModule],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    //@ts-ignore
    var i = 0;
    //@ts-ignore
    Notiflix.Loading.remove();
  }
}
