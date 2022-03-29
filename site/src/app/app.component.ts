import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'wbs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  ngOnInit() {
    fromEvent(window, 'load').subscribe(() =>
      document.querySelector('#glb-loader')?.classList.remove('loaderShow')
    );
  }
}
