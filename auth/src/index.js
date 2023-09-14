import * as dotenv from "dotenv";
import {
  deployFlow,
  getFlowIds,
  updateTriggerBinding,
  uploadFlow,
} from "./admin/flows.js";
import { getToken } from "./admin/token.js";

dotenv.config();

const config = {
  domain: process.env.DOMAIN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  audience: process.env.AUDIENCE,
};

getToken(config).then((token) => {
  if (!token) {
    console.log("No token recieved");
    return;
  }
  config.token = token;

  flows(config);
});

function flows(config) {
  return getFlowIds(config).then((ids) => {
    return Promise.all([
      uploadFlow(config, {
        id: ids["login-add-organization-info"],
        name: "login-add-organization-info",
        filePath: "./src/flows/login/add-organization-info.js",
        trigger: "post-login",
        dependencies: [
          {
            name: "axios",
            version: "1.5.0",
          },
        ],
        secrets: [
          {
            name: "clientId",
            value: config.clientId,
          },
          {
            name: "domain",
            value: config.domain,
          },
          {
            name: "secret",
            value: config.clientSecret,
          },
          {
            name: "audience",
            value: config.audience,
          },
        ],
      }),
      uploadFlow(config, {
        id: ids["login-add-roles"],
        name: "login-add-roles",
        filePath: "./src/flows/login/add-roles.js",
        trigger: "post-login",
        dependencies: [
          {
            name: "axios",
            version: "1.5.0",
          },
        ],
        secrets: [
          {
            name: "clientId",
            value: config.clientId,
          },
          {
            name: "domain",
            value: config.domain,
          },
          {
            name: "secret",
            value: config.clientSecret,
          },
          {
            name: "audience",
            value: config.audience,
          },
        ],
      }),
      uploadFlow(config, {
        id: ids["login-add-site-roles"],
        name: "login-add-site-roles",
        filePath: "./src/flows/login/add-site-roles.js",
        trigger: "post-login",
        dependencies: [],
        secrets: [],
      }),
    ])
      .then((ids2) => {
        //
        //  we have created the flows, now deploy them after waiting 2.5 seconds
        //      so they have time to build
        //
        return delay(2500).then(() =>
          Promise.all([
            deployFlow(config, ids2[0]),
            deployFlow(config, ids2[1]),
            deployFlow(config, ids2[2]),
          ])
        );
      })
      .then(() =>
        updateTriggerBinding(config, "post-login", [
          {
            name: "login-add-organization-info",
          },
          {
            name: "login-add-roles",
          },
          {
            name: "login-add-site-roles",
          },
        ])
      );
  });
}

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
