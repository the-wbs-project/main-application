/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const axios = require("axios");
  const namespace = "http://www.pm-empower.com";
  const tokenKey = "mgmtToken";
  const userId = encodeURIComponent(event.user.user_id);

  let token = api.cache.get(tokenKey)?.value;

  console.log("is token cached: " + (token != undefined));
  //
  //  If no token in cache, go get a new one!
  //
  if (!token) {
    const tokenResponse = await axios({
      url: `https://${event.secrets.domain}/oauth/token`,
      method: "post",
      data: {
        client_id: event.secrets.clientId,
        client_secret: event.secrets.secret,
        audience: event.secrets.audience,
        grant_type: "client_credentials",
      },
    });
    token = tokenResponse.data.access_token;

    if (token) {
      api.cache.set(tokenKey, token);
    }
  }
  if (!token) {
    //
    //  We can't get the stuff, just leave for now
    //
    return;
  }
  console.log(token);
  //
  //  Get the organizations
  //
  const orgListResponse = await axios({
    url: `https://${event.secrets.domain}/api/v2/users/${userId}/organizations`,
    method: "get",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const orgs = orgListResponse.data;

  api.idToken.setCustomClaim(namespace + "/organizations", orgs);
  api.accessToken.setCustomClaim(namespace + "/organizations", orgs);

  const orgRoles = {};

  for (const org of orgs) {
    const orgRolesResponse = await axios({
      url: `https://${event.secrets.domain}/api/v2/organizations/${org.id}/members/${userId}/roles`,
      method: "get",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const roles = [];

    for (const role of orgRolesResponse.data) {
      roles.push(role.id);
    }
    orgRoles[org.name] = roles;
  }
  api.idToken.setCustomClaim(namespace + "/organizations-roles", orgRoles);
  api.accessToken.setCustomClaim(namespace + "/organizations-roles", orgRoles);
};
