import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'wbs-app',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterModule],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    //@ts-ignore
    Notiflix.Loading.remove();
  }
}
