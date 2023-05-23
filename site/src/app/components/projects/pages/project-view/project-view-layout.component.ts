import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { faArrowUpFromBracket } from '@fortawesome/pro-solid-svg-icons';
import { RouterState } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { DialogService, TitleService } from '@wbs/core/services';
import { map } from 'rxjs/operators';
import { PROJECT_MENU_ITEMS } from './models';
import { ProjectViewService } from './services';
import { ProjectChecklistState, ProjectState } from './states';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectChecklistModalComponent } from './components';

@Component({
  templateUrl: './project-view-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectViewLayoutComponent {
  private readonly project = toSignal(this.store.select(ProjectState.current));
  readonly canSubmit = toSignal(
    this.store.select(ProjectChecklistState.canSubmitForApproval)
  );
  readonly pageView$ = this.store
    .select(RouterState.url)
    .pipe(map(this.getPage));

  readonly faArrowUpFromBracket = faArrowUpFromBracket;
  readonly canModifyAndSubmit = toSignal(
    this.store.select(ProjectState.canSubmit)
  );
  readonly category = computed(() => this.project()?.category);
  readonly title = computed(() => this.project()?.title);
  readonly links = PROJECT_MENU_ITEMS.projectLinks;

  constructor(
    title: TitleService,
    readonly modalService: DialogService,
    readonly service: ProjectViewService,
    readonly store: Store
  ) {
    title.setTitle('Project', false);
  }

  submit(): void {
    const modalRef = this.modalService.openDialog(
      ProjectChecklistModalComponent,
      {
        size: 'lg',
      }
    );
    //modalRef.componentInstance.name = 'World';
    //this.modalService.open(content, { size: 'xl' });

    modalRef.subscribe((results) => {
      console.log(results);
    });
  }

  private getPage(url: string | undefined): string {
    if (!url) return '';

    const parts = url.split('/');
    const parentIndex = parts.indexOf('view');

    return parts[parentIndex + 1];
  }
}
