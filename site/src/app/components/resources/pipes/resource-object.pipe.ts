import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Pipe({ name: 'resourceObject', standalone: true })
export class ResourceObjectPipe implements PipeTransform {
  private readonly http = inject(HttpClient);

  transform([urlPrefix, resourceId]: [
    string,
    string
  ]): Observable<ArrayBuffer> {
    return this.http.get(`${urlPrefix}/resources/${resourceId}/blob`, {
      responseType: 'arraybuffer',
    });
  }
}
