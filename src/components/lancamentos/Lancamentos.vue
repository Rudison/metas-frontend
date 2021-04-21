<template>
  <div class="vendedores">
    <div class="header">
      <h2>VENDEDORES</h2>
    </div>
    <hr />
    <b-button variant="primary" @click="abrirModal" class="mb-2">Inserir Novo</b-button
    >
    <!-- Modal de Cadastro e Edição -->
    <b-modal
      id="modalCadastro"
      :title="`${tituloModal} VENDEDOR`"
      hide-footer
      @hidden="limparDados"
    >
      <b-container fluid>
        <p  v-if="submitStatus === 'ERROR'" class="error">* Existem Campos Obrigatórios</p>
        <b-form @submit.prevent="salvar">

           <b-form-group id="label1" label="Nome Vendedor" label-for="campo1">
           <b-form-input id="campo1" v-model.trim="$v.vendedor.nome.$model"></b-form-input>

           <div class="error" v-if="!$v.vendedor.nome.required">Descrição Obrigatório.</div>
           <div class="error" v-if="!$v.vendedor.nome.minLength">Mínimo {{ $v.vendedor.nome.$params.minLength.min }} caracteres.</div>
          </b-form-group>

          <b-form-group label="Empresa" label-for="inputEmpresa">
             <b-form-select
              id="campo2"
              v-model="empresaSelecionada"
              :options="$v.empresas.$model"
            ></b-form-select>
            <div class="error" v-if="!$v.empresaSelecionada.required">Empresa é Obrigatório.</div>
          </b-form-group>

         <b-form-group
            id="label3"
            label="Cód.Vendedor Blue"
            label-for="campo3">
            <b-form-input
              id="campo3"
              v-model="$v.vendedor.codVendedor.$model"
            ></b-form-input>
            <div class="error" v-if="!$v.vendedor.codVendedor.required">Cód.Vendedor Blue Obrigatório.</div>
             <div class="error" v-if="!$v.vendedor.codVendedor.minLength">Mínimo {{ $v.vendedor.codVendedor.$params.minLength.min }} caracteres.</div>
             <div class="error" v-if="!$v.vendedor.codVendedor.maxLength">Máximo {{ $v.vendedor.codVendedor.$params.maxLength.max }} caracteres.</div>
          </b-form-group>

           <b-form-group
            id="label4"
            label="Outros"
            label-for="campo4">
            <b-form-checkbox id="campo4" v-model="vendedor.outros">
              {{ vendedor.outros ? 'Sim' : 'Não'}}
            </b-form-checkbox>
          </b-form-group>

           <b-form-group
            id="label5"
            label="Férias"
            label-for="campo5">
            <b-form-checkbox id="campo5" v-model="vendedor.ferias">
              {{ vendedor.ferias ? 'Sim' : 'Não'}}
            </b-form-checkbox>
          </b-form-group>

           <b-form-group
            id="label6"
            label="Ativo"
            label-for="campo6">
            <b-form-checkbox id="campo6" v-model="vendedor.ativo" >
              {{ vendedor.ativo ? 'Sim' : 'Não'}}
            </b-form-checkbox>
          </b-form-group>

          <b-button type="submit" variant="success" class="mr-2">Salvar</b-button>
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
        :items="vendedores"
        :fields="fields"
      >
        <template #cell(outros)="row">
          <b-form-checkbox v-model="row.item.outros" disabled>            
            {{ row.item.outros ? "Sim" : "Não" }}
          </b-form-checkbox>
        </template>

        <template #cell(ferias)="row">
          <b-form-checkbox v-model="row.item.ferias" disabled>
            {{ row.item.ferias ? "Sim" : "Não" }}
          </b-form-checkbox>
        </template>

        <template #cell(ativo)="row">
          <b-form-checkbox disabled 
            v-model="row.item.ativo">
            {{ row.item.ativo  ? "Sim" : "Não" }}
          </b-form-checkbox>
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
    </div>
  </div>
</template>

<script>
import {required, minLength, maxLength} from 'vuelidate/lib/validators'

export default {
  name: "Vendedores",
  data() {
    return {
      tituloModal: "Lancamentos",
      submitStatus: null,
      empresaSelecionada: null,
      empresas:[
        { value: null, text: 'Selecione uma Empresa' },
        { value: 1, text: 'Castelo' },
        { value: 2, text: 'Stoky' }
      ],
      vendedor: {
        empresaId: 1,
        codVendedor: "",
        nome: "",
        outros: false,
        ferias: false,
        ativo: true,
      },
    };
  },
  validations: {
    empresas:{
      required
    },
    empresaSelecionada:{
      required
    },
    vendedor: {
      empresaId:{
        required
      },
      codVendedor:{
        required,
        minLength: minLength(5),
        maxLength: maxLength(5)
      },
      nome:{
        required,
        minLength: minLength(3)
      }
    }
  },
  methods: {
    salvar() {

      if(this.$v.$invalid) {
        this.submitStatus = 'ERROR'
        return;
      }

      const id = this.vendedor.id;

      if (id == null) {
        this.vendedores.push({
          id: this.vendedores.length + 1,
          empresaId: this.empresaSelecionada,
          nome: this.vendedor.nome,
          codVendedor: this.vendedor.codVendedor,
          outros: this.vendedor.outros,
          ferias: this.vendedor.ferias,
          ativo: this.vendedor.ativo
        });
      } else {
        const vendedor = this.vendedores.filter(
          (v) => v.id == id
        );
        console.log(vendedor);
      }

      this.limparDados();
      this.$bvModal.hide("modalCadastro");
    },
    excluir(item, index) {
      const vendedor = this.vendedores[index].nome;
      this.$bvModal
        .msgBoxConfirm(vendedor, {
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
          if (value) this.vendedores.splice(index, 1);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editar(item, index) {
      this.tituloModal = "ALTERAR";
      this.vendedor = this.vendedores[index];
      this.$bvModal.show("modalCadastro");
    },
    limparDados() {
      this.vendedor = {
        empresaId: 1,
        codVendedor: "",
        nome: "",
        outros: false,
        ferias: false,
        ativo: true,
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
.vendedores {
  text-align: center;
  margin: 10px;
}
</style>