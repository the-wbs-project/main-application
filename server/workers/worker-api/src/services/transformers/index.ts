import { ActivityTransformer } from './activity.transformer';
import { LibraryVersionTransformer } from './library-version.transformer';
import { ProjectTransformer } from './project.transformer';

export class Transformers {
  static activity = ActivityTransformer;
  static libraryVersion = LibraryVersionTransformer;
  static project = ProjectTransformer;
}
