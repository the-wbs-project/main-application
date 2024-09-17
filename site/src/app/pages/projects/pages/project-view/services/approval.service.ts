import { inject, Injectable } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  ChatComment,
  ProjectApproval,
  ProjectApprovalSaveRecord,
} from '@wbs/core/models';
import { UserStore } from '@wbs/core/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ApprovalService {
  private readonly data = inject(DataServiceFactory);
  private readonly userId = inject(UserStore).userId;

  approvalChanged(
    item: ProjectApproval,
    isApproved: boolean,
    childrenToo: boolean
  ): Observable<unknown> {
    const record: ProjectApprovalSaveRecord = {
      isApproved,
      projectId: item.projectId,
      ids: [item.id],
      approvedBy: this.userId()!,
      approvedOn: new Date(),
    };

    return of(null);

    /*if (childrenToo) record.ids.push(...state.childrenIds!);

    return this.data.projectApprovals
      .putAsync(state.owner!, record.projectId, record)
      .pipe(
        map(() => {
          for (const id of record.ids) {
            const index = state.list.findIndex((x) => x.id === id);

            if (index === -1) continue;

            state.list[index] = {
              id,
              projectId: record.projectId,
              isApproved: record.isApproved,
              approvedBy: record.approvedBy,
              approvedOn: record.approvedOn,
            };
          }

          ctx.patchState({
            current: {
              id: state.current!.id,
              projectId: record.projectId,
              isApproved: record.isApproved,
              approvedBy: record.approvedBy,
              approvedOn: record.approvedOn,
            },
            list: state.list,
          });
        })
      );*/
  }

  sendApprovalMessage(
    item: ProjectApproval,
    author: string,
    message: string
  ): Observable<void> {
    const messageObj: ChatComment = {
      author,
      text: message,
      threadId: this.getThreadId(item),
      timestamp: new Date(),
    };

    return this.data.chat.insertAsync(messageObj).pipe(
      map((newMessage) => {
        newMessage.status = 'Written by ' + newMessage.author.name;
        //ctx.patchState({
        //  messages: [...structuredClone(state.messages ?? []), newMessage],
        // });
      })
    );
  }

  private getThreadId(item: ProjectApproval): string {
    return `approval|${item.projectId}|${item.id}`;
  }
}
