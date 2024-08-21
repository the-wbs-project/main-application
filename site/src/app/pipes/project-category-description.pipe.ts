import { Pipe, PipeTransform, inject } from '@angular/core';
import { MetadataStore } from '@wbs/core/store';

@Pipe({ name: 'projectCategoryDescription', standalone: true })
export class ProjectCategoryDescriptionPipe implements PipeTransform {
  private readonly state = inject(MetadataStore);

  transform(id: string | null | undefined): string {
    if (!id) return '';

    return (
      this.state.categories.projectCategories.find((c) => c.id === id)
        ?.description ?? ''
    );
  }
}
