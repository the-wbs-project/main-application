import { WorkerEntrypoint } from 'cloudflare:workers';
import { Env } from './config';
import { InvitesRpc, MembershipsRpc, OrganizationsRpc, RolesRpc, UsersRpc, UtilsRpc } from './services/rpcs';

export default class extends WorkerEntrypoint<Env> {
  invites() {
    console.log(this.env);
    return new InvitesRpc(this.env, this.ctx);
  }
  memberships() {
    return new MembershipsRpc(this.env, this.ctx);
  }
  organizations() {
    return new OrganizationsRpc(this.env, this.ctx);
  }
  roles() {
    console.log(this.env);
    return new RolesRpc(this.env, this.ctx);
  }
  users() {
    return new UsersRpc(this.env, this.ctx);
  }
  utils() {
    return new UtilsRpc(this.env, this.ctx);
  }
  fetch() {
    return new Response('ok');
  }
}
