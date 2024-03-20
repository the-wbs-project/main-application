import { NgClass } from '@angular/common';
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
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';
import { DisciplineLabelPipe } from '@wbs/main/pipes/discipline-label.pipe';

@Component({
  standalone: true,
  selector: 'wbs-tree-discipline-legend',
  templateUrl: './tree-discipline-legend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineIconPipe,
    DisciplineLabelPipe,
    FontAwesomeModule,
    NgClass,
    PopupModule,
    TranslateModule,
  ],
})
export class TreeDisciplineLegendComponent {
  readonly faCircleQuestion = faCircleQuestion;
  readonly show = signal(false);
  readonly idsOrCats = input<ProjectCategory[] | undefined>();
  readonly anchor = viewChild<ElementRef>('anchor');
  readonly popup = viewChild<ElementRef>('popup');

  toggle(): void {
    this.show.update((show) => !show);
  }

  @HostListener('document:keydown', ['$event'])
  public keydown(event: KeyboardEvent): void {
    if (event.code === 'Escape') {
      this.toggle();
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: KeyboardEvent): void {
    if (!this.contains(event.target)) {
      this.toggle();
    }
  }

  private contains(target: EventTarget | null): boolean {
    return (
      this.anchor()?.nativeElement.contains(target) ||
      (this.popup ? this.popup()?.nativeElement.contains(target) : false)
    );
  }
}
