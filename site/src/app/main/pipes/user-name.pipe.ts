import { Pipe, PipeTransform } from '@angular/core';
import { Resources } from '@wbs/core/services';
import { Observable, map, of } from 'rxjs';
import { UserService } from '../services';

@Pipe({ name: 'userName', standalone: true })
export class UserNamePipe implements PipeTransform {
  constructor(
    private readonly resoures: Resources,
    private readonly service: UserService
  ) {}

  transform(userId: string | null | undefined): Observable<string | undefined> {
    if (!userId) return of(undefined);

    return (
      this.service.getUser(userId).pipe(map((user) => user?.name)) ??
      this.resoures.get('General.UnknownUser')
    );
  }
}
