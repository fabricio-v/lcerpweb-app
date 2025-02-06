import { IPaisResponse } from "@/interfaces/response/PaisResponse";
import api from "../axios";

// export const requestAllPaises = async (token: string) => {
//   return api.get<IPaisResponse[]>(`/paises`, {
//     headers: {
//       Authorization: "Bearer " + token,
//     },
//   });
// };

export const requestPaisesByFilter = async (token: string, filter: string) => {
  return api.get<IPaisResponse[]>(`/paises`, {
    params: { filter },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
