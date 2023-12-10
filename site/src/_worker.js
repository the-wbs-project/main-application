const prefetches = [
  "/api/roles",
  "/api/resources/all/en-US",
  "/api/lists/project_category",
  "/api/lists/categories_phase",
  "/api/lists/categories_discipline",
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
        env.API_URL_INTERNAL + "/api/lists/project_category"
      );

      let section = `
    <link rel="preconnect" href="${env.API_URL_EXTERNAL}" />`;

      const categories = await categoryResponse.json();

      for (const url of prefetches) {
        section += `
      <link rel="prefetch" href="${env.API_URL_EXTERNAL}${url}" />`;
      }
      for (const cat of categories) {
        section += `
      <link rel="prefetch" href="${cat.icon}" as="image" />`;
      }
      //
      //  set env variables
      //
      const config = JSON.stringify({
        api_prefix: env.API_URL_EXTERNAL,
        auth_clientId: env.AUTH_CLIENT_ID,
        datadog_env: env.DD_ENV,
      });

      section += `
    <script id="edge_config" type="application/json">${config}</script>`;

      return new Response(body.replace("<!--SERVER-->", section), {
        status: resp.status,
        statusText: resp.statusText,
        headers: headers,
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
