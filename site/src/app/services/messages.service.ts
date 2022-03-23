import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class Messages {
  constructor(
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService
  ) {}

  saved() {
    this.success('General.InformationSaved');
  }

  debug(message: any) {
    if (environment.production) return;
    console.log(message);
  }

  info(resource: string, isResource = true): void {
    if (isResource) this.show(resource, 'info');
    else this.show2(resource, 'info');
  }

  error(resource: string, isResource = true): void {
    if (isResource) this.show(resource, 'error');
    else this.show2(resource, 'error');
  }

  success(resource: string, isResource = true): void {
    if (isResource) this.show(resource, 'success');
    else this.show2(resource, 'success');
  }

  private show(resource: string, toastr: 'success' | 'error' | 'info') {
    this.translate.get(resource).subscribe((label) => {
      if (!label) return;
      this.show2(label, toastr);
    });
  }

  private show2(label: string, toastr: 'success' | 'error' | 'info') {
    if (toastr === 'error') this.toastr.error(label);
    else if (toastr === 'info') this.toastr.info(label);
    else if (toastr === 'success') this.toastr.success(label);
  }
}
