import { Context } from '../../config';
import { LibraryEntry } from '../../models';
import { BaseDataService } from './base.data-service';

export class LibraryEntryDataService extends BaseDataService {
  constructor(ctx: Context) {
    super(ctx);
  }

  async getByIdAsync(owner: string, entry: string): Promise<LibraryEntry | undefined> {
    return await this.origin.getAsync<LibraryEntry>(this.getBaseUrl(owner, entry));
  }

  async putAsync(owner: string, entry: string, data: LibraryEntry): Promise<void> {
    await this.origin.putAsync(data, this.getBaseUrl(owner, entry));
  }

  private getBaseUrl(owner: string, entry: string): string {
    return `portfolio/${owner}/library/entries/${entry}`;
  }
}
