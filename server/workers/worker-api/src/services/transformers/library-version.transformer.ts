import { LibraryEntry, LibraryEntryVersion, LibraryEntryVersionBasic, Organization } from '../../models';
import { LibraryVersionViewModel, UserViewModel } from '../../view-models';

export class LibraryVersionTransformer {
  static toBasic(model: LibraryEntryVersion): LibraryEntryVersionBasic {
    return {
      title: model.title,
      status: model.status,
      version: model.version,
      versionAlias: model.versionAlias,
    };
  }
  static toViewModel(
    entry: LibraryEntry,
    version: LibraryEntryVersion,
    organization: Organization,
    users: UserViewModel[],
  ): LibraryVersionViewModel {
    return {
      entryId: entry.id,
      ownerId: entry.ownerId,
      ownerName: organization.display_name,
      version: version.version,
      versionAlias: version.versionAlias,
      title: version.title,
      type: entry.type,
      visibility: entry.visibility,
      status: version.status,
      author: users.find((u) => u.userId === version.author)!,
      category: (version.categories ?? [])[0],
      disciplines: version.disciplines,
      editors: (version.editors ?? []).map((editor) => users.find((u) => u.userId === editor)).filter((u) => u !== undefined),
      lastModified: version.lastModified,
      description: version.description,
    };
  }
}
