import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  output,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-profile-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrl: './image-cropper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule],
})
export class ImageCropperComponent implements AfterViewInit, OnInit {
  readonly image = input.required<string>();
  readonly sanitizedUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustUrl(this.image())
  );
  readonly cropped = output<string>();
  readonly cancel = output<void>();
  cropper!: any;

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const image = document.getElementById('image') as HTMLImageElement;
    //@ts-ignore
    this.cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      guides: false,
    });
  }

  getRoundedCanvas(sourceCanvas: any) {
    var canvas = document.createElement('canvas');
    var context: any = canvas.getContext('2d');
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(
      width / 2,
      height / 2,
      Math.min(width, height) / 2,
      0,
      2 * Math.PI,
      true
    );
    context.fill();
    return canvas;
  }

  //get the cropped image and closes the dialog
  //returning an url or null if no image

  crop() {
    const croppedCanvas = this.cropper.getCroppedCanvas();
    const roundedCanvas = this.getRoundedCanvas(croppedCanvas);

    let roundedImage = document.createElement('img');

    if (roundedImage) {
      this.cropped.emit(roundedCanvas.toDataURL());
    } else {
      this.cancel.emit();
    }
  }

  // resets the cropper
  reset() {
    this.cropper.clear();
    this.cropper.crop();
  }
}
