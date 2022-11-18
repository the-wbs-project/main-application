import { Store } from '@ngxs/store';
import {
  LoadOrganization,
  LoadProfile,
  LoadProjects,
  SetupCategories,
} from '../actions';
import { forkJoin, switchMap } from 'rxjs';
import { Resources } from './resource.service';
import { ThemeService } from './theme.service';

export class AppInitializerFactory {
  static run(store: Store, resources: Resources, theme: ThemeService) {
    return () => {
      theme.apply();

      const isInfo = window.location.pathname.indexOf('info/') > -1;

      if (isInfo) return forkJoin([resources.initiate('Info')]);

      return resources.initiate('General').pipe(
        switchMap(() =>
          store.dispatch([new SetupCategories(), new LoadProfile()])
        ),
        switchMap(() =>
          store.dispatch([new LoadProjects(), new LoadOrganization()])
        )
      );
    };
  }
}
