import {
  ConfigEnvironment,
  MailGunService,
  ResponseService,
  RouterService,
  SiteHttpService,
} from './services';

const config = new ConfigEnvironment();
const mailgun = new MailGunService();
const responses = new ResponseService(config);
const site = new SiteHttpService(responses);
const router = new RouterService(mailgun, responses, site);

addEventListener('fetch', (event) => {
  event.respondWith(router.matchAsync(event));
});
