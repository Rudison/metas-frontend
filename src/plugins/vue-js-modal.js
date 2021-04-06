import Vue from 'vue'
import VModal from 'vue-js-modal'

Vue.use(VModal, {
  dynamicDefaults: {
    // draggable: true,
    resizable: true,
    height: '90%',
    width: '90%',
    adaptative: true,
    focusTrap: true
  }
})