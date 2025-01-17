import axios from "axios";

export const CONNECTION_TIMEOUT_TEST = 2000;
export const VERSAO_API = "v1";

const baseURL_DEV = `http://localhost:8080/api/${VERSAO_API}`;
const baseURL_PROD = `https://api.lcerp.com.br/api/${VERSAO_API}`;

const api = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? baseURL_DEV : baseURL_PROD,
});

export default api;
