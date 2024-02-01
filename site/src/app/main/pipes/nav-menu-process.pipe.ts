import { Pipe, PipeTransform } from '@angular/core';
import { Resources } from '@wbs/core/services';
import { NavigationLink } from '@wbs/main/models';

@Pipe({ name: 'navMenuProcess', standalone: true })
export class NavMenuProcessPipe implements PipeTransform {
  constructor(private readonly resources: Resources) {}

  //
  //    This was created so the labels can be translated before hand
  //        so the aria labels are translated as well.
  //
  transform(menu: NavigationLink[], claims: string[]): NavigationLink[] {
    const processed: NavigationLink[] = [];

    for (const item of menu) {
      const processedItem = this.process(item, claims);
      if (processedItem) processed.push(processedItem);
    }

    return processed;
  }

  private process(
    item: NavigationLink,
    claims: string[]
  ): NavigationLink | undefined {
    if (item.claim && !claims.includes(item.claim)) return undefined;

    item.text = this.resources.get(item.text!);

    if (item.items) {
      const children: NavigationLink[] = [];

      for (const child of item.items) {
        const processed = this.process(child, claims);
        if (processed) children.push(processed);
      }
      item.items = children;
    }
    return item;
  }
}
