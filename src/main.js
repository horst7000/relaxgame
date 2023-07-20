import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import VueKonva from 'vue-konva';


createApp(App).use(createPinia()).use(router).use(VueKonva).mount('#app')