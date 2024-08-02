import { User, UserSearchDocument, UserViewModel } from '../../models';

export class UserTransformer {
  static getDocumentId(organization: string, userId: string, visibility: string): string {
    return `${organization}_${userId.split('|')[0]}_${visibility}`;
  }

  static toViewModel(user: User, visibility: string, roles: string[]): UserViewModel {
    const showExternal = user.user_metadata?.showExternally ?? [];
    return {
      userId: user.user_id,
      fullName: user.name,
      email: user.email,
      picture: user.picture,
      phone: user.phone_number,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLogin: user.last_login,
      loginCount: user.logins_count,
      title: visibility === 'private' || showExternal.includes('title') ? user.user_metadata?.title : 'private',
      linkedIn: visibility === 'private' || showExternal.includes('linkedIn') ? user.user_metadata?.linkedin : 'private',
      twitter: visibility === 'private' || showExternal.includes('twitter') ? user.user_metadata?.twitter : 'private',
      roles,
    };
  }
}
