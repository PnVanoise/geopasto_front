import { createApp } from 'vue';
// import './style.css'
// import './style.scss'
import App from './App.vue';

import router from './router';
import { createPinia } from 'pinia';

// main.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
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