import { User, UserProfile } from '../../models';

export class UserTransformer {
  static getDocumentId(organization: string, userId: string, visibility: string): string {
    return `${organization}_${userId.split('|')[0]}_${visibility}`;
  }

  static toViewModelList(users: UserProfile[], visibility: 'organization' | 'public'): User[] {
    return users.map((x) => UserTransformer.toViewModel(x, visibility));
  }

  static toViewModel(member: UserProfile, visibility: 'organization' | 'public'): User {
    const showExternal = member.showExternally ?? [];
    return {
      userId: member.userId,
      fullName: member.fullName,
      picture: member.picture,
      phone: member.phone,
      email: visibility === 'organization' || showExternal.includes('email') ? member.email : 'private',
      title: visibility === 'organization' || showExternal.includes('title') ? member.title : 'private',
      linkedIn: visibility === 'organization' || showExternal.includes('linkedIn') ? member.linkedIn : 'private',
      twitter: visibility === 'organization' || showExternal.includes('twitter') ? member.twitter : 'private',
    };
  }
}
