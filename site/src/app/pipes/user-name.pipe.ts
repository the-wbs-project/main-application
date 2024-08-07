import { Pipe, PipeTransform } from '@angular/core';
import { Resources, UserService } from '@wbs/core/services';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({ name: 'userName', standalone: true })
export class UserNamePipe implements PipeTransform {
  constructor(
    private readonly resoures: Resources,
    private readonly service: UserService
  ) {}

  transform([organization, userId]: [
    string | null | undefined,
    string | null | undefined
  ]): Observable<string | undefined> {
    if (!organization || !userId) return of(undefined);

    return (
      this.service
        .getUserAsync(organization, userId)
        .pipe(map((user) => user?.fullName)) ??
      this.resoures.get('General.UnknownUser')
    );
  }
}
