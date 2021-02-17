export const numberFormat = (value, options) =>
  new Intl.NumberFormat('pt-BR', options).format(value);

export const dateFormat = (value) =>
  new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(value)