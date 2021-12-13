export class ConfigurationError extends Error {
  name = "ConfigurationError";

  constructor(message = "") {
    super(message);
  }
}

export class TokenValidationError extends Error {
  name = "TokenValidationError";

  constructor(message = "") {
    super(message);
  }
}
