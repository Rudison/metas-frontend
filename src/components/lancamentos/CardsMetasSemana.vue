<template>
  <div>
    <!-- Lançamentos -->
    <div class="menus">
      <b-card
        class="ml-5 mr-5"
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
            <div class="titulosValores mt-2">Dias Uteis/Semana</div>
            <strong>{{ metas.diasUteisSemana }}</strong>
          </b-list-group-item>
        </b-list-group>

        <b-card-footer>
          <b-button-group>
            <b-button
              size="sm"
              variant="warning"
              v-b-tooltip.hover
              title="Editar Semana"
              @click.stop="editar(metas.id)"
            >
              <b-icon icon="pencil" aria-label="Editar"></b-icon>
            </b-button>

            <b-button
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

    <div class="gridSemana mt-2">
      <b-table
        responsive="sm"
        sticky-header="500px"
        striped
        hover
        bordered
        small
        show-empty
        head-variant="dark"
        table-variant=""
        :items="feriados"
        :fields="fields"
        :per-page="perPage"
        :filter="filter"
        :current-page="currentPage"
        @filtered="onFiltered"
      >
        <template #empty="scope">
          <p>
            <strong>
              {{ (scope.emptyText = "Sem registros cadastrados") }}
            </strong>
          </p>
        </template>

        <template #emptyfiltered="scope">
          <p>
            <strong>
              {{ (scope.emptyFilteredText = "Nenhum registro encontrado!") }}
            </strong>
          </p>
        </template>

        <template #cell(dia)="row">
          {{ converterData(row.item.dia, true) }}
        </template>

        <template #cell(actions)="row">
          <b-button
            class="mr-2"
            size="sm"
            @click="editar(row.item, row.index, $event.target)"
            variant="warning"
          >
            <b-icon icon="pencil" aria-hidden="true">Editar</b-icon>
          </b-button>
          <b-button
            size="sm"
            @click="excluir(row.item, row.index, $event.target)"
            variant="danger"
          >
            <b-icon icon="trash" aria-hidden="true">Excluir</b-icon>
          </b-button>
        </template>
      </b-table>

      <b-container fluid>
        <b-row>
          <b-col sm="4" md="4" class="my-1">
            <b-form-group
              label="Por página"
              label-for="per-page-select"
              label-cols-sm="6"
              label-cols-md="4"
              label-cols-lg="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
              ></b-form-select>
            </b-form-group>
          </b-col>

          <b-col sm="7" md="6" class="my-1">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import axios from "axios";
import { baseApiUrl } from "@/global";
import moment from "moment";

export default {
  name: "Lancamentos",
  props: ["metaId"],
  mounted() {
    this.listar();
  },
  data() {
    return {
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
      console.log(meta);
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
      const meta = this.metas.filter((m) => m.id == id);

      this.$bvModal
        .msgBoxConfirm(`Meta: ${meta[0].Mes}`, {
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
              .delete(`${baseApiUrl}/metas/${id}`)
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
          this.$bvModal.msgBoxOk(`Erro excluir Meta: ${meta[0].Mes} ${err}`);
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
  },
};
</script>

<style scoped>
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
  grid-template-columns: repeat(6, 15%);
  align-content: center;
  align-items: flex-end;
  flex-wrap: wrap;
}
.card {
  cursor: pointer;
}
.footerCard {
  color: #fff;
  font-size: 1.3rem;
  font-weight: bold;
}
</style>