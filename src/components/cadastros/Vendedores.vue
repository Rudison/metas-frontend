<template>
  <div class="vendedores">
    <div class="header">
      <h2>VENDEDORES</h2>
    </div>
    <hr />   

    <b-container fluid>
      <b-row>
         <b-col lg="6" class="my-1">
          <b-form-group
            label="Pesquisar"
            label-for="filter-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0">
            <b-input-group size="sm">
              <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="filtrar..."></b-form-input>

              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Limpar</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col lg="6" class="my-1">
          <b-button variant="primary" size="sm" @click="abrirModal" class="mb-2">Inserir Novo</b-button>    
        </b-col>
      </b-row>
    </b-container>
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

         <b-form-group
            id="label3"
            label="Cód.Vendedor Blue"
            label-for="campo3">
            <b-form-input
              id="campo3"
              v-model="$v.vendedor.codVendBlue.$model"
            ></b-form-input>
            <div class="error" v-if="!$v.vendedor.codVendBlue.required">Cód.Vendedor Blue Obrigatório.</div>
             <div class="error" v-if="!$v.vendedor.codVendBlue.minLength">Mínimo {{ $v.vendedor.codVendBlue.$params.minLength.min }} caracteres.</div>
             <div class="error" v-if="!$v.vendedor.codVendBlue.maxLength">Máximo {{ $v.vendedor.codVendBlue.$params.maxLength.max }} caracteres.</div>
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
        sticky-header="500px"
        striped
        hover
        bordered
        small
        show-empty
        head-variant="dark"
        table-variant=""
        :items="vendedores"
        :fields="fields"
        :per-page="perPage"
        :filter="filter"
        :current-page="currentPage"
        @filtered="onFiltered">

        <template #empty="scope">
          <p> <strong> {{ scope.emptyText =  'Sem registros cadastrados' }} </strong></p>
        </template>

        <template #emptyfiltered="scope">
          <p> <strong> {{ scope.emptyFilteredText = 'Nenhum registro encontrado!' }} </strong> </p>
        </template>

        <template #cell(outros)="row">
          <b-form-checkbox v-model="row.item.outros" disabled>            
            {{ row.item.outros ? "Sim" : "Não" }}
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
          class="mb-0">

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
</template>

<script>
import {required, minLength, maxLength} from 'vuelidate/lib/validators'
import axios from 'axios'
import { baseApiUrl } from '@/global'

export default {
  name: "Vendedores",
  mounted() {
    this.listar()
  },
  data() {
    return {
      tituloModal: "Vendedor",
      submitStatus: null,
      fields: [
        { key: "id", label: "Id", sortable: true },
        { key: "codVendBlue", label: "Cód.Vend.Blue" },
        { key: "nome", label: "Nome", sortable: true },
        {
          key: "outros",
          label: "Outros",
          sortable: true,
        },
        {
          key: "ativo",
          label: "Ativo",
          sortable: true,
        },
        { key: "actions", label: "Ações" },
      ],
      vendedor: {
        codVendBlue: "",
        nome: "",
        ativo: true,
        outros:false
      },
      vendedores: [],
      totalRows: 1,
      currentPage: 1,
      perPage:10,
      filter: null,
      filterOn: [],
      pageOptions: [10,15,20, { value: 100, text: 'Mostrar Tudo'}]
    };
  },
  validations: {
    vendedor: {
      codVendBlue:{
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
    onFiltered(filteredItems){
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    abrirModal() {
      this.limparDados()
      this.tituloModal = "CADASTRAR";
      this.$bvModal.show("modalCadastro");
    },
    listar(){
      axios.get(`${baseApiUrl}/vendedores`).then(res => {
        this.vendedores = res.data
        this.totalRows = res.data.length
      })
    },
    salvar() {
      if(this.$v.$invalid) {
        this.submitStatus = 'ERROR'
        return;
      }

      const id = this.vendedor.id;      

      if (id == null) {
        axios.post(`${baseApiUrl}/vendedores`, this.vendedor).then(res => {
          this.listar()
          return res
        })
        .catch(error => {
           const erro = error.response.data.message
          this.$bvModal.msgBoxOk(`Erro Incluir Vendedor: ${this.vendedor.nome} ${erro}`, {
            title: 'Atenção'
          })
          return error
        })
      } else {

         const vendedor = {
           codVendBlue: this.vendedor.codVendBlue,
           nome: this.vendedor.nome,
           ativo: this.vendedor.ativo,
           outros: this.vendedor.outros
         }
         
         axios.put(`${baseApiUrl}/vendedores/${id}`, vendedor).then(res => {
           this.listar()
           return res
        }).catch(error => {
          const erro = error.response.data.message
          this.$bvModal.msgBoxOk(`Erro alterar Vendedor: ${this.vendedor.nome} ${erro}`)
          this.listar()
        })
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
          if (value) {
            axios.delete(`${baseApiUrl}/vendedores/${item.id}`).then(res => {
              this.listar()
              return res
            })
          }
        })
        .catch((err) => {
          this.$bvModal.msgBoxOk(`Erro excluir Vendedor: ${this.vendedor.nome} ${err}`)
        });
    },
    editar(item, index) {
      this.tituloModal = "ALTERAR";
      this.vendedor = item
      this.$bvModal.show("modalCadastro");
    },
    limparDados() {
      this.vendedor = {
        codVendBlue: "",
        nome: "",
        outros: false,
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