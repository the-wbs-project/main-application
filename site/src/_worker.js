const prefetches = [
  { variable: "resources", kvName: "", url: "/api/resources/all/en-US" },
  { variable: "roles", kvName: "", url: "/api/roles" },
  { variable: "phases", kvName: "", url: "/api/lists/categories_phase/en-US" },
  {
    variable: "disciplines",
    kvName: "",
    url: "/api/lists/categories_discipline/en-US",
  },
];

export default {
  async fetch(request, env) {
    try {
      // Otherwise, serve the static assets.
      // Without this, the Worker will error and no assets will be served.
      const resp = await env.ASSETS.fetch(request);
      const headers = new Headers(resp.headers);

      if (!resp.headers.get("content-type")?.includes("text/html")) return resp;

      let body = await resp.text();

      const categoryResponse = await fetch(
        env.API_URL_INTERNAL + "/api/lists/project_category/en-US"
      );

      let section = `
    <link rel="preconnect" href="${env.API_URL_EXTERNAL}" />`;

      const categories = await categoryResponse.json();
      for (const cat of categories) {
        section += `
      <link rel="prefetch" href="${cat.icon}" as="image" />`;
      }
      //
      //  set env variables
      //
      const config = {
        api_domain: env.API_URL_EXTERNAL,
        auth_clientId: env.AUTH_CLIENT_ID,
        datadog_env: env.DD_ENV,
        datadog_rum_url: env.DD_RUM_URL,
        datadog_rum_client_token: env.DD_RUM_CLIENT_TOKEN,
        datadog_rum_application_id: env.DD_RUM_APPLICATION_ID,
        datadog_rum_site_url: env.DD_RUM_SITE,
        datadog_rum_sample_rate: parseInt(env.DD_RUM_SAMPLE_RATE),
        datadog_rum_replay_sample_rate: parseInt(env.DD_RUM_REPLAY_SAMPLE_RATE),
        project_categories: categories,
      };
      //
      //  now we will store fetches and variables names at the same time, then combine them in the config object.
      //
      var fetches = [];
      var variables = [];

      for (const url of prefetches) {
        fetches.push(fetch(env.API_URL_INTERNAL + url.url));
        variables.push(url.variable);
      }

      var fetchResults = await Promise.all(fetches);

      for (let i = 0; i < fetchResults.length; i++) {
        const response = await fetchResults[i];

        if (response.status !== 200) {
          throw new Error("Failed to fetch " + prefetches[i].url);
        }
        config[variables[i]] = await fetchResults[i].json();
      }

      section += `
    <script id="edge_config" type="application/json">${JSON.stringify(
      config
    )}</script>`;

      const newHeaders = new Headers(headers);
      newHeaders.set(
        "Content-Security-Policy",
        `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com https://kit.fontawesome.com https://static.cloudflareinsights.com https://jam.dev https://www.datadoghq-browser-agent.com; style-src 'self' 'unsafe-inline' data: https://fonts.googleapis.com https://cdnjs.cloudflare.com; img-src 'self' data: https://imagedelivery.net https://*.gravatar.com https://i2.wp.com/; connect-src 'self' data: https://logs.browser-intake-us5-datadoghq.com https://browser-intake-us5-datadoghq.com https://ka-p.fontawesome.com https://auth.pm-empower.com ${config.api_domain} https://rum.browser-intake-us5-datadoghq.com https://ai.pm-empower.com; font-src 'self' data: https://cdnjs.cloudflare.com https://fonts.gstatic.com; frame-src 'self' https://auth.pm-empower.com https://www.google.com;`
      );

      return new Response(body.replace("<!--SERVER-->", section), {
        status: resp.status,
        statusText: resp.statusText,
        headers: newHeaders,
      });
    } catch (e) {
      var plainObject = {};

      for (const key of Object.getOwnPropertyNames(e)) {
        plainObject[key] = e[key];
      }
      return new Response(JSON.stringify(plainObject), {
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  },
};
