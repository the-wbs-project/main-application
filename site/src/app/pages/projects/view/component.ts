import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectLite } from '@app/models';
import { TitleService } from '@app/services';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectsViewModel } from './view-models';

@Component({
  templateUrl: './component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsViewComponent {
  readonly projects$: Observable<ProjectLite[]>;
  readonly filters$: Observable<string[]>;

  constructor(
    title: TitleService,
    route: ActivatedRoute,
    private readonly store: Store
  ) {
    title.setTitle((<ProjectsViewModel>route.snapshot.data['vm']).title, true);

    const vm = route.data.pipe(map((x) => <ProjectsViewModel>x['vm']));

    this.projects$ = vm.pipe(map((x) => x.projects));
    this.filters$ = vm.pipe(map((x) => x.filters));
  }
}
