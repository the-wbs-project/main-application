import { LibraryEntryVersion } from '@wbs/core/models';
import { LibraryVersionViewModel } from '@wbs/core/view-models';

export class LibraryVersionTransformer {
  static toModel(vm: LibraryVersionViewModel): LibraryEntryVersion {
    const model: LibraryEntryVersion = {
      entryId: vm.entryId,
      version: vm.version,
      versionAlias: vm.versionAlias,
      lastModified: vm.lastModified,
      title: vm.title,
      description: vm.description,
      disciplines: vm.disciplines,
      status: vm.status,
      author: vm.author.userId,
      categories: vm.category == null ? [] : [vm.category],
      editors: vm.editors.map((x) => x.userId),
    };
    return model;
  }
}
