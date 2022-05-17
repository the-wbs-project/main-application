import { Store } from '@ngxs/store';
import { SetupCategories } from '@wbs/shared/actions';
import { Resources } from '@wbs/shared/services';
import { ThemeService } from './theme.service';

export class AppInitializerFactory {
  static run(store: Store, resources: Resources, theme: ThemeService) {
    return () => {
      console.log('resources setup');
      const elem = document.getElementById('edge_state');

      if (elem?.innerHTML) {
        const data = JSON.parse(elem.innerHTML);

        resources.setup(data.resources);
        console.log(data);
      }
      theme.apply();

      return store.dispatch(new SetupCategories());
    };
  }
}
