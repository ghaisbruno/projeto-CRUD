export const numberFormat = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

export const dateFormat = (value) =>
  new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(value)