import api from "../axios";

export const requestEmpresasAvailables = async (token: string) => {
  return api.get("/empresas/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
