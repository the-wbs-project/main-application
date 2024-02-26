import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import {
  PDFViewerModule,
  PDFViewerTool,
} from '@progress/kendo-angular-pdfviewer';
import { ResourceRecord } from '@wbs/core/models';
import { YouTubeSizerDirective } from '../../directives/youtube-sizer.directive';
import { ResourceObjectPipe } from '../../pipes/resource-object.pipe';
import { ResourceImagePipe } from '../../pipes/resource-image.pipe';

@Component({
  standalone: true,
  selector: 'wbs-resource-view-link',
  templateUrl: './resource-view-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DialogModule,
    FontAwesomeModule,
    PDFViewerModule,
    ResourceObjectPipe,
    ResourceImagePipe,
    TranslateModule,
    YouTubeSizerDirective,
  ],
})
export class ResourceViewLinkComponent {
  private readonly dialogService = inject(DialogService);
  private dialog?: DialogRef;

  readonly owner = input.required<string>();
  readonly record = input.required<ResourceRecord>();

  readonly faEye = faEye;
  readonly tools: PDFViewerTool[] = [
    'pager',
    'spacer',
    'zoomInOut',
    'zoom',
    'selection',
    'spacer',
    'search',
    'download',
    'print',
  ];

  open(content: any) {
    this.dialog = this.dialogService.open({
      content,
    });
  }

  close() {
    this.dialog?.close();
  }
}
