import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrash, faEye, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(faEdit, faTrash, faEye, faSearch, faPlus);

export default {
  components: {
    FontAwesomeIcon
  }
};

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');