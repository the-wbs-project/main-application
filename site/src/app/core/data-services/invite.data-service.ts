import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Invite, NewInvite } from '../models';
import { Utils } from '../services';

export class InviteDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(organizationId: string): Observable<Invite[]> {
    return this.http
      .get<Invite[]>(`api/invites/${organizationId}`)
      .pipe(
        tap((list) =>
          Utils.cleanDates(
            list,
            'lastInviteSentDate',
            'signupDate',
            'creationDate',
            'lastModifiedDate'
          )
        )
      );
  }

  resendAsync(organizationId: string, userId: string): Observable<void> {
    return this.http.get<void>(
      `api/invites/${organizationId}/${userId}/resend`
    );
  }

  createAsync(invite: NewInvite): Observable<void> {
    return this.http.post<void>(`api/invites/${invite.organizationId}`, invite);
  }

  updateAsync(invite: Invite): Observable<void> {
    return this.http.put<void>(
      `api/invites/${invite.organizationId}/${invite.invitedById}`,
      invite
    );
  }

  cancelAsync(organizationId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`api/invites/${organizationId}/${userId}`);
  }
}
