import { ChecklistHttpService } from './checklist.http-service';
import { MetadataHttpService } from './metdata.http-service';
import { MiscHttpService } from './misc.http-service';
import { OrganizationHttpService } from './organization.http-service';
import { ProfileHttpService } from './profile.http-service';
import { ProjectSnapshotHttpService } from './project-snapshot.http-service';
import { UserHttpService } from './user.http-service';

export const Http = {
  checklists: ChecklistHttpService,
  metadata: MetadataHttpService,
  misc: MiscHttpService,
  organizations: OrganizationHttpService,
  profile: ProfileHttpService,
  projectSnapshots: ProjectSnapshotHttpService,
  users: UserHttpService,
};
