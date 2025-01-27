// import { useEffect, useState } from "react";
// import { IProdutoResumeResponse } from "@/interfaces/response/ProdutoResumeResponse";
// export default function usePaginatedResumeProducts(
//   token: string,
//   ativo: boolean | null,
//   nome: string | null,
//   descricao: string | null,
//   codigoInterno: string | null,
//   codigoBarras: string | null,
//   codigo: string | null,
//   referencia: string | null,
//   idCategoria: number | null,
//   idSubcategoria: number | null,
//   idFabricante: number | null,
//   idUnidade: number | null,
//   idEmpresa: number,
//   page: number,
//   size: number,
// ) {
//   const [data, setData] = useState({
//     products: [],
//     totalPages: 0,
//     totalElements: 0,
//   } as {
//     products: IProdutoResumeResponse[];
//     totalPages: number;
//     totalElements: number;
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<null | string>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get("/api/products", {
//           params: { page, size },
//         });
//         const { content, totalPages, totalElements } = response.data;
//         setData({
//           products: content,
//           totalPages,
//           totalElements,
//         });
//       } catch (err) {
//         setError("Erro ao carregar produtos");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [page, size]);

//   return { data, loading, error };
// }
