import * as CryptoJS from "crypto-js";
import {
  AuthConfig,
  AzureConfig,
  CorsInfo,
  DbConfig,
  Snippets,
  TtlConfig,
  TwilioConfig,
} from "../models";
import { Fetcher } from "./fetcher.service";

export class CONFIG {
  private azureConfig: AzureConfig;
  private isSetup: boolean | undefined;
  private _cityField?: string;
  private _provinceField?: string;
  private _cors?: CorsInfo;
  private _dbInfo?: DbConfig;
  private _auth: AuthConfig | undefined;
  private _enforceCsp: boolean | undefined;
  private _version: string | null;
  private _csp: any;
  private _snippets: Snippets | undefined;
  private _ttl: TtlConfig | undefined;
  private _twilio: TwilioConfig | undefined;
  private _debug: boolean;
  private _kvBypass: string[] = [];

  constructor() {
    this._version = this.get(VERSION);
    this._cityField = this.get(CITY_FIELD);
    this._provinceField = this.get(PROVINCE_FIELD);
    this.azureConfig = this.json(CONFIG_CONNECTION);
    this._debug = this.get(DEBUG) === "true";
  }

  get appInsightsKey(): string {
    return APP_INSIGHTS_KEY;
  }

  get auth(): AuthConfig | undefined {
    return this._auth;
  }

  get cityField(): string | undefined {
    return this._cityField;
  }

  get cors(): CorsInfo | undefined {
    return this._cors;
  }

  get csp(): any {
    return this._csp;
  }

  get debug(): boolean {
    return this._debug;
  }

  get dbInfo(): DbConfig | undefined {
    return this._dbInfo;
  }

  get enforceCsp(): boolean | undefined {
    return this._enforceCsp;
  }

  get kvBypass(): string[] {
    return this._kvBypass;
  }

  get provinceField(): string | undefined {
    return this._provinceField;
  }

  get snippets(): Snippets | undefined {
    return this._snippets;
  }

  get ttl(): TtlConfig | undefined {
    return this._ttl;
  }

  get twilio(): TwilioConfig | undefined {
    return this._twilio;
  }

  get version(): string | null {
    return this._version;
  }

  async setup(fetcher: Fetcher): Promise<void> {
    if (this.isSetup) return;

    const kv = await this.getConfigs(fetcher);

    this._cors = this.json(kv.get("Worker:Cors"));
    this._csp = this.json(kv.get("Worker:Csp"));
    this._enforceCsp = kv.get("Worker:EnforceCsp") === "true";
    this._kvBypass = this.json(kv.get("Worker:KvBypass")) || [];
    this._ttl = this.json(kv.get("Worker:Ttl"));

    this._auth = {
      audience: kv.get("Auth0:Audience"),
      authClientId: kv.get("Auth0:AuthClientId"),
      authClientSecret: kv.get("Auth0:AuthClientSecret"),
      callbackUrl: kv.get("Auth0:CallbackUrl"),
      connection: kv.get("Auth0:DbConnection"),
      cookieKey: kv.get("Auth0:CookieKey"),
      domain: `https://${kv.get("Auth0:Domain")}`,
      excludeSecureCookie: kv.get("Auth0:ExcludeSecureCookie") == "true",
      logoutCallbackUrl: kv.get("Auth0:LogoutCallbackUrl"),
      mgmtClientId: kv.get("Auth0:MgmtClientId"),
      mgmtClientSecret: kv.get("Auth0:MgmtClientSecret"),
      salt: kv.get("Auth0:Salt"),
    };
    this._dbInfo = {
      collId: kv.get("DB:Cosmos:Collection"),
      dbId: kv.get("DB:Cosmos:DatabaseId"),
    };
    this._snippets = {
      appInsights: kv.get("Worker:Snippets:AppInsights"),
      cloudflare: kv.get("Worker:Snippets:Cloudflare"),
    };
    this._twilio = {
      accountSid: kv.get("Twilio:AccountSid"),
      authToken: kv.get("Twilio:AuthToken"),
      verifyServiceId: kv.get("Twilio:VerifyServiceId"),
    };

    for (const part of kv.get("DB:Cosmos:ConnectionString").split(";")) {
      if (part.startsWith("AccountEndpoint=")) {
        this._dbInfo.endpoint = part
          .replace("AccountEndpoint=", "")
          .replace(":443/", "");
      } else if (part.startsWith("AccountKey=")) {
        this._dbInfo.key = part.replace("AccountKey=", "");
      }
    }
    this.isSetup = true;
  }

  private get(value: string | null | undefined) {
    return typeof value === "undefined" ? null : value;
  }

  private json(value: string | null | undefined): any {
    return typeof value === "undefined" ? {} : JSON.parse(value);
  }

  private async getConfigs(fetcher: Fetcher): Promise<Map<string, string>> {
    const configs = new Map<string, string>();

    for (const label of [null, CONFIG_ENVIRONMENT]) {
      const list = await this.getConfigsFromUrlAsync(fetcher, label);

      if (!list || !list.items) {
        throw new Error("No configs retrieved for " + label);
      }

      for (const item of list.items) {
        configs.set(item.key, item.value);
      }
    }
    return configs;
  }

  private async getConfigsFromUrlAsync(
    fetcher: Fetcher,
    label: string | null
  ): Promise<any> {
    const path = label
      ? `/kv?label=${label}&api-version=1.0`
      : `/kv?api-version=1.0`;
    const url = `https://${this.azureConfig.host}${path}`;
    const headers = this.signRequest(path);
    const request = new Request(url, {
      method: "GET",
      headers,
    });
    const response = await fetcher.fetch(request);

    if (response.status === 401) {
      console.log(response.headers.get("WWW-Authenticate"));
    } else {
      return await response.json();
    }
  }

  private signRequest(url: string) {
    const verb = "GET";
    const utcNow = new Date().toUTCString();
    const contentHash = CryptoJS.SHA256(undefined).toString(
      CryptoJS.enc.Base64
    );

    //
    // SignedHeaders
    const signedHeaders = "x-ms-date;host;x-ms-content-sha256"; // Semicolon separated header names

    //
    // String-To-Sign
    const stringToSign =
      verb +
      "\n" + // VERB
      url +
      "\n" + // path_and_query
      utcNow +
      ";" +
      this.azureConfig.host +
      ";" +
      contentHash; // Semicolon separated SignedHeaders values

    //
    // Signature
    const signature = CryptoJS.HmacSHA256(
      stringToSign,
      CryptoJS.enc.Base64.parse(this.azureConfig.secret)
    ).toString(CryptoJS.enc.Base64);

    //
    // Result request headers
    return {
      "x-ms-date": utcNow,
      "x-ms-content-sha256": contentHash,

      Authorization:
        "HMAC-SHA256 Credential=" +
        this.azureConfig.id +
        "&SignedHeaders=" +
        signedHeaders +
        "&Signature=" +
        signature,
    };
  }
}
