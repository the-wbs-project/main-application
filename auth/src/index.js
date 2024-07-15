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
          Promise.all([deployFlow(config, ids2[0])])
        );
      })
      .then(() =>
        updateTriggerBinding(config, "post-login", [
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
