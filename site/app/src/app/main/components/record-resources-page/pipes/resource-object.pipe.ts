import { Pipe, PipeTransform } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Observable } from 'rxjs';

@Pipe({ name: 'resourceObject', standalone: true })
export class ResourceObjectPipe implements PipeTransform {
  constructor(private readonly data: DataServiceFactory) {}

  transform([owner, id]: [string, string]): Observable<ArrayBuffer> {
    return this.data.resourceFiles.getAsync(owner, id);
  }
}
