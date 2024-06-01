import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as faStarRegular } from '@fortawesome/pro-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/pro-solid-svg-icons';
import { Position, TooltipModule } from '@progress/kendo-angular-tooltip';
import { DataServiceFactory } from '@wbs/core/data-services';
import { UserStore } from '@wbs/core/store';

@Component({
  standalone: true,
  selector: 'wbs-watch-indicator',
  template: `<div
    kendoTooltip
    class="tx-primary pointer"
    [ngClass]="{ 'hover-visible': !watched() && !alwaysShow() }"
    [position]="tooltipPosition()"
    [title]="watched() ? 'Remove From Watched List' : 'Add To Watched List'"
    (click)="changed($event)"
  >
    <span class="child-to-show">
      <fa-icon [icon]="icon()" [spin]="saving()" />
    </span>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass, TooltipModule],
})
export class WatchIndicatorComponent {
  private readonly data = inject(DataServiceFactory);
  private readonly userStore = inject(UserStore);

  readonly tooltipPosition = input<Position>('right');
  readonly source = input.required<'library' | 'project'>();
  readonly owner = input.required<string>();
  readonly entityId = input.required<string>();
  readonly alwaysShow = input(true);
  readonly saving = signal(false);

  private watchSource = computed(() => {
    return this.source() === 'library'
      ? this.userStore.watchers.library
      : this.userStore.watchers.projects;
  });
  readonly icon = computed(() =>
    this.watched() ? faStarSolid : faStarRegular
  );
  readonly watched = computed(() => {
    const source = this.watchSource();

    return source
      .items()
      .some((w) => w.ownerId === this.owner() && w.id === this.entityId());
  });

  protected changed(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const watch = !this.watched();
    const ownerId = this.owner();
    const id = this.entityId();
    const watcherId = this.userStore.userId()!;
    const source = this.watchSource();

    this.saving.set(true);
    if (watch) {
      this.data.libraryEntryWatchers
        .addAsync(ownerId, id, watcherId)
        .subscribe(() => {
          source.add({ ownerId, id });
          this.saving.set(false);
        });
    } else {
      this.data.libraryEntryWatchers
        .deleteAsync(ownerId, id, watcherId)
        .subscribe(() => {
          source.remove({ ownerId, id });
          this.saving.set(false);
        });
    }
  }
}
