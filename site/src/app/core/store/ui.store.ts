import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RouterDataResolved } from '@ngxs/router-plugin';
import { Actions, ofActionSuccessful } from '@ngxs/store';
import { RoutedBreadcrumbItem } from '@wbs/core/models';
import { timer } from 'rxjs';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class UiStore {
  private readonly actions$ = inject(Actions);
  private readonly menuCutoff = 1000;
  private readonly _activeSection = signal<string | undefined>(undefined);
  private readonly _breadcrumbs = signal<RoutedBreadcrumbItem[] | undefined>(
    undefined
  );
  private readonly _isLoading = signal<boolean>(false);
  private readonly _isMobile = isMobile();
  private readonly _isSidebarExpanded = signal<boolean | undefined>(undefined);
  private readonly _mainContentWidth = signal<number | undefined>(undefined);
  private readonly _path = signal<string | undefined>(undefined);
  private lastWindowCheck?: number;

  get activeSection(): Signal<string | undefined> {
    return this._activeSection;
  }

  get breadcrumbs(): Signal<RoutedBreadcrumbItem[] | undefined> {
    return this._breadcrumbs;
  }

  get isLoading(): Signal<boolean> {
    return this._isLoading;
  }

  get isMobile(): boolean {
    return this._isMobile;
  }

  get isSidebarExpanded(): Signal<boolean | undefined> {
    return this._isSidebarExpanded;
  }

  get mainContentWidth(): Signal<number | undefined> {
    return this._mainContentWidth;
  }

  get path(): Signal<string | undefined> {
    return this._path;
  }

  get size(): Signal<'xs' | 'sm' | 'md' | 'lg' | 'xl'> {
    return computed(() => {
      const width = this.mainContentWidth();

      if (width! < 576) return 'xs';
      if (width! < 768) return 'sm';
      if (width! < 992) return 'md';
      if (width! < 1200) return 'lg';
      return 'xl';
    });
  }

  setActiveSection(activeSection: string | undefined): void {
    this._activeSection.set(activeSection);
  }

  setBreadcrumbs(breadcrumbs: RoutedBreadcrumbItem[] | undefined): void {
    this._breadcrumbs.set(breadcrumbs);
  }

  setMainContentWidth(width: number | undefined): void {
    this._mainContentWidth.set(width);
  }

  toggleSidebar(): void {
    this._isSidebarExpanded.update((expanded) => !expanded);
  }

  setup(): void {
    const width = this.getWidth();
    this._isSidebarExpanded.set(width > this.menuCutoff);
    this.lastWindowCheck = width;

    this.actions$
      .pipe(ofActionSuccessful(RouterDataResolved<any>), untilDestroyed(this))
      .subscribe((action: RouterDataResolved) =>
        this._path.set(action.routerState.url)
      );

    timer(0, 500)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const lastWindowCheck = this.lastWindowCheck;
        const newWindowCheck = this.getWidth();

        if (lastWindowCheck === newWindowCheck) return;

        this.lastWindowCheck = newWindowCheck;
        this._isSidebarExpanded.update((isExpanded) =>
          lastWindowCheck! > this.menuCutoff &&
          newWindowCheck <= this.menuCutoff
            ? false
            : isExpanded
        );
      });
  }

  private getWidth(): number {
    return window.innerWidth;
  }
}

function isMobile() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
    //@ts-ignore
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}
