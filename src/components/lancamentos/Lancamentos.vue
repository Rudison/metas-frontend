<template>
  <div>
    <div class="btnback ml-2">
      <b-button-group v-if="!info" vertical>
        <b-button
          size="xl"
          variant="success"
          v-if="inicio"
          v-b-tooltip.hover
          title="Inicio"
          @click="voltarInicio"
        >
          <b-icon icon="house-door" aria-label="Inicio"></b-icon>
        </b-button>

        <b-button
          size="xl"
          variant="primary"
          v-b-modal.modalCadastro
          @click="tituloMeta = 'Nova'"
          v-b-tooltip.hover
          title="Inserir Lançamento"
        >
          <b-icon icon="plus-circle"></b-icon>
        </b-button>
        <b-button
          size="xl"
          variant="outline-info"
          v-b-modal.modalAno
          v-b-tooltip.hover
          title="Filtrar Por Ano"
        >
          <b-icon icon="search"></b-icon>
        </b-button>
      </b-button-group>
    </div>

    <b-modal id="modalAno" size="sm" title="Ano do Lançamento" hide-footer>
      <b-container>
        <b-form>
          <b-form-group id="label1" label="Ano" label-for="campo1">
            <b-form-input id="campo1" v-model.trim="ano"></b-form-input>
          </b-form-group>

          <b-button
            type="submit"
            variant="success"
            class="mr-2"
            @click.prevent="listar"
            >Filtrar</b-button
          >
          <b-button class="mr-2" @click="$bvModal.hide('modalAno')"
            >Fechar</b-button
          >
        </b-form>
      </b-container>
    </b-modal>

    <!-- Lançamentos -->
    <b-modal
      id="modalCadastro"
      :title="`${tituloMeta} Meta`"
      hide-footer
      @hidden="limparDados"
    >
      <b-container fluid>
        <b-form>
          <b-form-group id="label1" label="Mês" label-for="campo1">
            <b-form-select
              v-model="mesSelecionado"
              :options="meses"
            ></b-form-select>
            <div class="error" v-if="!$v.mesSelecionado.required">
              Mês é Obrigatório.
            </div>
          </b-form-group>

          <b-form-group id="label2" label="Ano" label-for="campo1">
            <b-form-input
              type="number"
              id="campo2"
              v-model="$v.meta.ano.$model"
              required
            >
            </b-form-input>
            <div class="error" v-if="!$v.meta.ano.required">
              Ano é Obrigatório.
            </div>
            <div class="error" v-if="!$v.meta.ano.minLength">
              Mínimo {{ $v.meta.ano.$params.minLength.min }} caracteres.
            </div>
            <div class="error" v-if="!$v.meta.ano.maxLength">
              Máximo {{ $v.meta.ano.$params.maxLength.max }} caracteres.
            </div>
          </b-form-group>

          <b-form-group id="lb3" label="Valor Meta Mensal" label-for="camp3">
            <currency-input
              :Value="meta.valorMetaMensa"
              v-model="meta.valorMetaMensal"
              class="form-control"
            />
            <div class="error" v-if="!$v.meta.valorMetaMensal.required">
              Valor Meta Mensal é Obrigatório.
            </div>
          </b-form-group>

          <b-form-group id="lb3" label="Semanas no Mês" label-for="camp4">
            <b-form-input
              id="camp4"
              v-model="$v.meta.semanasNoMes.$model"
              required
            >
            </b-form-input>
            <div class="error" v-if="!$v.meta.semanasNoMes.required">
              Semanas no Mês é Obrigatório.
            </div>
            <div class="error" v-if="!$v.meta.semanasNoMes.maxLength">
              Máximo
              {{ $v.meta.semanasNoMes.$params.maxLength.max }} caracteres.
            </div>
          </b-form-group>

          <b-form-group
            id="lb3"
            label="Dias Úteis no Mês"
            label-for="camp5"
            v-if="meta.id != null"
          >
            <b-form-input
              id="camp5"
              v-model="$v.meta.diasUteisMes.$model"
              required
              readonly
            >
            </b-form-input>
            <div class="error" v-if="!$v.meta.diasUteisMes.required">
              Semanas no Mês é Obrigatório.
            </div>
            <div class="error" v-if="!$v.meta.diasUteisMes.maxLength">
              Máximo
              {{ $v.meta.diasUteisMes.$params.maxLength.max }} caracteres.
            </div>
          </b-form-group>

          <b-button
            type="submit"
            variant="success"
            class="mr-2"
            @click.prevent="salvar"
            >Salvar</b-button
          >
          <b-button class="mr-2" @click="fecharModalCadastro()"
            >Fechar</b-button
          >
        </b-form>
      </b-container>
    </b-modal>

    <div class="menus">
      <b-card
        class="ml-4 mb-3 grow"
        :style="`background-color: #4caf50; width: ${widthCard}; max-width: 20rem`"
        v-for="m in metas"
        :key="m.id"
        no-body
        @click.stop="cardSelecionado(m)"
      >
        <template #header>
          <h4 class="mb-0 tituloMes">{{ m.Mes }}</h4>
        </template>

        <b-list-group flush>
          <b-list-group-item>
            <div class="titulosValores">Valor Mensal</div>
            <strong> {{ formatPrice(m.valorMetaMensal) }} </strong>
            <div class="titulosValores">Valor Realizado</div>
            <strong>
              {{ formatPrice(m.valorMetaRealizadoMensal) }}
            </strong>
          </b-list-group-item>

          <b-list-group-item v-if="info">
            <div class="titulosValores">
              Semanas/Mês :
              <span style="color: #000">{{ m.semanasNoMes }}</span>
            </div>
            <div class="titulosValores">
              Dias Uteis/Mês :
              <span style="color: #000"> {{ m.diasUteisMes }} </span>
            </div>
            <div>
              <b-button-group class="mt-2">
                <b-button
                  size="sm"
                  variant="warning"
                  v-b-tooltip.hover
                  title="Editar Meta"
                  @click.stop="editar(m.id)"
                >
                  <b-icon icon="pencil" aria-label="Inicio"></b-icon>
                </b-button>

                <b-button
                  size="sm"
                  variant="danger"
                  v-b-tooltip.hover
                  title="Excluir Meta"
                  @click.stop="excluir(m.id)"
                >
                  <b-icon icon="trash"></b-icon>
                </b-button>
              </b-button-group>
            </div>
          </b-list-group-item>
        </b-list-group>

        <b-card-footer class="footerCard">
          <!-- <b-icon
            class="mr-2"
            :variant="m.percentual >= 100 ? 'light' : 'danger'"
            :icon="
              m.percentual >= 100 ? 'arrow-up-circle' : 'arrow-down-circle'
            "
          ></b-icon> -->
          <div class="rodape">
            <b-iconstack font-scale="1.5" animation="fade">
              <b-icon
                stacked
                :icon="
                  m.percentual >= 100 ? 'arrow-up-circle' : 'arrow-down-circle'
                "
                :variant="m.percentual >= 100 ? 'success' : 'danger'"
                scale="0.75"
                shift-v="-0.25"
              ></b-icon>
            </b-iconstack>
            {{ m.percentual }}%
            <b-button
              variant="outline-light"
              class="ml-2"
              size="sm"
              v-b-tooltip.hover
              title="Detalhes"
              @click.prevent.stop="abrirInfo"
            >
              <b-icon
                :variant="!info ? 'outline-info' : 'outline-success'"
                :icon="!info ? 'info-circle' : 'house-door'"
              ></b-icon>
            </b-button>
          </div>
        </b-card-footer>
      </b-card>
    </div>
  </div>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import axios from "axios";
