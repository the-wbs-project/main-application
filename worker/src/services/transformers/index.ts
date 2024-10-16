import { ActivityTransformer } from './activity.transformer';
import { LibraryVersionTransformer } from './library-version.transformer';
import { MemberTransformer } from './member.transformer';
import { ProjectTransformer } from './project.transformer';
import { UserTransformer } from './user.transformer';

export class Transformers {
  static activity = ActivityTransformer;
  static libraryVersion = LibraryVersionTransformer;
  static member = MemberTransformer;
  static project = ProjectTransformer;
  static user = UserTransformer;
}
