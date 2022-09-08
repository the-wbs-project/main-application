import { StorageService } from "./storage.service";

export interface StorageFactory {
  snapshots: StorageService;
}
