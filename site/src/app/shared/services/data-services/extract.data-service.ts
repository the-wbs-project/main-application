import { HttpClient } from '@angular/common/http';
import { saveAs } from '@progress/kendo-file-saver';
import {
  ExtractPhaseNodeView,
  Project,
  PROJECT_NODE_VIEW_TYPE,
  WbsPhaseNode,
} from '@wbs/shared/models';
import { map, Observable } from 'rxjs';

export class ExtractDataService {
  private ownerId: string | undefined;

  constructor(private readonly http: HttpClient) {}

  setOwner(ownerId: string | undefined) {
    this.ownerId = ownerId;
  }

  downloadNodesAsync(
    project: Project,
    rows: any[],
    view: PROJECT_NODE_VIEW_TYPE
  ): Observable<void> {
    let view2: string = view[0].toUpperCase() + view.substring(1);

    const fileName = `${project.title} - ${view2}.xlsx`;
    return this.http
      .post(
        `projects/${this.ownerId}/${project.id}/extracts/${view}/download`,
        this.convertPhaseRows(rows),
        {
          responseType: 'blob' as 'json',
        }
      )
      .pipe(map((response: any) => saveAs(response, fileName)));
  }

  updatePhaseAsync(
    projectId: string,
    file: ArrayBuffer
  ): Observable<ExtractPhaseNodeView[]> {
    return this.http.post<ExtractPhaseNodeView[]>(
      `projects/${this.ownerId}/${projectId}/extracts/phase/upload`,
      file
    );
  }

  private convertPhaseRows(rows: WbsPhaseNode[]): ExtractPhaseNodeView[] {
    const results: ExtractPhaseNodeView[] = [];

    for (const row of rows) {
      results.push({
        description: row.description,
        disciplines: row.disciplines,
        id: row.id,
        levelText: row.levelText,
        order: row.order,
        syncWithDisciplines: row.syncWithDisciplines,
        title: row.title,
        phaseId: row.phaseId,
        parentId: row.parentId,
      });
    }

    return results;
  }
}
