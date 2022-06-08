import { Injectable } from '@angular/core';
import {
  DialogService,
  DialogCloseResult,
} from '@progress/kendo-angular-dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Resources } from './resource.service';
import { ContainerService } from './container.service';

@Injectable()
export class ConfirmationService {
  constructor(
    private readonly containerService: ContainerService,
    private readonly dialogService: DialogService,
    private readonly resources: Resources
  ) {}

  delete(contentResource: string): Observable<boolean | null> {
    const content = this.resources.get(contentResource);
    const title = this.resources.get('General.Confirm');
    const no = this.resources.get('General.No');
    const yes = this.resources.get('General.Yes');

    return this.runWithText(content, title, no, yes);
  }

  runWithResources(
    content: string,
    title: string | null = null,
    no: string | null = null,
    yes: string | null = null,
    yesIsPrimary = true,
    width: number | null = null,
    height: number | null = null,
    minWidth: number | null = null
  ): Observable<boolean | null> {
    const content2 = this.resources.get(content);
    const title2 = this.resources.get(title ?? 'General.Confirm');
    const no2 = this.resources.get(no ?? 'General.No');
    const yes2 = this.resources.get(yes ?? 'General.Yes');

    return this.runWithText(
      content2,
      title2,
      no2,
      yes2,
      yesIsPrimary,
      width,
      height,
      minWidth
    );
  }

  info(content: string, title: string): Observable<void> {
    const dialog = this.dialogService.open({
      title: this.resources.get(title),
      content: this.resources.get(content),
      actions: [
        { text: this.resources.get('General.Continue'), primary: true },
      ],
      appendTo: this.containerService.body,
    });

    return dialog.result.pipe(map(() => {}));
  }

  runWithText(
    content: string,
    title: string,
    no: string,
    yes: string,
    yesIsPrimary = true,
    width: number | null = null,
    height: number | null = null,
    minWidth: number | null = null
  ): Observable<boolean | null> {
    const dialog = this.dialogService.open({
      title: title,
      content: content,
      actions: [
        { text: no, primary: !yesIsPrimary },
        { text: yes, primary: yesIsPrimary },
      ],
      width: width ?? 450,
      height: height ?? 200,
      minWidth: minWidth ?? 250,
      appendTo: this.containerService.body,
    });

    return dialog.result.pipe(
      map((result) => {
        if (result instanceof DialogCloseResult) return null;

        return result.text === yes;
      })
    );
  }
}
