import { Injectable, inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntryNode } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class EntryTaskService {
  private readonly data = inject(DataServiceFactory);
  private readonly messaging = inject(Messages);

  saveAsync(
    owner: string,
    entryId: string,
    versionId: number,
    nodeList: LibraryEntryNode[],
    upserts: LibraryEntryNode[],
    removeIds: string[]
  ): Observable<LibraryEntryNode[]> {
    return this.data.libraryEntryNodes
      .putAsync(owner, entryId, versionId, upserts, removeIds)
      .pipe(
        tap(() => this.messaging.notify.success('Saving!', false)),
        map(() => {
          const list = structuredClone(nodeList);

          for (const id of removeIds) {
            const index = list.findIndex((x) => x.id === id);

            if (index > -1) list.splice(index, 1);
          }

          for (const node of upserts) {
            const index = list.findIndex((x) => x.id === node.id);

            if (index === -1) list.push(node);
            else list[index] = node;
          }
          return list;
        })
      );
  }
}
