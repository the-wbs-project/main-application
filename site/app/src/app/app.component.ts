import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'wbs-app',
  template: '<router-outlet />',
  imports: [RouterModule],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    //@ts-ignore
    Notiflix.Loading.remove();
  }
}
