import { removeMask } from "./Funcoes";

export const maskNumber = (
  amount: any,
  showPrefix: boolean,
  decimalCount = 2,
  decimal = ",",
  thousands = ".",
) => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;
    if (showPrefix) {
      return (
        "R$ " +
        negativeSign +
        (j ? i.substr(0, j) + thousands : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
        (decimalCount
          ? decimal +
            Math.abs(amount - Number(i))
              .toFixed(decimalCount)
              .slice(2)
          : "")
      );
    } else {
      return (
        negativeSign +
        (j ? i.substr(0, j) + thousands : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
        (decimalCount
          ? decimal +
            Math.abs(amount - Number(i))
              .toFixed(decimalCount)
              .slice(2)
          : "")
      );
    }
  } catch (e) {}
};

export const maskCpfCnpj = (cpfCnpj: any, hideValue: boolean = false) => {
  cpfCnpj = removeMask(cpfCnpj);

  if (cpfCnpj.length === 14) {
    hideValue
      ? (cpfCnpj = `${cpfCnpj.substring(0, 2)}.***.***/${cpfCnpj.substring(
          8,
          12,
        )}-**`)
      : (cpfCnpj =
          cpfCnpj.substring(0, 2) +
          "." +
          cpfCnpj.substring(2, 5) +
          "." +
          cpfCnpj.substring(5, 8) +
          "/" +
          cpfCnpj.substring(8, 12) +
          "-" +
          cpfCnpj.substring(12, 14));
  } else if (cpfCnpj.length === 11) {
    hideValue
      ? (cpfCnpj = cpfCnpj.substring(0, 3) + ".***.***-**")
      : (cpfCnpj =
          cpfCnpj.substring(0, 3) +
          "." +
          cpfCnpj.substring(3, 6) +
          "." +
          cpfCnpj.substring(6, 9) +
          "-" +
          cpfCnpj.substring(9, 11));
  }
  return cpfCnpj;
};
