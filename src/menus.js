const cards = [
  {
    titulo: "CADASTROS",
    nomeImg: "IconCadastros.svg",
    pai: true,
    filhos: [
      {
        titulo: "VENDEDORES",
        nomeImg: "IconVendedores.svg",
        pai: false,
        filhos: false,
        popup: true,
      },
      {
        titulo: "FERIADOS",
        nomeImg: "IconFeriados.svg",
        pai: false,
        filhos: false,
        popup: true,
      },
    ],
    popup: false,
  },
  { titulo: "LANÇAMENTOS", nomeImg: "IconLancamentos.svg" },
  { titulo: "RELATÓRIOS", nomeImg: "IconRelatorios.svg" },
]

export default cards