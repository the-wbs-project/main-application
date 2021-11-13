import {
  MailGunService,
  ResponseService,
  RouterService,
  SiteHttpService,
  WorkerCall,
} from './services';

const responses = new ResponseService();
const site = new SiteHttpService(responses);
const router = new RouterService(new MailGunService(), site);

router.setup();

export async function handleRequest(event: FetchEvent): Promise<Response> {
  let call: WorkerCall | null = null;
  try {
    call = new WorkerCall(event, responses);
    return await router.matchAsync(call);
  } catch (e) {
    if (call)
      call.logException(
        'An uncaught error occured.',
        'WorkerService.handleRequest',
        e,
      );
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin':
          event.request.headers.get('origin') || '',
      },
    });
  }
}
