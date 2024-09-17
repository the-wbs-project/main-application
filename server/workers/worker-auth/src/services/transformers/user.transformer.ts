import { Role, User, UserViewModel } from '../../models';

export class UserTransformer {
  static getDocumentId(organization: string, userId: string, visibility: string): string {
    return `${organization}_${userId.split('|')[0]}_${visibility}`;
  }

  static toViewModel(user: User, visibility: string, roles: Role[]): UserViewModel {
    const showExternal = user.user_metadata?.showExternally ?? [];
    return {
      userId: user.user_id,
      fullName: user.name,
      picture: user.picture,
      phone: user.phone_number,
      email: visibility === 'organization' || showExternal.includes('email') ? user.email : 'private',
      title: visibility === 'organization' || showExternal.includes('title') ? user.user_metadata?.title : 'private',
      linkedIn: visibility === 'organization' || showExternal.includes('linkedIn') ? user.user_metadata?.linkedIn : 'private',
      twitter: visibility === 'organization' || showExternal.includes('twitter') ? user.user_metadata?.twitter : 'private',
      roles,
    };
  }
}
