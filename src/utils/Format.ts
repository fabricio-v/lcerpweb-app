export const formataDataBRParaUSA = (data: any) => {
  if (data === null || data === undefined || data === "") {
    return "";
  }

  const [dia, mes, ano] = data.split("/");
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
};

export const formataDataUSAParaBR = (data: any) => {
  if (data === null || data === undefined || data === "") {
    return "";
  }

  const [ano, mes, dia] = data.split("-");
  return `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}/${ano}`;
};
