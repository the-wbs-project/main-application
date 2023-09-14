import axios from "axios";
import { readFile, writeFile } from "./files.js";

export function getToken(config) {
  const tokenPath = "./data/token.json";

  return readFile(tokenPath).then((data, err) => {
    if (err) {
      console.error(err);
      return;
    }
    if (data) {
      const token = JSON.parse(data);
      const now = new Date();
      const expires = new Date(token.expires);
      if (now < expires) {
        console.log("Token is still valid");
        return token.access_token;
      }
    }
    return axios
      .request({
        method: "POST",
        url: "https://" + config.domain + "/oauth/token",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          audience: config.audience,
          grant_type: "client_credentials",
        }),
      })
      .then((response) => {
        const token = response.data;
        const expires = new Date();

        expires.setSeconds(expires.getSeconds() + token.expires_in);

        token.expires = expires.getTime();

        return writeFile(tokenPath, JSON.stringify(response.data)).then(() => {
          return response.data.access_token;
        });
      })
      .catch((error) => console.log("error", error));
  });
}
