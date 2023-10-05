import { NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  ViewChild,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoltLightning } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { PopupModule } from '@progress/kendo-angular-popup';
import { FaToKendoPipe } from '@wbs/main/pipes/fa-to-kendo.pipe';
import { ProjectActionButtonService } from './project-action-button.service';
import { ProjectAction } from './project-action.model';
import { Project } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-project-action-button',
  templateUrl: './project-action-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FaToKendoPipe,
    FontAwesomeModule,
    NgForOf,
    NgIf,
    PopupModule,
    RouterModule,
    TranslateModule,
  ],
  providers: [ProjectActionButtonService],
})
export class ProjectActionButtonComponent implements OnChanges {
  @ViewChild('anchor', { read: ElementRef, static: false }) anchor!: ElementRef;
  @ViewChild('popup', { read: ElementRef, static: false }) popup!: ElementRef;
  @Input({ required: true }) project?: Project;

  readonly menu = signal<ProjectAction[] | undefined>(undefined);
  readonly faBoltLightning = faBoltLightning;

  show = false;

  constructor(readonly service: ProjectActionButtonService) {}

  ngOnChanges(): void {
    if (this.project) {
      this.menu.set(this.service.buildMenu(this.project));
    }
  }

  @HostListener('document:keydown', ['$event'])
  public keydown(event: KeyboardEvent): void {
    if (event.code === 'Escape') {
      this.toggle(false);
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: KeyboardEvent): void {
    if (!this.contains(event.target)) {
      this.toggle(false);
    }
  }

  toggle(show?: boolean): void {
    this.show = show !== undefined ? show : !this.show;
  }

  private contains(target: EventTarget | null): boolean {
    if (!this.anchor?.nativeElement || !this.popup?.nativeElement) return false;

    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }
}
