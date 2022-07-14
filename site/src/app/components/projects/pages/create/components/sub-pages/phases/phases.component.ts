import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  faCircle,
  faEye,
  faEyeSlash,
  faPlus,
} from '@fortawesome/pro-thin-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { ListItem } from '@wbs/shared/models';
import { ContainerService, IdService } from '@wbs/shared/services';
import { MetadataState } from '@wbs/shared/states';
import { BehaviorSubject } from 'rxjs';
import { PhasesChosen } from '../../../project-create.actions';
import { ProjectCreateState } from '../../../project-create.state';
import { CategorySelection } from '../../../view-models';
import { CustomDialogComponent } from '../../custom-dialog/custom-dialog.component';

@UntilDestroy()
@Component({
  selector: 'app-project-create-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PhaseComponent implements OnInit {
  private cats: CategorySelection[] | undefined;
  readonly hideUnselected$ = new BehaviorSubject<boolean>(false);
  readonly cats$ = new BehaviorSubject<CategorySelection[]>([]);
  readonly faCircle = faCircle;
  readonly faEye = faEye;
  readonly faEyeSlash = faEyeSlash;
  readonly faPlus = faPlus;

  constructor(
    private readonly containers: ContainerService,
    private readonly dialog: DialogService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    const cats = this.store.selectSnapshot(MetadataState.phaseCategories);
    const items: CategorySelection[] = [];

    for (const cat of cats) {
      items.push({
        id: cat.id,
        label: cat.label,
        description: cat.description ?? '',
        number: null,
        selected: false,
        isCustom: false,
      });
    }
    this.cats = items;

    this.store
      .select(ProjectCreateState.phases)
      .pipe(untilDestroyed(this))
      .subscribe((existing) => {
        const usedIds: string[] = [];
        const items: CategorySelection[] = [];

        for (const x of existing ?? []) {
          if (typeof x === 'string') {
            const cat = this.cats!.find((c) => c.id === x);

            if (cat) {
              items.push({
                id: cat.id,
                label: cat.label,
                description: cat.description ?? '',
                number: null,
                selected: true,
                isCustom: false,
              });
              usedIds.push(x);
            }
          } else {
            items.push({
              id: x.id,
              label: x.label,
              description: x.description ?? '',
              number: null,
              selected: true,
              isCustom: true,
            });
            usedIds.push(x.id);
          }
        }

        for (const cat of this.cats!) {
          if (usedIds.indexOf(cat.id) > -1) continue;

          items.push({
            id: cat.id,
            label: cat.label,
            description: cat.description ?? '',
            number: null,
            selected: false,
            isCustom: false,
          });
        }

        this.cats$.next(items);
      });
  }

  changed(): void {
    const items = this.cats$.getValue();

    this.updateSelected(items!);

    this.cats$.next(items);
  }

  nav(): void {
    const ids: (string | ListItem)[] = [];

    for (const x of this.cats$.getValue()!) {
      if (!x.selected) continue;
      if (!x.isCustom) ids.push(x.id);
      else
        ids.push({
          id: x.id,
          label: x.label,
          type: 'Custom',
          description: x.description,
          tags: [],
        });
    }
    this.store.dispatch(new PhasesChosen(ids));
  }

  showCreate() {
    const dialog = this.dialog.open({
      content: CustomDialogComponent,
      appendTo: this.containers.body,
    });

    (<CustomDialogComponent>dialog.content.instance).dialogTitle$.next(
      'Something.Something'
    );

    dialog.result.subscribe((result: [string, string] | DialogCloseResult) => {
      if (result instanceof DialogCloseResult) return;

      const item: CategorySelection = {
        id: IdService.generate(),
        description: result[1],
        isCustom: true,
        label: result[0],
        number: null,
        selected: true,
      };
      const items = [item, ...this.cats$.getValue()];

      this.updateSelected(items);

      this.cats$.next(items);
    });
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
