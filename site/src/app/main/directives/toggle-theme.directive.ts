import { Directive, HostListener } from '@angular/core';
import { ThemeService } from '@wbs/core/services';

@Directive({ selector: '[appToggleTheme]', standalone: true })
export class ToggleThemeDirective {
  constructor(private readonly service: ThemeService) {}

  @HostListener('click') toggleTheme() {
    this.service.toggleMode();
  }
}
