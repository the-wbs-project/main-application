import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { PROJECT_NODE_VIEW, PROJECT_NODE_VIEW_TYPE } from '@wbs/core/models';
import { CategorySelectionService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { map } from 'rxjs/operators';
import { ProjectState } from '../../../../states';
import { ChangeProjectCategories } from '../../../../actions';

@UntilDestroy()
@Component({
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSettingsCategoriesComponent implements OnInit {
  categories?: CategorySelection[];
  readonly cType$ = this.route.data.pipe(
    map((d) => <PROJECT_NODE_VIEW_TYPE>d['cType'])
  );

  constructor(
    private readonly catService: CategorySelectionService,
    private readonly cd: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store
      .select(ProjectState.current)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.rebuild());

    this.route.data.pipe(untilDestroyed(this)).subscribe(() => this.rebuild());
  }

  save(): void {
    const results = this.catService.extract(this.categories);
    const cType: PROJECT_NODE_VIEW_TYPE = this.route.snapshot.data['cType'];

    this.store.dispatch(new ChangeProjectCategories(cType, results));
  }

  private rebuild(): void {
    const project = this.store.selectSnapshot(ProjectState.current);
    const cType: PROJECT_NODE_VIEW_TYPE = this.route.snapshot.data['cType'];

    if (!project) return;

    const cats =
      cType === PROJECT_NODE_VIEW.DISCIPLINE
        ? project.categories.discipline
        : project.categories.phase;

    this.categories = this.catService.build(cType, cats);
    this.cd.detectChanges();
  }
}
