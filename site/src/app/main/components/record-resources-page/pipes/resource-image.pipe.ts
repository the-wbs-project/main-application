import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AppConfig } from '@wbs/core/services';

@Pipe({ name: 'resourceImage', standalone: true })
export class ResourceImagePipe implements PipeTransform {
  private readonly config = inject(AppConfig);
  private readonly domSanitizer = inject(DomSanitizer);

  transform(buffer: ArrayBuffer): SafeUrl {
    let TYPED_ARRAY = new Uint8Array(buffer);
    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');
    let base64String = btoa(STRING_CHAR);

    return this.domSanitizer.bypassSecurityTrustUrl(
      'data:image/jpg;base64, ' + base64String
    );
  }
}
