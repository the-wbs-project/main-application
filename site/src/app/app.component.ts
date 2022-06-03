import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngxs/store';
import { UiState } from './shared/states';

@Component({
  selector: 'wbs-app',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    const close = () => {
      const elem = document.getElementById('glb-loader');

      if (elem) {
        elem.style.display = 'none';
      } else {
        setTimeout(() => {
          close();
        }, 250);
      }
    };

    this.store.select(UiState.isLoading).subscribe((isLoading) => {
      if (isLoading) return;

      close();
    });
  }
}
