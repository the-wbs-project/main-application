import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { SelectEvent } from '@progress/kendo-angular-upload';
import {
  DataServiceFactory,
  TitleService,
  Transformers,
} from '@wbs/shared/services';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { ProjectState } from 'src/app/components/projects/states';

@Component({
  templateUrl: './project-manage.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportProjectManageComponent {
  constructor(
    title: TitleService,
    //private readonly excel: ExcelService,
    private readonly data: DataServiceFactory,
    private readonly store: Store,
    private readonly transformers: Transformers
  ) {
    title.setTitle('Project Management', false);
  }

  download() {
    forkJoin({
      nodes: this.store.selectOnce(ProjectState.nodes),
      project: this.store.selectOnce(ProjectState.current),
    })
      .pipe(
        map((data) => {
          return {
            ...data,
            vmNodes: this.transformers.wbsNodePhase.run(
              data.project!,
              data.nodes!
            ),
          };
        })
      )
      .subscribe();
  }

  select(e: SelectEvent): void {
    const proj = this.store.selectSnapshot(ProjectState.current)!;

    this.getFile(e)
      .pipe(
        switchMap((buffer) =>
          this.data.extracts.updatePhaseAsync(proj.id, buffer)
        )
      )
      .subscribe((rows) => console.log(rows));
  }

  private getFile(e: SelectEvent): Observable<ArrayBuffer> {
    return new Observable<ArrayBuffer>((obs) => {
      const file = e.files[0];

      if (!file || file.validationErrors) {
        obs.complete();
        return;
      }
      const reader = new FileReader();

      reader.onload = function (ev) {
        const data = ev.target?.result;

        obs.next(<ArrayBuffer>data);
        obs.complete();
      };

      reader.readAsArrayBuffer(<Blob>file.rawFile);
    });
  }
}

//http://localhost:88/import/projects/123
