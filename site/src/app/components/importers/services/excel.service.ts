import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ListItem,
  PROJECT_NODE_VIEW,
  WbsDisciplineNode,
  WbsNodeView,
  WbsPhaseNode,
} from '@wbs/shared/models';
import { map, Observable, switchMap, tap } from 'rxjs';
import * as xlsx from 'xlsx';

@Injectable()
export class ExcelService {
  private readonly categorySheet = 'Categories';
  private readonly nodesSheet = 'WBS';

  constructor(private readonly http: HttpClient) {}

  download(
    view: PROJECT_NODE_VIEW.PHASE,
    disciplines: ListItem[],
    nodes: WbsPhaseNode[]
  ): void;
  download(
    view: PROJECT_NODE_VIEW.DISCIPLINE,
    disciplines: ListItem[],
    nodes: WbsDisciplineNode[]
  ): void;
  download(
    view: PROJECT_NODE_VIEW.PHASE | PROJECT_NODE_VIEW.DISCIPLINE,
    disciplines: ListItem[],
    nodes: WbsNodeView[]
  ): void {
    this.downloadBook(view)
      .pipe(
        switchMap((blob) => this.loadBook(blob)),
        tap((book) => this.addDisciplines(book, disciplines)),
        tap((book) => this.addNodes(book, view, disciplines, nodes)),
        map((book) => {
          xlsx.writeFile(book, 'Project.xlsx');
        })
      )
      .subscribe();
  }

  private addDisciplines(wb: xlsx.WorkBook, disciplines: ListItem[]): void {
    var sheet = wb.Sheets[this.categorySheet];

    for (const cat of disciplines)
      xlsx.utils.sheet_add_aoa(sheet, [[cat.label]], { origin: -1 });
  }

  private addNodes(
    wb: xlsx.WorkBook,
    view: PROJECT_NODE_VIEW.PHASE | PROJECT_NODE_VIEW.DISCIPLINE,
    d: ListItem[],
    nodes: WbsNodeView[]
  ): void {
    var sheet = wb.Sheets[this.nodesSheet];

    if (view === PROJECT_NODE_VIEW.PHASE)
      this.addPhaseNodes(sheet, d, <WbsPhaseNode[]>nodes);
    else this.addDisciplineNodes(sheet, d, <WbsDisciplineNode[]>nodes);
  }

  private addPhaseNodes(
    sheet: xlsx.WorkSheet,
    disciplines: ListItem[],
    nodes: WbsPhaseNode[]
  ): void {
    //for (const cat of disciplines)
    //  xlsx.utils.sheet_add_aoa(sheet, [[cat.label]], { origin: -1 });
  }

  private addDisciplineNodes(
    sheet: xlsx.WorkSheet,
    disciplines: ListItem[],
    nodes: WbsDisciplineNode[]
  ): void {
    //for (const cat of disciplines)
    //  xlsx.utils.sheet_add_aoa(sheet, [[cat.label]], { origin: -1 });
  }

  private downloadBook(view: PROJECT_NODE_VIEW): Observable<Blob> {
    return this.http.get<Blob>(`assets/${view.toLowerCase()}-template.xlsx`, {
      responseType: 'blob' as 'json',
    });
  }

  private loadBook(blob: Blob): Observable<xlsx.WorkBook> {
    return new Observable<xlsx.WorkBook>((observer) => {
      blob.arrayBuffer().then(
        (buffer) => {
          var wb = xlsx.read(buffer, { type: 'array' });

          observer.next(wb);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}
