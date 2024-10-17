import { inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MembershipStore } from '../store';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly membership = inject(MembershipStore);
  private readonly router = inject(Router);
  private readonly _section = signal<string | undefined>(undefined);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => this.setSetion(event.url));

    this.setSetion(this.router.routerState.snapshot.url);
  }

  get section(): Signal<string | undefined> {
    return this._section;
  }

  private get org(): string {
    return this.membership.membership()!.id;
  }

  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(commands, extras);
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

  redirectToJoin(
    organizationId: string,
    inviteId: string
  ): Observable<boolean> {
    return from(this.router.navigate(['/', organizationId, 'join', inviteId]));
  }

  private prefix(): string[] {
    return ['/', this.org];
  }

  private setSetion(path: string) {
    const pathSegments = path.split('/');
    this._section.set(pathSegments[2]);
  }
}
