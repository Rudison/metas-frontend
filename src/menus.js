const cards = [
  {
    titulo: "CADASTROS",
    nomeImg: "IconCadastros.svg",
    icon: 'pencil-square',
    pai: true,
    possuiRota: false,
    rota: '',
    filhos: [
      {
        titulo: "VENDEDORES",
        componente:'Vendedores',
        nomeImg: "IconVendedores.svg",
        icon: 'pencil-square',
        pai: false,
        filhos: false,
        popup: true,
      },
      {
        titulo: "FERIADOS",
        componente:'Feriados',
        nomeImg: "IconFeriados.svg",
        icon: 'pencil-square',
        pai: false,
        filhos: false,
        popup: true,
      }
    ],
    popup: false,
  },
  { 
    titulo: "LANÇAMENTOS",
    nomeImg: "IconLancamentos.svg",
    icon: 'file-earmark-text',
    componente: 'Lancamentos',
    pai: true,
    filhos:[],
    possuiRota:true,
    rota: '/Lancamentos',
    popup: false,
  },
  { 
    titulo: "RELATÓRIOS", 
    nomeImg: "IconRelatorios.svg",
    icon: 'graph-up',
    pai: true,
    filhos:[],
    possuiRota: false,
  },
]

export default cards