import { MetadataHttpService } from './metdata.http-service';
import { MiscHttpService } from './misc.http-service';
import { OrganizationHttpService } from './organization.http-service';
import { ProfileHttpService } from './profile.http-service';
import { UserHttpService } from './user.http-service';

export const Http = {
  metadata: MetadataHttpService,
  misc: MiscHttpService,
  organizations: OrganizationHttpService,
  profile: ProfileHttpService,
  users: UserHttpService,
};
