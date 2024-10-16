import { LibraryEntry, LibraryEntryVersion, LibraryEntryVersionBasic, Organization, User } from '../../models';
import { LibraryVersionViewModel } from '../../view-models';

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
    users: User[],
  ): LibraryVersionViewModel {
    return {
      entryId: entry.id,
      recordId: entry.recordId,
      ownerId: entry.ownerId,
      ownerName: organization.name,
      version: version.version,
      versionAlias: version.versionAlias,
      title: version.title,
      type: entry.type,
      visibility: entry.visibility,
      status: version.status,
      releaseNotes: version.releaseNotes,
      author: users.find((u) => u.userId === version.author)!,
      category: (version.categories ?? [])[0],
      disciplines: version.disciplines,
      editors: (version.editors ?? []).map((editor) => users.find((u) => u.userId === editor)).filter((u) => u !== undefined),
      lastModified: version.lastModified,
      description: version.description,
    };
  }
}
