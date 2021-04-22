import Vue from 'vue'
import VueCurrencyInput from 'vue-currency-input'

const pluginOptions = {
  globalOptions: { currency: 'BRL' },
}
Vue.use(VueCurrencyInput, pluginOptions)
