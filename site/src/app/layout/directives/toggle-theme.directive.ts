import { Directive, HostListener } from '@angular/core';
import { ThemeService } from '@wbs/core/services';

@Directive({
  selector: '[appToggleTheme]',
})
export class ToggleThemeDirective {
  constructor(private readonly service: ThemeService) {}

  @HostListener('click') toggleTheme() {
    this.service.toggleMode();
  }
}
