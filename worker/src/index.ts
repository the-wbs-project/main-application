import { EnvironmentConfig } from './config';
import { MailGunService, RouterService, SiteHttpService } from './services';

const config = new EnvironmentConfig();
const mailgun = new MailGunService(config.mailgun);
const site = new SiteHttpService();
const router = new RouterService(config, mailgun, site);

addEventListener('fetch', (event) => {
  event.respondWith(router.matchAsync(event));
});
