import Vue from 'vue'
import VModal from 'vue-js-modal'

Vue.use(VModal, {
  dynamicDefaults: {
    // draggable: true,
    resizable: true,
    height: '95%',
    width: '95%',
    adaptative: true,
    focusTrap: true,
  },
})
