<template>
  <div>
    <b-container fluid>
      <b-form>
        <b-form-group id="label1" label="Semana" label-for="campo1">
          <b-form-select
            :disabled="metaSemana.id != null"
            v-model="semanaSelecionada"
            :options="semanas"
          ></b-form-select>
          <div class="error" v-if="!$v.semanaSelecionada.required">
            Semana é Obrigatório.
          </div>
        </b-form-group>

        <b-form-group label="Data Inicial" label-for="inputDtIni">
          <b-form-datepicker
            id="inputDtIni"
            locale="pt-BR"
            format="DD-MM-YYYY HH:MM"
            today-button
            reset-button
            placeholder="Data Inicial"
            v-model="$v.metaSemana.dataInicial.$model"
          ></b-form-datepicker>
          <div class="error" v-if="!$v.metaSemana.dataInicial.required">
            Data Inicial é Obrigatório.
          </div>
        </b-form-group>

        <b-form-group label="Data Final" label-for="inputDtFinal">
          <b-form-datepicker
            id="inputDtFinal"
            locale="pt-BR"
            format="DD-MM-YYYY HH:MM"
            today-button
            reset-button
            placeholder="Data Inicial"
            v-model="$v.metaSemana.dataFinal.$model"
          ></b-form-datepicker>
          <div class="error" v-if="!$v.metaSemana.dataFinal.required">
            Data Final é Obrigatório.
          </div>
        </b-form-group>

        <b-form-group label="Incluir Feriado Semana?" label-for="inputDtFinal">
          <b-form-checkbox
            id="checkFeriado"
            v-model="incluirFeriadoSemana"
          ></b-form-checkbox>
        </b-form-group>

        <b-form-group label="Dias Adicionais Semana" label-for="diasAdd">
          <b-form-input
            id="diasAdd"
            v-model="metaSemana.diasAdicionais"
          ></b-form-input>
        </b-form-group>

        <b-button
          type="submit"
          variant="success"
          class="mr-2"
          @click.prevent="salvar"
          >Salvar</b-button
        >
        <b-button class="mr-2" @click="fecharModalSem()">Fechar</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import axios from "axios";
import { baseApiUrl } from "@/global";

export default {
  name: "MetasSemana",
  props: {
    metaId: { type: String },
    fecharModalSem: Function,
  },
  mounted() {
    this.listarSemanas();
  },
  data() {
    return {
      tituloModal: "Cadastrar",
      semanaSelecionada: null,
      semanas: [],
      incluirFeriadoSemana: false,
      submitStatus: "SUCCESS",
      metaSemana: {
        id: null,
        metaId: null,
        semanaId: null,
        dataInicial: null,
        dataFinal: null,
        diasUteisSemana: null,
        diasAdicionais: 0,
      },
    };
  },
  validations: {
    metaSemana: {
      semanaId: { required },
      dataInicial: { required },
      dataFinal: { required },
    },
    semanaSelecionada: { required },
  },
  methods: {
    listarSemanas() {
      axios.get(`${baseApiUrl}/semanas/`).then((res) => {
        this.semanas = res.data;
      });
    },
    salvar() {
      if (!this.$v.$invalid) {
        this.submitStatus = "ERROR";
        return;
      }

      if (this.metaSemana.dataInicial > this.metaSemana.dataFinal) {
        this.$bvModal.msgBoxOk("Data Inicial Menor que Final", {
          title: "Atenção",
        });
        return;
      }

      const id = this.metaSemana.id;

      const metaSemana = {
        metaId: this.metaId,
        semanaId: this.semanaSelecionada,
        dataInicial: this.metaSemana.dataInicial,
        dataFinal: this.metaSemana.dataFinal,
        diasAdicionais: this.metaSemana.diasAdicionais,
        incluirFeriadoSemana: this.incluirFeriadoSemana,
      };

      if (id == null) {
        axios
          .post(`${baseApiUrl}/metasSemana`, metaSemana)
          .then((res) => {
            this.listar();
            return res;
          })
          .catch((error) => {
            this.$bvModal.msgBoxOk(`Erro Incluir Meta Semana: ${error}`, {
              title: "Atenção",
            });
            return error;
          });
      }

      this.limparDados();
      this.$bvModal.hide("modalCadastro");
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
  },
};
</script>

<style scoped>
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