// import { baseApiUrl } from "@/global";
import { baseApiUrl } from "../../global";

export default {
  name: "Lancamentos",
  mounted() {
    this.listar();
    this.getMeses();
  },
  data() {
    return {
      tituloMeta: "Nova",
      ano: new Date().getFullYear(),
      inicio: true,
      mesSelecionado: null,
      meses: [{ value: null, text: "Selecione o Mês" }],
      metas: [],
      widthCard: "200px",
      meta: {
        id: null,
        mesId: 0,
        ano: 2021,
        valorMetaMensal: 0,
        valorMetaRealizadoMensal: 0,
        percentual: 0,
        semanasNoMes: 0,
        diasUteisMes: 0,
      },
      info: false,
    };
  },
  validations: {
    mesSelecionado: {
      required,
    },
    meta: {
      mesId: {
        required,
      },
      ano: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(4),
      },
      valorMetaMensal: { required },
      semanasNoMes: {
        required,
        maxLength: maxLength(1),
      },
      diasUteisMes: { required, maxLength: maxLength(2) },
    },
  },
  methods: {
    voltarInicio() {
      this.$router.push("/");
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return "R$ " + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    cardSelecionado(meta) {
      this.$router.push({
        name: "metas",
        path: `/metas/${meta.id}`,
        params: {
          metaId: meta.id.toString(),
          meta: meta,
        },
      });
    },
    editar(id) {
      this.tituloMeta = "Editar";
      this.$bvModal.show("modalCadastro");

      axios.get(`${baseApiUrl}/metas/${id}`).then((res) => {
        this.mesSelecionado = res.data.mesId;
        this.id = res.data.id;
        this.meta = res.data;
        this.meta.valorMetaMensal = +res.data.valorMetaMensal;
      });
    },
    listar() {
      axios
        .get(`${baseApiUrl}/metas/porAno/${this.ano}`)
        .then((res) => {
          this.metas = res.data;
        })
        .catch((error) => {
          console.log(error);
        });

      this.$bvModal.hide("modalAno");
    },
    salvar() {
      const id = this.meta.id;

      const meta = {
        mesId: this.mesSelecionado,
        ano: this.meta.ano,
        valorMetaMensal: this.meta.valorMetaMensal,
        semanasNoMes: this.meta.semanasNoMes,
      };

      const mesSelecionado = this.meses[this.mesSelecionado - 1];
      const Mes = `${mesSelecionado.text}/${meta.ano}`;

      if (id == null) {
        axios
          .post(`${baseApiUrl}/metas/`, meta)
          .then((res) => {
            this.listar();
            this.fecharModalCadastro();
            this.alertaMensagem(`Meta (${Mes}) Adicionada.`);
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
            this.alertaMensagem(`Meta (${Mes}) Alterado.`);
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
      const meta = this.metas.filter((m) => m.id == id)[0];

      this.$bvModal
        .msgBoxConfirm(`Meta: ${meta.Mes}`, {
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
            this.excluirMetaVendSemana(id, meta.Mes);
            this.excluirMetasSemana(id, meta.Mes);
            this.excluirMetasVendedorMes(id, meta.Mes);
            setTimeout(() => {
              this.excluirMeta(id, meta.Mes);
            }, 500);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$bvModal.msgBoxOk(`Erro excluir Meta: ${meta.Mes} ${err}`);
        });
    },
    getMeses() {
      axios
        .get(`${baseApiUrl}/meses/`)
        .then((res) => {
          this.meses = res.data;
        })
        .catch((error) => {
          console.log(error);
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
    alertaMensagem(mensagem = "") {
      this.$bvToast.toast(`${mensagem}`, {
        title: "Sucesso",
        variant: "success",
        solid: true,
      });
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
    excluirMeta(metaId, mes) {
      axios
        .delete(`${baseApiUrl}/metas/${metaId}`)
        .then((res) => {
          this.listar();
          this.alertaMensagem(`Meta (${mes}) Excluido.`);
          return res;
        })
        .catch((error) => {
          const erro = error.response.data.message;
          console.log(erro);
        });
    },
    excluirMetaVendSemana(metaId, mes) {
      axios
        .delete(`${baseApiUrl}/metasVendedorSemana/vendedorSemana/${metaId}`)
        .then((res) => {
          this.listar();
          this.alertaMensagem(`Metas Vendedor Semana (${mes}) Excluido.`);
          return res;
        })
        .catch((error) => {
          const erro = error.response.data.message;
          console.log(erro);
        });
    },
    excluirMetasSemana(metaId, mes) {
      axios
        .delete(`${baseApiUrl}/metasSemana/semanas/${metaId}`)
        .then((res) => {
          this.listar();
          this.alertaMensagem(`Metas Semana (${mes}) Excluido.`);
          return res;
        })
        .catch((error) => {
          const erro = error.response.data.message;
          console.log(erro);
        });
    },
    excluirMetasVendedorMes(metaId, mes) {
      axios
        .delete(`${baseApiUrl}/metasVendedorMes/metasMes/${metaId}`)
        .then((res) => {
          this.listar();
          this.alertaMensagem(`Metas Vendedor Mês (${mes}) Excluido.`);
          return res;
        })
        .catch((error) => {
          const erro = error.response.data.message;
          console.log(erro);
        });
    },
  },
};
</script>

<style scoped>
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
  align-content: center;
  justify-content: center;
  grid-template-columns: repeat(6, 15%);
  flex-direction: row;
  flex-wrap: wrap;
}
.card {
  cursor: pointer;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.25);
}
.grow {
  transition: all 0.2s ease-in-out;
}
.grow:hover {
  z-index: 1;
  transform: scale(1.1);
}
.footerCard {
  color: #fff;
  font-size: 1.3rem;
  font-weight: bold;
}
.rodape {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>