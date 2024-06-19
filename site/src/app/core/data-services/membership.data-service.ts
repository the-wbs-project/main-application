import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Invite, InviteBody, Member, Organization } from '../models';

export class MembershipDataService {
  constructor(private readonly http: HttpClient) {}

  getMembershipsAsync(): Observable<Organization[]> {
    return this.http.get<any[]>('api/memberships').pipe(
      map((orgs) => {
        const list: Organization[] = [];

        for (const org of orgs) {
          list.push({
            name: org.name,
            display_name: org.displayName,
            metadata: org.metadata,
            branding: org.branding,
          });
        }
        return list;
      })
    );
  }

  getMembershipUsersAsync(
    organization: string,
    forceRefresh = false
  ): Observable<Member[]> {
    return this.http.get<Member[]>(
      `api/organizations/${organization}/members`,
      {
        headers: {
          'force-refresh': forceRefresh.toString(),
        },
      }
    );
  }

  getInvitesAsync(organization: string): Observable<Invite[]> {
    return this.http.get<Invite[]>(`api/organizations/${organization}/invites`);
  }

  sendInvitesAsync(
    organization: string,
    inviteBody: InviteBody
  ): Observable<Invite> {
    return this.http.post<Invite>(
      `api/organizations/${organization}/invites`,
      inviteBody
    );
  }

  cancelInviteAsync(organization: string, inviteId: string): Observable<void> {
    return this.http.delete<void>(
      `api/organizations/${organization}/invites/${inviteId}`
    );
  }

  removeUserFromOrganizationAsync(
    organization: string,
    user: string
  ): Observable<void> {
    return this.http.delete<void>(
      `api/organizations/${organization}/members/${user}`
    );
  }

  getMembershipRolesForUserAsync(
    organization: string,
    user: string
  ): Observable<string[]> {
    return this.http.get<string[]>(
      `api/organizations/${organization}/members/${user}/roles`
    );
  }

  addUserOrganizationalRolesAsync(
    organization: string,
    user: string,
    roles: string[]
  ): Observable<void> {
    return this.http.put<void>(
      `api/organizations/${organization}/members/${user}/roles`,
      roles
    );
  }

  removeUserOrganizationalRolesAsync(
    organization: string,
    user: string,
    roles: string[]
  ): Observable<void> {
    return this.http.delete<void>(
      `api/organizations/${organization}/members/${user}/roles`,
      {
        body: roles,
      }
    );
  }
}
