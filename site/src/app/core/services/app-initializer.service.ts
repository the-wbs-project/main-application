import { Store } from '@ngxs/store';
import { SetupCategories } from '../actions';
import { switchMap } from 'rxjs';
import { Resources } from './resource.service';
import { ThemeService } from './theme.service';

export class AppInitializerFactory {
  static run(store: Store, resources: Resources, theme: ThemeService) {
    return () => {
      let toReturn = resources.initiate();

      theme.apply();

      const isInfo = window.location.pathname.indexOf('info/') > -1;

      if (!isInfo)
        toReturn = toReturn.pipe(
          switchMap(() => store.dispatch(new SetupCategories()))
        );

      return toReturn;
    };
  }
}
