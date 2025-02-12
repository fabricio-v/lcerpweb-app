import api from "../axios";

export const requestGruposUsuario = async (token: string) => {
  return api.get<string[]>(`/grupos-usuario`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
