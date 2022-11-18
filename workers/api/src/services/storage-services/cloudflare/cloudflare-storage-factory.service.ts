import { Config } from '../../../config';
import { StorageFactory } from '../storage-factory.service';
import { StorageService } from '../storage.service';
import { CloudflareStorageService } from './cloudflare-storage.service';

export class CloudflareStorageFactory implements StorageFactory {
  readonly snapshots: StorageService;
  readonly statics: StorageService;

  constructor(config: Config) {
    this.snapshots = new CloudflareStorageService(config.bucketSnapshots);
    this.statics = new CloudflareStorageService(config.bucketStatics);
  }
}