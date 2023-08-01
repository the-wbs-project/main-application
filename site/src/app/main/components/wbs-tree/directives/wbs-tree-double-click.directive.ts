import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TreeListComponent } from '@progress/kendo-angular-treelist';
import { delay } from 'rxjs/operators';

@UntilDestroy()
@Directive({ selector: '[wbsTreeDoubleClick]', standalone: true })
export class WbsTreeDoubleClickDirective implements OnInit {
  @Input('wbsTreeDoubleClick') treeList!: TreeListComponent;
  @Output() readonly dblClicked = new EventEmitter<string>();

  constructor(private readonly el: ElementRef) {}

  ngOnInit(): void {
    this.treeList.expandEvent
      .pipe(delay(100), untilDestroyed(this))
      .subscribe(() => this.render());
    this.treeList.collapseEvent
      .pipe(delay(100), untilDestroyed(this))
      .subscribe(() => this.render());

    setTimeout(() => {
      this.render();
    }, 50);
  }

  private render(): void {
    const rows: HTMLTableRowElement[] =
      this.el.nativeElement
        .querySelector('kendo-treelist-list')
        ?.querySelectorAll('tr') ?? [];

    if (rows.length === 0) {
      setTimeout(() => {
        this.render();
      }, 100);
      return;
    }

    for (const row of rows) {
      const handler = () => {
        const value = (row.querySelectorAll('td') ?? [])[0].querySelector(
          'input'
        )?.value;

        if (value) this.dblClicked.emit(value);
      };

      row.removeEventListener('dblclick', handler, {
        capture: false,
      });
      row.addEventListener('dblclick', handler);
    }
  }
}
