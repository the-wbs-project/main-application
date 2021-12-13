import { CorsInfo } from "../../models";
import { CONFIG } from "../config.service";
import { WorkerCall } from "../worker-call.service";
import { CspService } from "./csp.service";

export class ResponseService {
  private corsInfo: CorsInfo | undefined;

  constructor(config: CONFIG, private readonly csp: CspService) {
    this.corsInfo = config.cors;
  }

  async optionsAsync(call: WorkerCall): Promise<Response | number> {
    try {
      const match = await call.cacheMatch();
      const hdrs = new Headers();

      if (match) return match;

      this.addCors(call.request, hdrs);

      const response = new Response("", { headers: hdrs });

      call.cachePut(response);

      return response;
    } catch (e) {
      call.logException(
        "An error occured trying to create options.",
        "ResponseService.optionsAsync",
        e
      );
      return 500;
    }
  }

  codeOnly(code: number, call: WorkerCall): Response {
    return this.simple(null, code, call);
  }

  simple(message: string | null, code: number, call: WorkerCall): Response {
    const hdrs = new Headers({});

    this.addCors(call.request, hdrs);

    return new Response(message, {
      status: code,
      headers: hdrs,
    });
  }

  buildJson<T>(
    call: WorkerCall,
    json: T,
    headers: Headers = new Headers()
  ): Response {
    this.addCors(call.request, headers);

    headers.set("content-type", "application/json;charset=utf-8");

    return new Response(JSON.stringify(json), {
      status: 200,
      headers: headers,
    });
  }

  match(req: Request, match: Response): Response {
    const status = match.headers.get("cf-cache-status");
    const hdrs = new Headers({
      "content-type": "application/json;charset=utf-8",
    });
    if (status) hdrs.set("cf-cache-status", status);

    this.addCors(req, hdrs);

    return new Response(match.body, {
      status: 200,
      headers: hdrs,
    });
  }

  rebuild(req: Request, res: Response): Response {
    const hdrs = new Headers(res.headers);

    this.addCors(req, hdrs);

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: hdrs,
    });
  }

  async rebuildAssetAsync(req: Request, res: Response): Promise<Response> {
    const hdrs: Headers = new Headers(res.headers);
    //
    //  Add CSP
    //
    const csp = await this.csp.getLine(req.headers.get("User-Agent") || "");

    if (csp) hdrs.set("Content-Security-Policy", csp);

    this.addCors(req, hdrs);

    const res2 = new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: hdrs,
    });
    return res2;
  }

  private addCors(request: Request, hdrs: Headers): void {
    if (!this.corsInfo) return;

    const origin = (request.headers.get("origin") || "").toLowerCase();
    const info = this.corsInfo;

    if (info.urls.indexOf(origin) === -1) {
      hdrs.set("Access-Control-Allow-Origin", origin);

      if (info.age) hdrs.set("Access-Control-Allow-Age", info.age.toString());

      if (info.verbs)
        hdrs.set("Access-Control-Allow-Methods", info.verbs.join(","));

      if (info.headers)
        hdrs.set("Access-Control-Allow-Headers", info.headers.join(","));
    }
  }
}
