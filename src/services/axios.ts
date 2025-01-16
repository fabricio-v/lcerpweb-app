import axios from "axios";

// export const CONNECTION_TIMEOUT = 20000;
export const CONNECTION_TIMEOUT_TEST = 2000;
export const VERSAO_API = "v1";

const baseURL_DEV = `http://localhost:8080/api/${VERSAO_API}`;
const baseURL_PROD = `http://api.lcerp.com.br:8080/api/${VERSAO_API}`;

const api = axios.create({
  baseURL: baseURL_PROD,
  // timeout: CONNECTION_TIMEOUT,
});

export default api;
