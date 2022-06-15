import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import { Store } from '@ngxs/store';
import { MetadataState } from '@wbs/shared/states';
import { BehaviorSubject } from 'rxjs';
import { ProjectCreateState } from '../../../project-create.state';
import { CategorySelection } from '../../../view-models';

@Component({
  selector: 'app-project-create-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrls: ['./disciplines.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisciplinesComponent implements OnInit {
  readonly cats$ = new BehaviorSubject<CategorySelection[] | null>([]);
  readonly faCircle = faCircle;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store
      .selectOnce(MetadataState.disciplineCategories)
      .subscribe((cats) => {
        const items: CategorySelection[] = [];

        for (const cat of cats) {
          items.push({
            id: cat.id,
            label: cat.label,
            description: cat.description ?? '',
            number: null,
            selected: false,
          });
        }

        this.cats$.next(items);
      });

    this.store.select(ProjectCreateState.disciplineIds).subscribe((ids) => {
      const items = this.cats$.getValue();

      if (!items) return;
      if (!ids) ids = [];

      for (const item of items) {
        item.selected = ids.indexOf(item.id) > -1;
      }
      this.updateSelected(items);
      this.cats$.next(items);
    });
  }

  changed(): void {
    const items = this.cats$.getValue();

    this.updateSelected(items!);

    this.cats$.next(items);
  }

  nav(): void {
    //this.store.dispatch(new SubmitBasics(title.trim()));
  }

  private updateSelected(items: CategorySelection[]): void {
    let i = 1;

    if (!items) return;

    for (const item of items) {
      if (item.selected) {
        item.number = i;
        i++;
      } else {
        item.number = null;
      }
    }
  }
}
