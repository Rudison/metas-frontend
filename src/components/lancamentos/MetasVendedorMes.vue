<template>
  <div class="feriados">
    <b-container fluid>
      <b-row>
        <b-col lg="6" class="my-1">
          <b-form-group
            label-for="filter-input"
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
        <b-col lg="6" class="my-1">
          <b-button variant="primary" size="sm" @click="abrirModal" class="mb-2"
            >Inserir Novo</b-button
          >
        </b-col>
      </b-row>
    </b-container>

    <!-- Modal de Cadastro e Edição -->

    <b-modal
      id="modalCadastro"
      :title="`${tituloModal} Meta Vendedor Mes`"
      hide-footer
      @hidden="limparDados"
    >
      <b-container fluid>
        <b-form>
          <b-form-group id="label1" label="Vendedor" label-for="campo1">
            <b-form-select
              :disabled="metaVendedor.id != null"
              v-model="vendedorSelecionado"
              :options="vendedores"
            ></b-form-select>
            <div class="error" v-if="!$v.vendedorSelecionado.required">
              Vendedor é Obrigatório.
            </div>
          </b-form-group>

          <b-form-group id="lb3" label="Valor Meta Mensal" label-for="camp3">
            <currency-input
              :Value="metaVendedor.valorMetaMensal"
              v-model="metaVendedor.valorMetaMensal"
              class="form-control"
            />
            <div class="error" v-if="!$v.metaVendedor.valorMetaMensal.required">
              Valor Meta Mensal é Obrigatório.
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
        sticky-header="400px"
        striped
        hover
        bordered
        small
        show-empty
        head-variant="dark"
        table-variant=""
        :items="metasVendedor"
        :fields="fields"
        :filter="filter"
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

        <template #cell(valorMetaMensal)="row">
          <b-form v-model="row.item.valorMetaMensal" disabled>
            {{ formatPrice(row.item.valorMetaMensal) }}
          </b-form>
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
import { required, minLength } from "vuelidate/lib/validators";
import axios from "axios";
// import { baseApiUrl } from "@/global";
import { baseApiUrl } from "../../global";

