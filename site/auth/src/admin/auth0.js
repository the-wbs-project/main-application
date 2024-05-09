import axios from "axios";

export function get(config, suffix) {
  return axios
    .get("https://" + config.domain + "/api/v2/" + suffix, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + config.token,
      },
    })
    .then((response) => response.data)
    .catch((error) => console.log("error", error));
}

export function patch(config, suffix, body) {
  return axios
    .patch("https://" + config.domain + "/api/v2/" + suffix, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + config.token,
      },
    })
    .then((response) => response.data)
    .catch((error) => console.log("error", error));
}

export function post(config, suffix, body) {
  return axios
    .post("https://" + config.domain + "/api/v2/" + suffix, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + config.token,
      },
    })
    .then((response) => response.data)
    .catch((error) => console.log("error", error));
}
