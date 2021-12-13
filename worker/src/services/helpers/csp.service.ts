import { CONFIG } from "../config.service";

export interface Csp {
  defaults?: CspItem;
  scripts?: CspItem;
  styles?: CspItem;
  img?: CspItem;
  connect?: CspItem;
  font?: CspItem;
  frame?: CspItem;
  object?: CspItem;
  formAction?: CspItem;
  frameAncestors?: CspItem;
  baseUri?: CspItem;
  reportUri?: string;
}
export interface CspItem {
  self?: boolean;
  none?: boolean;
  unsafeEval?: boolean;
  unsaveInline?: boolean;
  data?: boolean;
  urls?: string[];
}

export class CspService {
  private readonly csp: Csp;
  private safariCsp: string | undefined;
  private nonSafariCsp: string | undefined;

  constructor(private readonly config: CONFIG) {
    console;
    this.csp = this.config.csp;
  }

  async getLine(userAgent: string): Promise<string | null | undefined> {
    if (this.nonSafariCsp == null) {
      if (this.csp == null) {
        if (this.config.enforceCsp)
          throw new Error("No CSP information found.");

        console.log("no csp");
        return null;
      }

      this.build(this.csp, this.config.enforceCsp || false);
    }
    return (userAgent || "").indexOf("Safari/") > -1
      ? this.safariCsp
      : this.nonSafariCsp;
  }

  private build(csp: Csp, enforceCsp: boolean) {
    let line = "";
    if (csp.defaults) line += this.builditem("default", csp.defaults);
    if (csp.scripts) line += this.builditem("script", csp.scripts);
    if (csp.styles) line += this.builditem("style", csp.styles);
    if (csp.img) line += this.builditem("img", csp.img);
    if (csp.connect) line += this.builditem("connect", csp.connect);
    if (csp.font) line += this.builditem("font", csp.font);
    if (csp.frame) line += this.builditem("frame", csp.frame);
    if (csp.frameAncestors)
      line += this.builditem("frame-ancestors", csp.frameAncestors);

    if (csp.reportUri)
      line += `report-uri https://${csp.reportUri}/${
        enforceCsp ? "enforce" : "reportOnly"
      };`;

    this.safariCsp = line;

    while (line.indexOf("https://") > -1) line = line.replace("https://", "");

    this.nonSafariCsp = line;
  }

  private builditem(name: string, item: CspItem): string {
    const prefix = `${name}-src `;
    let line = prefix;

    if (item.self) line += "'self' ";
    if (item.unsafeEval) line += "'unsafe-eval' ";
    if (item.unsaveInline) line += "'unsafe-inline' ";
    if (item.data) line += "data: ";

    if (item.urls) {
      for (let i = 0; i < item.urls.length; i++)
        line += `https://${item.urls[i]} `;
    }
    return line === prefix ? "" : `${line}; `;
  }
}
