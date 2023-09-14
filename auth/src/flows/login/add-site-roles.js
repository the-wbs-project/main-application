/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = "http://www.pm-empower.com";

  if (event.authorization) {
    api.idToken.setCustomClaim(
      `${namespace}/site-roles`,
      event.authorization.roles
    );
    api.accessToken.setCustomClaim(
      `${namespace}/site-roles`,
      event.authorization.roles
    );
  }
};
