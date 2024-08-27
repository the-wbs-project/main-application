import { LibraryVersionTransformer } from './library-version.transformer';
import { ProjectTransformer } from './project.transformer';

export class Transformers {
  static libraryVersion = LibraryVersionTransformer;
  static project = ProjectTransformer;
}
