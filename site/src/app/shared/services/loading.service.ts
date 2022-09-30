import { Injectable } from '@angular/core';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { LoadingComponent } from '../components';
import { ContainerService } from './container.service';

@Injectable()
export class LoadingService {
  private ref: DialogRef | undefined;

  constructor(
    private readonly container: ContainerService,
    private readonly dialogService: DialogService
  ) {}

  launch(message: string): void {
    this.ref = this.dialogService.open({
      content: LoadingComponent,
      appendTo: this.container.body,
      width: 300,
      height: 300,
    });
    this.comp(this.ref).message$.next(message);
  }

  close() {
    this.comp(this.ref!).closeMe();
  }

  private comp(ref: DialogRef): LoadingComponent {
    return ref.content.instance;
  }
}
