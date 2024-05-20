import * as auth0 from "./auth0.js";
import { readFile } from "./files.js";

export function getFlowIds(config) {
  return auth0
    .get(config, "actions/actions")
    .then((result) => {
      const results = {};

      for (const flow of result.actions) {
        results[flow.name] = flow.id;
      }
      return results;
    })
    .catch((error) => console.log("error", error));
}

export function uploadFlow(config, flow) {
  return readFile(flow.filePath)
    .then((data, err) => {
      if (err) {
        console.error(err);
        return;
      }
      var body = {
        name: flow.name,
        supported_triggers: [
          {
            id: flow.trigger,
            status: "built",
            version: "v3",
          },
        ],
        code: data,
        dependencies: flow.dependencies,
        runtime: "node18-actions",
        secrets: flow.secrets,
      };

      return flow.id
        ? auth0.patch(config, "actions/actions/" + flow.id, body)
        : auth0.post(config, "actions/actions", body);
    })
    .then((data) => data.id)
    .catch((error) => console.log("error", error));
}

export function deployFlow(config, id) {
  return auth0.post(config, "actions/actions/" + id + "/deploy", undefined);
}

export function getTriggers(config) {
  return auth0
    .get(config, "actions/triggers")
    .catch((error) => console.log("error", error));
}

export function getTriggerBindings(config, id) {
  return auth0
    .get(config, "actions/triggers/" + id + "/bindings")
    .catch((error) => console.log("error", error));
}

export function updateTriggerBinding(config, id, flows) {
  const body = {
    bindings: [],
  };

  for (const flow of flows) {
    body.bindings.push({
      ref: {
        type: "action_name",
        value: flow.name,
      },
      display_name: flow.name,
      secrets: [],
    });
  }
  return auth0
    .patch(config, "actions/triggers/" + id + "/bindings", body)
    .catch((error) => console.log("error", error));
}
