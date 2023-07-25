import { Directive, HostListener } from '@angular/core';

@Directive({ selector: '[appSidemenuToggle]', standalone: true })
export class SidemenuToggleDirective {
  private body:any = document.querySelector('body');
  constructor() { }

  @HostListener('click') toggleSidemenu(){
    if (this.body.classList.contains('sidenav-toggled')) {
      document.querySelector('body')?.classList.remove('sidenav-toggled');
    }else{
      document.querySelector('body')?.classList.add('sidenav-toggled');
    }
  }
}
