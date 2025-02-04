import axios, { AxiosError } from "axios";

export const buildMessageException = (
  exception: AxiosError | string | unknown,
) => {
  if (exception) {
    if (axios.isAxiosError(exception)) {
      if (exception.response) {
        if (exception.response.status === 423) {
          // return `Faça a ativação no servidor ${SessaoAberta.nomeAplicativo} Server e tente novamente. `;
        }

        let msg = "";
        msg += exception.response.data.userMessage;

        if (exception.response.data.problemFields) {
          msg += "\n\n";
          exception.response.data.problemFields.forEach(
            (problemFields: any) => {
              msg += "- " + problemFields.userMessage;
            },
          );
        }
        if (exception.response.data.fields) {
          msg += "\n\n";
          exception.response.data.fields.forEach((fields: any) => {
            msg += "- " + fields.userMessage;
          });
        }

        return msg;
      } else if (exception.request) {
        return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
      } else {
        return exception.message;
      }
    } else {
      return String(exception);
    }
  } else {
    return "Erro inesperado. Tente novamente." + exception;
  }
};

export const removeMask = (value: string) => {
  return value ? value.replace(/[^\d]+/g, "") : "";
};

export function isValidCNPJ(cnpj: any) {
  cnpj = removeMask(cnpj);
  if (!cnpj || cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho++;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos.charAt(1));
}

export const isValidDateDDMMYYYY = (dateString: string) => {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

  if (!regex.test(dateString)) return false; // Verifica o formato DD/MM/YYYY

  const [day, month, year] = dateString.split("/").map(Number);
  const date = new Date(year, month - 1, day);

  // Verifica se a data é válida
  return (
    date.getDate() === day &&
    date.getMonth() + 1 === month &&
    date.getFullYear() === year
  );
};
