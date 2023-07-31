export const AUTH_HTTP_CONTROL = {
  FORM_INPUT: 'form_input',
  BODY: 'body',
  HEADER: 'header',
  TOKEN_HEADER: 'token_header',
  QUERY: 'query',
  TOKEN_QUERY: 'token_query',
  TOKEN_URL: 'token_url',
};

export const AUTH_ATTR = {
  USERNAME: 'username',
  PASSWORD: 'password',
};

export const AUTH_ATTR_SCOPE = {
  API_INSTANCE: 'api_instance',
  API_INTEGRATION: 'api_integration',
  SUBSCRIPTION: 'subscription',
};

export const AUTH_ATTR_DATA_PROVIDER = {
  API_PUBLISHER: 'api_publisher',
  APP_PUBLISHER: 'app_publisher',
  SUBSCRIBER: 'subscriber',
};

export const AUTH_ACCESS_MODEL = {
  BASIC_AUTH: 'basic_authentication',
  APIKEY_SECRET: 'apikey_secret',
  OAUTH2_CLIENT_CREDENTIALS: 'oauth2_client_credentials',
  OAUTH2_CUSTOM: 'oauth2_custom',
  OAUTH2_FORTELLIS: 'oauth2_fortellis',
};

export const OAUTH_CLIENT_CREDENTIALS_ATTRS: Record<string, string> = {
  scope: 'scope',
  token_url: AUTH_HTTP_CONTROL.TOKEN_URL,
  client_id: 'client_id',
  client_secret: 'client_secret',
};

export const OAUTH_CUSTOM_ATTRS: Record<string, string> = {
  method: 'method',
  token_url: AUTH_HTTP_CONTROL.TOKEN_URL,
  content_type: 'content_type',
  token_attribute_name_in_response: 'token_attribute_name_in_response',
  token_prefix: 'token_prefix',
  token_ttl: 'token_ttl',
};

export const CONTENT_TYPES = {
  JSON: 'application/json',
  WWW_FORM: 'application/x-www-form-urlencoded',
};

export const BASIC_AUTH_ATTRS: Record<string, string> = {
  username: AUTH_ATTR.USERNAME,
  password: AUTH_ATTR.PASSWORD,
};

export const API_KEY_SECRET_ATTRS: Record<string, string> = {};

export const OAUTH_GRANT = {
  CLIENT_CREDENTIALS: 'client_credentials',
};

export const STATUS = {
  ACTIVE: 'active',
  RETIRED: 'retired',
};
