<template>
  <div class="feriados">
    <b-container fluid>
      <b-row>
        <b-col lg="6" class="my-1">
          <b-form-group
            label="Pesquisar"
            label-for="filter-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="filtrar..."
              ></b-form-input>

              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''"
                  >Limpar</b-button
                >
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>

    <!-- Modal de Cadastro e Edição -->
    <b-modal id="msgModal"></b-modal>

    <b-modal
      id="modalCadastro"
      title="Alterar Valor Previsto"
      header-bg-variant="success"
      header-text-variant="light"
      hide-footer
      @hidden="limparDados"
    >
      <b-container fluid>
        <b-form>
          <b-form-group id="label1" label="Vendedor" label-for="campo1">
            <b-form-select
              disabled
              v-model="vendedorSelecionado"
              :options="vendedores"
            ></b-form-select>
            <div class="error" v-if="!$v.vendedorSelecionado.required">
              Vendedor é Obrigatório.
            </div>
          </b-form-group>

          <b-form-group id="lb3" label="Valor Meta Mensal" label-for="camp3">
            <currency-input
              :Value="vendedorSemana.valorPrevisto"
              v-model="vendedorSemana.valorPrevisto"
              class="form-control"
            />
            <div class="error" v-if="!$v.vendedorSemana.valorPrevisto.required">
              Valor Previsto é Obrigatório.
            </div>
          </b-form-group>

          <b-button
            type="submit"
            variant="success"
            class="mr-2"
            @click.prevent="salvar"
            >Salvar</b-button
          >
          <b-button class="mr-2" @click="fecharModal">Fechar</b-button>
        </b-form>
      </b-container>
    </b-modal>

    <div class="tabela">
      <b-table
        responsive="sm"
        sticky-header="800px"
        striped
        hover
        bordered
        small
        show-empty
        head-variant="dark"
        table-variant=""
        :items="vendedoresSemana"
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

        <template #cell(valorRealizado)="row">
          <b-form v-model="row.item.valorRealizado" disabled>
            {{ formatPrice(row.item.valorRealizado) }}
          </b-form>
        </template>

        <template #cell(valorPrevisto)="row">
          <b-form v-model="row.item.valorPrevisto" disabled>
            {{ formatPrice(row.item.valorPrevisto) }}
          </b-form>
        </template>

        <template #cell(percentual)="row">
          <b-form v-model="row.item.percentual" disabled>
            {{ row.item.percentual }}%
            <b-iconstack font-scale="1.5" animation="fade">
              <b-icon
                stacked
                :icon="row.item.percentual >= 100 ? 'arrow-up' : 'arrow-down'"
                :variant="row.item.percentual >= 100 ? 'success' : 'danger'"
                scale="0.75"
                shift-v="-0.25"
              ></b-icon>
            </b-iconstack>
          </b-form>
        </template>

        <template #cell(actions)="row" v-if="meta.semanaId != 6">
          <b-button
            class="mr-2"
            size="sm"
            @click="editar(row.item, row.index, $event.target)"
            variant="warning"
          >
            <b-icon icon="pencil" aria-hidden="true">Editar</b-icon>
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
import moment from "moment";
import { required, minLength } from "vuelidate/lib/validators";
import axios from "axios";
// import { baseApiUrl } from "@/global";
import { baseApiUrl } from "../../global";

export default {
  name: "MetasVendedorSemana",
  props: {
    meta: { type: Object },
  },
  mounted() {
    this.listar();
    this.listarVendedores();
  },
  data() {
    return {
      tituloModal: "Cadastrar",
      fields: [
        { key: "id", label: "Id", sortable: true },
        { key: "nome", label: "Vendedor", sortable: true },
        { key: "valorRealizado", label: "Valor Realizado", sortable: true },
        { key: "valorPrevisto", label: "Valor Previsto", sortable: true },
        { key: "percentual", label: "Percentual", sortable: true },
        { key: "actions", label: "Ações" },
      ],
      vendedorSelecionado: null,
      vendedores: [],
      vendedorSemana: {
        id: null,
        metaId: null,
        metaSemanaId: null,
        vendedorId: null,
        valorRealizado: 0,
        valorPrevisto: 0,
        percentual: 0,
      },
      vendedoresSemana: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      filter: null,
      filterOn: [],
      pageOptions: [10, 15, 20, { value: 100, text: "Mostrar Tudo" }],
    };
  },
  validations: {
    vendedorSelecionado: { required },
    vendedorSemana: {
      valorPrevisto: {
        required,
      },
    },
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    abrirModal() {
      this.tituloModal = "CADASTRAR";
      this.$bvModal.show("modalCadastro");
    },
    listarVendedores() {
      axios.get(`${baseApiUrl}/vendedores/vendedoresSelect/`).then((res) => {
        this.vendedores = res.data;
      });
    },
    listar() {
      axios
        .get(
          `${baseApiUrl}/metasVendedorSemana/vendedoresSemana/${this.meta.metaId}/${this.meta.semanaId}`
        )
        .then((res) => {
          this.vendedoresSemana = res.data;
          this.totalRows = res.data.length;
        });
    },
    editar(item, index) {
      this.vendedorSemana = item;
      this.vendedorSelecionado = item.vendedorId;
      this.vendedorSemana.valorPrevisto = +item.valorPrevisto;

      this.$bvModal.show("modalCadastro");
    },
    salvar() {
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
        return;
      }

      const vendedorSelecionado = this.vendedores.filter(
        (f) => f.value == this.vendedorSelecionado
      )[0];

      const vendedor = `${vendedorSelecionado.text}/${this.formatPrice(
        this.vendedorSemana.valorPrevisto
      )}`;

      const vendedorSemana = {
        valorPrevisto: this.vendedorSemana.valorPrevisto,
      };

      axios
        .put(
          `${baseApiUrl}/metasVendedorSemana/${this.vendedorSemana.id}`,
          vendedorSemana
        )
        .then((res) => {
          this.listar();
          this.alertaMensagem(`Vendedor (${vendedor}) Alterado.`);
          return res;
        })
        .catch((error) => {
          const erro = error.response.data.message;
          this.$bvModal.msgBoxOk(`Erro alterar Vendedor: ${vendedor} ${erro}`);
          this.listar();
        });

      this.limparDados();
      this.$bvModal.hide("modalCadastro");
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return "R$ " + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    alertaMensagem(mensagem = "") {
      this.$bvToast.toast(`${mensagem}`, {
        title: "Sucesso",
        variant: "success",
        solid: true,
      });
    },
    limparDados() {
      this.feriado = {
        descricao: "",
        dia: null,
      };
    },
    converterData(date, exibirGrid) {
      if (exibirGrid) return moment(date).format("DD-MM-YYYY");
      else return moment(date).format("YYYY-MM-DD HH:mm");
    },
    fecharModal() {
      this.limparDados();
      this.$bvModal.hide("modalCadastro");
    },
  },
};
</script>

<style>
.headerFeriado {
  display: flex;
  justify-content: center;
  background-color: #4caf50;
  color: #fff;
  border-radius: 5px;
}
.feriados {
  text-align: center;
  margin: 10px;
}
.error {
  color: red;
}
</style>