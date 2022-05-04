import { HttpClient } from '@angular/common/http';
import { saveAs } from '@progress/kendo-file-saver';
import { ExtractPhaseNodeView, WbsPhaseNode } from '@wbs/shared/models';
import { map, Observable, tap } from 'rxjs';

export class ExtractDataService {
  private ownerId: string | undefined;

  constructor(private readonly http: HttpClient) {}

  setOwner(ownerId: string | undefined) {
    this.ownerId = ownerId;
  }

  downloadPhaseAsync(
    projectId: string,
    rows: WbsPhaseNode[]
  ): Observable<void> {
    return this.http
      .post(
        `projects/${this.ownerId}/${projectId}/extracts/phase/download`,
        this.convertPhaseRows(rows),
        {
          responseType: 'blob' as 'json',
        }
      )
      .pipe(
        map((response: any) => {
          console.log(response);
          saveAs(response, 'text.xlsx');
        })
      );
  }

  updatePhaseAsync(
    projectId: string,
    file: ArrayBuffer
  ): Observable<WbsPhaseNode[]> {
    return this.http
      .post<WbsPhaseNode[]>(
        `projects/${this.ownerId}/${projectId}/extracts/phase/upload`,
        file
      )
      .pipe(tap((rows) => console.log(rows)));
  }

  private convertPhaseRows(rows: WbsPhaseNode[]): ExtractPhaseNodeView[] {
    const results: ExtractPhaseNodeView[] = [];

    for (const row of rows) {
      results.push({
        description: row.description,
        disciplineIds: row.disciplines,
        id: row.id,
        levelText: row.levelText,
        order: row.order,
        syncWithDisciplines: row.syncWithDisciplines,
        title: row.title,
      });
    }

    return results;
  }
}
