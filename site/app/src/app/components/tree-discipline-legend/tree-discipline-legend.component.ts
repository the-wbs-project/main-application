import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { PopupModule } from '@progress/kendo-angular-popup';
import { ProjectCategory } from '@wbs/core/models';
import { DisciplineListComponent } from '@wbs/components/_utils/discipline-list.component';
import { DisciplineSplitListComponent } from '@wbs/components/_utils/discipline-split-list.component';

@Component({
  standalone: true,
  selector: 'wbs-tree-discipline-legend',
  templateUrl: './tree-discipline-legend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineListComponent,
    DisciplineSplitListComponent,
    FontAwesomeModule,
    PopupModule,
    TranslateModule,
  ],
})
export class TreeDisciplineLegendComponent {
  readonly faCircleQuestion = faCircleQuestion;
  readonly show = signal(false);
  readonly list = input.required<ProjectCategory[]>();
  readonly anchor = viewChild<ElementRef>('anchor');
  readonly popup = viewChild<ElementRef>('popup');

  toggle(): void {
    this.show.update((show) => !show);
  }

  @HostListener('document:keydown', ['$event'])
  public keydown(event: KeyboardEvent): void {
    if (event.code === 'Escape') {
      this.show.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: KeyboardEvent): void {
    if (!this.contains(event.target)) {
      this.show.set(false);
    }
  }

  private contains(target: EventTarget | null): boolean {
    return (
      this.anchor()?.nativeElement.contains(target) ||
      (this.popup ? this.popup()?.nativeElement.contains(target) : false)
    );
  }
}
