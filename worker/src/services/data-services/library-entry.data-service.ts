import { Context } from '../../config';
import { LibraryEntry } from '../../models';
import { OriginService } from '../origin.service';

export class LibraryEntryDataService {
  constructor(private readonly ctx: Context) {}

  private get origin(): OriginService {
    return this.ctx.get('origin');
  }

  async getByIdAsync(owner: string, entry: string): Promise<LibraryEntry | undefined> {
    return await this.origin.getAsync<LibraryEntry>(`portfolio/${owner}/library/entries/${entry}`);
  }

  async getEditorsAsync(owner: string, entry: string): Promise<string[]> {
    return (await this.origin.getAsync<string[]>(`portfolio/${owner}/library/entries/${entry}/editors`)) ?? [];
  }

  async indexAsync(owner: string, entry: string): Promise<void> {
    const res = await this.origin.postAsync(null, `portfolio/${owner}/library/entries/${entry}/searchIndex`);
  }
}
