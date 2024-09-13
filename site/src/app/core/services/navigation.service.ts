import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { MembershipStore } from '../store';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly membership = inject(MembershipStore);
  private readonly router = inject(Router);

  private get org(): string {
    return this.membership.membership()!.name;
  }

  toProject(projectId: string): Observable<boolean> {
    return from(
      this.router.navigate([...this.prefix(), 'projects', projectId, 'view'])
    );
  }

  toLibraryEntry(
    owner: string,
    recordId: string,
    version: number
  ): Observable<boolean> {
    return from(
      this.router.navigate([
        ...this.prefix(),
        'library',
        'view',
        owner,
        recordId,
        version,
        'about',
      ])
    );
  }

  private prefix(): string[] {
    return ['/', this.org];
  }
}
