<template>
  <div class="empresas">
    <div class="header">
      <h2>EMPRESAS</h2>
    </div>
    <hr />
    <b-button variant="primary" @click="abrirModal" class="mb-2">Inserir Novo</b-button>
    <!-- Modal de Cadastro e Edição -->
    <b-modal
      id="modalCadastro"
      :title="`${tituloModal} EMPRESA`"
      hide-footer
      @hidden="limparDados"
    >
      <b-container fluid>        
        <b-form >

          <b-form-group
            id="label1"
            label="Razão Social"
            label-for="campo1">
            <b-form-input
              id="campo1"
              v-model.trim="$v.empresa.razaoSocial.$model"
              required>
            </b-form-input>
             <div class="error" v-if="!$v.empresa.razaoSocial.required">Razão Social Obrigatório.</div>
             <div class="error" v-if="!$v.empresa.razaoSocial.minLength">Mínimo {{ $v.empresa.razaoSocial.$params.minLength.min }} caracteres.</div>
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
        :items="empresas"
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
import {required, minLength, maxLength} from 'vuelidate/lib/validators'

export default {
  name: "Empresas",
  data() {
    return {
      tituloModal: "Cadastrar",
      fields: [
        { key: "id", label: "Id", sortable: true },
        { key: "razaoSocial", label: "Razão Social", sortable: true },
        { key: "cnpj", label: "Cnpj", sortable: true },
        { key: "email", label: "E-mail", sortable: true },
        { key: "logo", label: "Logo", sortable: true },
        { key: "actions", label: "Ações" },
      ],
      empresa: {
        razaoSocial: "",
        cnpj: "",
        email: "",
        logo: '',
      },
      empresas: [
        { id: 1, razaoSocial: "Castelo Materiais Para Construção", cnpj: "02623245000109", email:'t.i@castelovirtual.com.br' },
        { id: 2, razaoSocial: "Stoky Distribuidora", cnpj: "05701024000109", email: 'stoky@stoky.com.br' },
      ],
    };
  },
  validations: {
    empresa: {
     razaoSocial:{
       required,
       minLength: minLength(5)
     },
     cnpj:{
       required,
       maxLength: maxLength(14),
       minLength: minLength(14)
     },
    }
  },
  methods: {
    abrirModal() {
      this.tituloModal = "CADASTRAR";
      this.$bvModal.show("modalCadastro");
    },
    salvar() {
   
      const id = this.empresa.id;

      if (id == null) {
        this.empresas.push({
          id: this.empresa.length + 1,
          razaoSocial: this.empresa.razaoSocial,
          cnpj: this.empresa.cnpj,
          logo: this.empresa.logo
        });
      } else {
        const empresa = this.empresas.filter((f) => f.id == id);
        console.log(empresa)
        //logica para atualizar o feriado
      }

      this.limparDados();
      this.$bvModal.hide("modalCadastro");
    },
    excluir(item, index) {

      const empresa = this.empresas[index].razaoSocial;
      this.$bvModal
        .msgBoxConfirm(empresa, {
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
          if (value) this.empresas.splice(index, 1);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editar(item, index) {
      this.tituloModal = "ALTERAR";
      this.empresa = this.empresas[index];
      this.$bvModal.show("modalCadastro");
    },
    limparDados() {
      this.empresa = {
        razaoSocial: "",
        cnpj: "",
        email: "",
        logo: '',
      };
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
.empresas {
  text-align: center;
  margin: 10px;
}
.error{
  color: red;
}
</style>