export default {
  name: "MetasVendedoresMes",
  props: ["metaId", "qtdMetasVendMes"],
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
        { key: "valorMetaMensal", label: "Valor Meta Mensal", sortable: true },
        { key: "actions", label: "Ações" },
      ],
      vendedorSelecionado: null,
      vendedores: [],
      metaVendedor: {
        id: null,
        metaId: null,
        vendedorId: null,
        valorMetaMensal: 0,
      },
      metasVendedor: [],
      filter: null,
      filterOn: [],
      totalRows: 1,
      currentPage: 1,
    };
  },
  validations: {
    metaVendedor: {
      valorMetaMensal: {
        required,
        minLength: minLength(3),
      },
    },
    vendedorSelecionado: { required },
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    abrirModal() {
      this.limparDados();
      this.tituloModal = "Cadastrar";
      this.$bvModal.show("modalCadastro");
    },
    listarVendedores() {
      axios.get(`${baseApiUrl}/vendedores/vendedoresSelect/`).then((res) => {
        this.vendedores = res.data;
      });
    },
    listar() {
      axios
        .get(`${baseApiUrl}/metasVendedorMes/vendedorMetaSelect/${this.metaId}`)
        .then((res) => {
          this.metasVendedor = res.data;
          this.$emit("metasVendedores", this.metasVendedor.length);
        });
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return "R$ " + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    editar(item, index) {
      this.tituloModal = "Alterar";
      this.vendedorSelecionado = item.vendedorId;
      this.metaVendedor = item;
      this.metaVendedor.valorMetaMensal = +item.valorMetaMensal;

      this.$bvModal.show("modalCadastro");
    },
    salvar() {
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
        return;
      }

      const id = this.metaVendedor.id;

      const vendedorSelecionado = this.vendedores.filter(
        (f) => f.value == this.vendedorSelecionado
      )[0];

      const vendedor = `${vendedorSelecionado.text}/${this.formatPrice(
        this.metaVendedor.valorMetaMensal
      )}`;

      const vendedorJaCadastrado = this.metasVendedor.filter(
        (m) => m.vendedorId == this.vendedorSelecionado
      ).length;

      if (id == null) {
        if (vendedorJaCadastrado > 0) {
          this.$bvModal.msgBoxOk(`Já existe (${vendedor}) cadastrado.`, {
            title: "Atenção",
          });
          return;
        }

        const metaVendedor = {
          metaId: this.metaId,
          vendedorId: this.vendedorSelecionado,
          valorMetaMensal: this.metaVendedor.valorMetaMensal,
        };

        axios
          .post(`${baseApiUrl}/metasVendedorMes`, metaVendedor)
          .then((res) => {
            this.listar();
            this.alertaMensagem(`Meta Vendedor (${vendedor}) Adicionado.`);
            return res;
          })
          .catch((error) => {
            this.$bvModal.msgBoxOk(
              `Erro Incluir Meta Vendedor: ${vendedor} ${error}`,
              {
                title: "Atenção",
              }
            );
            return error;
          });
      } else {
        const metaVendedor = {
          valorMetaMensal: this.metaVendedor.valorMetaMensal,
        };

        axios
          .put(`${baseApiUrl}/metasVendedorMes/${id}`, metaVendedor)
          .then((res) => {
            this.listar();

            this.alertaMensagem(`Meta Vendedor (${vendedor}) Alterado.`);
            return res;
          })
          .catch((error) => {
            const erro = error.response.data.message;
            this.$bvModal.msgBoxOk(
              `Erro Alterar Meta Vendedor: ${vendedor} ${erro}`
            );
            this.listar();
          });

        if (!this.existeVendedorSemana(this.metaId, this.vendedorSelecionado))
          this.alterarMetaMensalVendedor(id, vendedor);
      }

      this.limparDados();
      this.$bvModal.hide("modalCadastro");
    },
    excluir(item, index) {
      const metaVendedor = item;
      const descricao = `${metaVendedor.nome} - ${this.formatPrice(
        item.valorMetaMensal
      )}`;

      this.$bvModal
        .msgBoxConfirm(descricao, {
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
            this.excluirVendedorPorSemana(item);

            setTimeout(() => {
              axios
                .delete(
                  `${baseApiUrl}/metasVendedorMes/${item.id}/${this.metaId}/${item.vendedorId}`
                )
                .then((res) => {
                  this.listar();
                  this.alertaMensagem(`Meta Vendedor (${descricao}) Excluido.`);
                  return res;
                })
                .catch((error) => {
                  const erro = error.response.data.message;
                  console.log(error.response.data);
                  this.$bvModal.msgBoxOk(
                    `Erro ao Excluir: (${descricao}) ${erro}`
                  );
                });
            }, 300);
          }
        })
        .catch((err) => {
          const erro = err.response.data.message;
          this.$bvModal.msgBoxOk(
            `Erro excluir valor Meta: ${item.nome} ${erro}`
          );
        });
    },
    excluirVendedorPorSemana(item) {
      axios
        .delete(
          `${baseApiUrl}/metasVendedorSemana/porSemana/${item.metaId}/${item.vendedorId}`
        )
        .then((res) => {
          this.listar();
          this.alertaMensagem(`Meta Vendedor Semana (${item.nome}) Excluido.`);
          return res;
        })
        .catch((error) => {
          const erro = error.response.data.message;
          this.$bvModal.msgBoxOk(`Erro ao Excluir: (${item.nome}) ${erro}`);
        });
    },
    alterarMetaMensalVendedor(id, vendedor) {
      const metaVendedor = {
        valorPrevisto: this.metaVendedor.valorMetaMensal,
      };

      axios
        .patch(
          `${baseApiUrl}/metasVendedorSemana/metaMesVendedor/${this.metaId}/${this.vendedorSelecionado}`,
          metaVendedor
        )
        .then((res) => {
          this.listar();
          this.alertaMensagem(`Meta Vendedor Mensal (${vendedor}) Alterado.`);
          return res;
        })
        .catch((error) => {
          const erro = error.response.data.message;
          this.$bvModal.msgBoxOk(
            `Erro Alterar Meta Vendedor: ${vendedor} ${erro}`
          );
          this.listar();
        });
    },
    existeVendedorSemana(metaId, vendedorId) {
      let qtd = "";
      axios
        .get(
          `${baseApiUrl}/metasVendedorSemana/existeMetaSemana/${metaId}/${vendedorId}`
        )
        .then((res) => {
          const { id } = res.data;
          qtd = id;
          return res;
        })
        .catch((error) => {
          const erro = error.response.data.message;
          this.$bvModal.msgBoxOk(`Meta Vendedor não encontrado: ${erro}`);
        });
      return qtd;
    },
    alertaMensagem(mensagem = "") {
      this.$bvToast.toast(`${mensagem}`, {
        title: "Sucesso",
        variant: "success",
        solid: true,
      });
    },
    limparDados() {
      this.vendedorSelecionado = null;
      this.metaVendedor = {
        id: null,
        metaId: null,
        vendedorId: null,
        valorMetaMensal: 0,
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
.feriados {
  text-align: center;
  margin: 10px;
}
.error {
  color: red;
}
</style>