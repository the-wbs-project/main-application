import { Store } from '@ngxs/store';
import {
  LoadProfile,
  SetupCategories,
  TurnOffIsLoading,
} from '@wbs/shared/actions';
import { Resources } from '@wbs/shared/services';
import { switchMap } from 'rxjs';
import { ThemeService } from './theme.service';

export class AppInitializerFactory {
  static run(store: Store, resources: Resources, theme: ThemeService) {
    return () => {
      theme.apply();

      return resources.initiate().pipe(
        switchMap(() =>
          store.dispatch([new SetupCategories(), new LoadProfile()])
        ),
        switchMap(() => store.dispatch(new TurnOffIsLoading()))
      );
    };
  }
}
