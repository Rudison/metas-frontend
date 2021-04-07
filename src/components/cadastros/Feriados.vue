<template>
  <div class="feriados">
    <div class="header">
      <h2>FERIADOS</h2>
    </div>
    <hr />
    <b-button variant="primary" @click="abrirModal" class="mb-2">Inserir Novo</b-button>
    <!-- Modal de Cadastro e Edição -->
    <b-modal
      id="modalCadastro"
      :title="`${tituloModal} FERIADO`"
      hide-footer
      @hidden="limparDados"
    >
      <b-container fluid>        
        <b-form >
          <b-form-group
            id="label1"
            label="Descrição"
            label-for="campo1">
            <b-form-input
              id="campo1"
              v-model.trim="$v.feriado.nome.$model"
              required
            ></b-form-input>
             <div class="error" v-if="!$v.feriado.nome.required">Descrição Obrigatório.</div>
             <div class="error" v-if="!$v.feriado.nome.minLength">Mínimo {{ $v.feriado.nome.$params.minLength.min }} caracteres.</div>
          </b-form-group>

          <b-form-group label="Dia do Feriado" label-for="inputFeriado">
            <b-form-datepicker
              id="inputFeriado"
              locale="pt-BR"
              format="DD-MM-YYYY"
              today-button
              reset-button
              placeholder="Selecione Uma Data"
              v-model="$v.feriado.dia.$model"
            ></b-form-datepicker>
             <div class="error" v-if="!$v.feriado.dia.required">Dia Obrigatório.</div>

          </b-form-group>
          <b-button type="submit" variant="success" class="mr-2" @click.prevent="salvar">Salvar</b-button>
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
import {required, minLength} from 'vuelidate/lib/validators'

export default {
  name: "Feriados",
  data() {
    return {
      tituloModal: "Cadastrar",
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
  validations: {
    feriado: {
     nome:{
       required,
       minLength: minLength(3)
     },
     dia:{
       required
     }
    }
  },
  methods: {
    abrirModal() {
      this.tituloModal = "CADASTRAR";
      this.$bvModal.show("modalCadastro");
    },
    salvar() {
   
      const feriadoId = this.feriado.feriadoId;
      if (this.diaJaCadastrado() > 0) return;
      if (this.feriado.dia == null) return;

      if (feriadoId == null) {
        this.feriados.push({
          feriadoId: this.feriados.length + 1,
          nome: this.feriado.nome,
          dia: this.converterData(this.feriado.dia),
        });
      } else {
        const feriado = this.feriados.filter((f) => f.feriadoId == feriadoId);
        console.log(feriado);
        //logica para atualizar o feriado
      }

      this.limparDados();
      this.$bvModal.hide("modalCadastro");
    },
    excluir(item, index) {
      const feriado = this.feriados[index].nome;
      this.$bvModal
        .msgBoxConfirm(feriado, {
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
          if (value) this.feriados.splice(index, 1);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editar(item, index) {
      this.tituloModal = "ALTERAR";
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
.error{
  color: red;
}
</style>