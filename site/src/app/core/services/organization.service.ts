import { Injectable, inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Organization } from '@wbs/core/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { skipWhile, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly data = inject(DataServiceFactory);
  private readonly names = new Map<
    string,
    BehaviorSubject<string | undefined>
  >();

  getNameAsync(orgName: string): Observable<string | undefined> {
    if (this.names.has(orgName)) {
      return this.names.get(orgName)!.pipe(skipWhile((u) => u === undefined));
    }
    this.names.set(orgName, new BehaviorSubject<string | undefined>(undefined));

    return this.data.organizations
      .getNameAsync(orgName)
      .pipe(tap((org) => this.names.get(orgName)!.next(org)));
  }

  addOrganization(orgName: string, displayName: string): void {
    if (this.names.has(orgName)) return;

    this.names.set(
      orgName,
      new BehaviorSubject<string | undefined>(displayName)
    );
  }
}
