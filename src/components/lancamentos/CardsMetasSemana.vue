<template>
  <div>
    <b-modal
      id="modalEditMetaSemana"
      :title="`Metas da Semana - ${mesAnoMeta}`"
      hide-footer
    >
      <MetasSemana :metaId="metaId" :fecharModalSem="fecharModalSemana" />
    </b-modal>

    <b-modal
      size="lg"
      id="modalGridMetaSemana"
      :title="`Metas da - ${mesAnoMeta}`"
      hide-footer
    >
      <MetasVendedorSemana
        :meta="meta"
        :fecharModalVendedores="fecharModalSemana"
      />
    </b-modal>

    <!-- Lançamentos -->
    <div class="menus">
      <b-card
        class="ml-5 mr-3 grow"
        :style="`background-color: #4caf50; width: ${widthCard}; max-width: 20rem`"
        v-for="metas in metasSemana"
        :key="metas.id"
        no-body
        @click.stop="cardSelecionado(metas)"
      >
        <template #header>
          <h4 class="mb-0 tituloMes">{{ metas.descricao }}</h4>
        </template>

        <b-list-group flush>
          <b-list-group-item>
            <div class="titulosValores">Data Inicial</div>
            <strong> {{ converterData(metas.dataInicial) }} </strong>
            <div class="titulosValores mt-2">Data Final</div>
            <strong>
              {{ converterData(metas.dataFinal) }}
            </strong>
            <div class="titulosValores">Dias Uteis/Semana</div>
            <strong>{{ metas.diasUteisSemana }}</strong>
          </b-list-group-item>
        </b-list-group>

        <b-card-footer>
          <b-button-group>
            <b-button
              size="sm"
              variant="primary"
              v-b-tooltip.hover
              title="Imprimir Semana"
              @click.stop="editar(metas.id)"
            >
              <b-icon icon="printer" aria-label="Editar"></b-icon>
            </b-button>

            <b-button
              size="sm"
              variant="info"
              v-b-tooltip.hover
              title="Atualizar Semana(Blue)"
              @click.stop="editar(metas.id)"
            >
              <b-icon icon="arrow-counterclockwise"></b-icon>
            </b-button>
            <b-button
              v-if="metas.semanaId != 6"
              size="sm"
              variant="warning"
              v-b-tooltip.hover
              title="Editar Semana"
              @click.stop="editar(metas.id)"
            >
              <b-icon icon="pencil" aria-label="Editar"></b-icon>
            </b-button>

            <b-button
              v-if="metas.semanaId != 6"
              size="sm"
              variant="danger"
              v-b-tooltip.hover
              title="Excluir Semana"
              @click.stop="excluir(metas.id)"
            >
              <b-icon icon="trash"></b-icon>
            </b-button>
          </b-button-group>
        </b-card-footer>
      </b-card>
    </div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import axios from "axios";
import { baseApiUrl } from "@/global";
import moment from "moment";
import MetasSemana from "./MetasSemana";
import MetasVendedorSemana from "./MetasVendedorSemana";

