import { createApp } from 'vue'


import App from './App.vue'
import router from './router'
import store from './store';

import ArcoVueIcon from '@arco-design/web-vue/es/icon';

import 'flex.css';
import '@/assets/style/global.less';
import 'hover.css';

const app = createApp(App)

app.use(router)
app.use(store)

app.use(ArcoVueIcon);

app.mount('#app')
