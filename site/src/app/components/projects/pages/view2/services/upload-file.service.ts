import { Injectable } from '@angular/core';
import { SelectEvent } from '@progress/kendo-angular-upload';
import { Observable } from 'rxjs';

@Injectable()
export class UploadFileService {
  getFile(e: SelectEvent): Observable<ArrayBuffer> {
    return new Observable<ArrayBuffer>((obs) => {
      const file = e.files[0];

      if (!file || file.validationErrors) {
        obs.complete();
        return;
      }
      const reader = new FileReader();

      reader.onload = function (ev) {
        const data = ev.target?.result;

        obs.next(<ArrayBuffer>data);
        obs.complete();
      };

      reader.readAsArrayBuffer(<Blob>file.rawFile);
    });
  }
}
