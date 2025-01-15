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
        return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.\n\nCaso o problema persista, entre em contato com a sua revenda. ";
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
