<template>
  <div class="feriados">
    <div class="header">
      <h2>FERIADOS</h2>
    </div>
    <hr />
    <b-button
      variant="primary"
      @click="$bvModal.show('modalCadastro')"
      class="mb-2"
      >Inserir Novo</b-button
    >
    <!-- Modal de Cadastro e Edição -->
    <b-modal
      id="modalCadastro"
      title="Cadastrar Novo Feriado"
      hide-footer
      :clickToClose="false"
      @before-close="beforeClose"
      @before-open="beforeOpen"
      @closed="closeds"
      @opened="opened"
    >
      <b-container fluid>
        <b-form @submit.prevent="salvar">
          <b-form-group
            id="label1"
            label="Descrição"
            label-for="campo1"
            :invalid-feedback="invalidFeedback"
            :state="state"
          >
            <b-form-input
              id="campo1"
              v-model="feriado.nome"
              trim
              required
              :invalid-feedback="invalidFeedback"
              :state="state"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Dia do Feriado" label-for="inputFeriado">
            <b-form-datepicker
              id="inputFeriado"
              locale="pt-BR"
              format="DD-MM-YYYY"
              today-button
              reset-button
              placeholder="Selecione Uma Data"
              v-model="feriado.dia"
            ></b-form-datepicker>
          </b-form-group>
          <b-button type="submit" variant="success" class="mr-2"
            >Salvar</b-button
          >
          <b-button class="mr-2" @click="fecharModal">Fechar</b-button>
        </b-form>
      </b-container>
    </b-modal>

    <div class="tabela">
      <b-table
        responsive="sm"
        striped
        hover
        bordered
        small
        head-variant="dark"
        table-variant=""
        :items="feriados"
        :fields="fields"
      >
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
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "Feriados",
  data() {
    return {
      name: "",
      fields: [
        { key: "feriadoId", label: "Código", sortable: true },
        { key: "nome", label: "Descrição", sortable: true },
        { key: "dia", label: "Dia Feriado", sortable: true },
        { key: "actions", label: "Ações" },
      ],
      feriado: {
        nome: "",
        dia: null,
      },
      feriados: [
        { feriadoId: 1, nome: "Sexta Feira Santa", dia: "02-04-2021" },
        {
          feriadoId: 2,
          nome: "Aniversário de Várzea Grande",
          dia: "15-05-2021",
        },
        {
          feriadoId: 3,
          nome: "Natal",
          dia: "25-12-2021",
        },
      ],
    };
  },
  methods: {
    opened(event) {
      console.log(event);
    },
    beforeOpen(event) {
      console.log(event);
    },
    beforeClose(event) {
      this.limparDados();
      console.log(event);
    },
    closeds(event) {
      console.log(event);
    },
    salvar() {
      if (this.diaJaCadastrado() > 0) return;
      if (this.feriado.dia == null) return;

      console.log(this.feriado.dia);

      this.feriados.push({
        feriadoId: this.feriados.length + 1,
        nome: this.feriado.nome,
        dia: this.converterData(this.feriado.dia),
      });
      this.limparDados();
    },
    excluir(item, index) {
      return this.feriados.splice(index, 1);
    },
    editar(item, index) {
      this.feriado = this.feriados[index];
      this.$bvModal.show("modalCadastro");
    },
    limparDados() {
      this.feriado = {
        nome: "",
        dia: null,
      };
    },
    diaJaCadastrado() {
      const diaSelecionado = this.converterData(this.feriado.dia);
      return this.feriados.filter((d) => d.dia === diaSelecionado).length;
    },
    converterData(date) {
      return moment(date).format("DD-MM-YYYY");
    },
    fecharModal() {
      this.limparDados();
      this.$bvModal.hide("modalCadastro");
    },
  },
  computed: {
    state() {
      return this.feriado.nome.length >= 4;
    },
    invalidFeedback() {
      if (this.feriado.nome.length > 0) {
        return "Descrição menor que 4 caracteres.";
      }
      return "Campo Descrição Obrigatório!";
    },
  },
};
</script>

<style>
.header {
  height: 80px;
  background-color: #4caf50;
}
.feriados {
  text-align: center;
  margin: 10px;
}
</style>