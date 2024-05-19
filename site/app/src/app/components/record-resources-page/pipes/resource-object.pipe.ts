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
    console.log(urlPrefix);
    console.log(`${urlPrefix}/resources/${resourceId}/file`);
    return this.http.get(`${urlPrefix}/resources/${resourceId}/file`, {
      responseType: 'arraybuffer',
    });
  }
}
