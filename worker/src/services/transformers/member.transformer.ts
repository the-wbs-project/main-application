import { RoleRollup, UserProfile } from '../../models';
import { MemberViewModel } from '../../view-models';

export class MemberTransformer {
  static toViewModelList(member: UserProfile[], roles: RoleRollup): MemberViewModel[] {
    return member.map((x) => MemberTransformer.toViewModel(x, roles));
  }

  static toViewModel(member: UserProfile, roles: RoleRollup): MemberViewModel {
    return {
      userId: member.userId,
      fullName: member.fullName,
      picture: member.picture,
      phone: member.phone,
      email: member.email,
      createdAt: member.createdAt,
      lastLogin: member.lastLogin,
      linkedIn: member.linkedIn,
      loginCount: member.loginCount,
      title: member.title,
      twitter: member.twitter,
      updatedAt: member.updatedAt,
      roles: roles[member.userId] ?? [],
    };
  }
}
