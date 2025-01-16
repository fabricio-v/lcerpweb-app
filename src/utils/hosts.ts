export const DOMAIN =
  process.env.NODE_ENV === "development"
    ? "lcerp-local.com.br"
    : "lcerp.com.br";

export const HOST =
  process.env.NODE_ENV === "development" ? DOMAIN + ":3000" : DOMAIN;

export const PROTOCOL =
  process.env.NODE_ENV === "development" ? "http://" : "http://";
