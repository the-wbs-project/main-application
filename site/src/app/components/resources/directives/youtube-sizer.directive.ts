import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Directive({
  selector: '[wbsYouTubeSizer]',
  standalone: true,
})
export class YouTubeSizerDirective implements OnInit {
  @Input('wbsYouTubeSizer') resource!: string;

  @HostBinding('attr.height') height?: string;
  @HostBinding('attr.width') width?: string;
  @HostBinding('attr.src') src?: SafeResourceUrl;

  constructor(
    private readonly ref: ElementRef,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.process();
    }, 500);
  }

  private process(): void {
    const html = this.ref.nativeElement as HTMLIFrameElement;
    const parent = html.parentElement as HTMLDivElement;
    const info: { height: number; width: number; url: string } = JSON.parse(
      this.resource
    );

    const pHeight = parent.offsetHeight - 32;
    const pWidth = parent.offsetWidth - 32;

    const videoRatio = info.width / info.height;
    const actualHeight = pWidth / videoRatio;

    if (actualHeight > pHeight) {
      this.height = `${pHeight}px`;
      this.width = `${pWidth / videoRatio}px`;
    } else {
      this.height = `${pHeight / videoRatio}px`;
      this.width = `${pWidth}px`;
    }
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(info.url);
  }
}
