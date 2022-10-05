import { Store } from '@ngxs/store';
import {
  LoadOrganization,
  LoadProfile,
  LoadProjects,
  SetupCategories,
  TurnOffIsLoading,
} from '@wbs/shared/actions';
import { Resources } from '@wbs/shared/services';
import { forkJoin, switchMap } from 'rxjs';
import { ThemeService } from './theme.service';

export class AppInitializerFactory {
  static run(store: Store, resources: Resources, theme: ThemeService) {
    return () => {
      theme.apply();

      const isInfo = window.location.pathname.indexOf('info/') > -1;

      if (isInfo)
        return forkJoin([
          resources.initiate('Info'),
          store.dispatch(new TurnOffIsLoading()),
        ]);

      return resources.initiate('General').pipe(
        switchMap(() =>
          store.dispatch([new SetupCategories(), new LoadProfile()])
        ),
        switchMap(() =>
          store.dispatch([new LoadProjects(), new LoadOrganization()])
        ),
        switchMap(() => store.dispatch(new TurnOffIsLoading()))
      );
    };
  }
}