export default {
  name: "Lancamentos",
  props: {
    metaId: { type: String },
  },
  components: { MetasSemana, MetasVendedorSemana },
  mounted() {
    this.listar();
  },
  data() {
    return {
      meta: this.$route.params.property,
      mesAnoMeta: "teste",
      tituloMeta: "Nova",
      semanaSelecionada: null,
      semanas: [],
      metasSemana: [],
      widthCard: "210px",
      metaSemana: {
        id: null,
        metaId: 0,
        semanaId: 0,
        descricao: "",
        dataInicial: null,
        dataFinal: null,
        diasUteisSemana: 0,
      },
      info: false,
    };
  },
  validations: {
    semanaSelecionada: {
      required,
    },
    metaSemana: {
      semanaId: {
        required,
      },
      dataInicial: {
        required,
      },
      dataFinal: { required },
      semanasNoMes: {
        required,
      },
    },
  },
  methods: {
    cardSelecionado(meta) {
      this.$bvModal.show("modalGridMetaSemana");
    },
    editar(id) {
      this.tituloMeta = "Editar";
      this.$bvModal.show("modalCadastro");

      axios.get(`${baseApiUrl}/metasSemana/porMeta/${id}`).then((res) => {
        this.mesSelecionado = res.data.mesId;
        this.meta = res.data;
        this.meta.valorMetaMensal = +res.data.valorMetaMensal;
      });
    },
    listar() {
      axios
        .get(`${baseApiUrl}/metasSemana/porMeta/${this.metaId}`)
        .then((res) => {
          this.metasSemana = res.data;
        })
        .catch((error) => {
          console.log(error);
        });

      this.$bvModal.hide("modalAno");
    },
    salvar() {
      const meta = {
        mesId: this.mesSelecionado,
        ano: this.meta.ano,
        valorMetaMensal: this.meta.valorMetaMensal,
        semanasNoMes: this.meta.semanasNoMes,
      };

      const id = this.meta.id;

      if (id == null) {
        axios
          .post(`${baseApiUrl}/metas/`, meta)
          .then((res) => {
            this.listar();
            this.fecharModalCadastro();
            return res;
          })
          .catch((error) => {
            const erro = error.response.data.message;
            this.$bvModal.msgBoxOk(`Erro ao incluir Meta: ${erro}`, {
              title: "Atenção",
            });
            return erro;
          });
      } else {
        axios
          .put(`${baseApiUrl}/metas/${id}`, this.meta)
          .then((res) => {
            this.listar();
            this.fecharModalCadastro();
            return res;
          })
          .catch((error) => {
            const erro = error.response.data.message;
            this.$bvModal.msgBoxOk(`Erro alterar Meta: ${erro}`);
            this.listar();
          });
      }
    },
    excluir(id) {
      const metasSemana = this.metasSemana.filter((m) => m.id == id);
      this.$bvModal
        .msgBoxConfirm(`Meta: ${metasSemana[0].descricao}`, {
          title: "Deseja Excluir Esse Registro?",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "Sim",
          cancelTitle: "Não",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value) {
            axios
              .delete(`${baseApiUrl}/metasSemana/${id}`)
              .then((res) => {
                this.listar();
                return res;
              })
              .catch((error) => {
                const erro = error.response.data.message;
                console.log(erro);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$bvModal.msgBoxOk(
            `Erro excluir Meta: ${metasSemana[0].Mes} ${err}`
          );
        });
    },
    fecharModalCadastro() {
      this.limparDados();
      this.$bvModal.hide("modalCadastro");
    },
    abrirInfo() {
      this.info = !this.info;
      this.widthCard = !this.info ? "210px" : "220px";
    },
    converterData(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    limparDados() {
      this.mesSelecionado = null;
      this.meta = {
        id: null,
        mesId: 0,
        ano: 2021,
        valorMetaMensal: 0,
        valorMetaRealizadoMensal: 0,
        semanasNoMes: 0,
        diasUteisMes: 0,
      };
    },
    fecharModalSemana() {},
  },
};
</script>

<style>
.gridSemana {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
}
.tituloMes {
  font-size: 1.3rem;
  color: #fff;
  font-weight: bold;
}
.titulosValores {
  color: #4caf50;
  font-size: 1.1rem;
  font-weight: bold;
}
.btnback {
  float: left;
}
.menus {
  display: grid;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  grid-template-columns: repeat(6, 15.5%);
  flex-wrap: wrap;
}
.card {
  cursor: pointer;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.25);
}
/* .card:hover {
  border: 1px solid #000;
} */
.grow {
  transition: all 0.2s ease-in-out;
}
.grow:hover {
  transform: scale(1.1);
}
.footerCard {
  color: #fff;
  font-size: 1.3rem;
  font-weight: bold;
}
</style>