import { createApp } from 'vue'
import App from './App.vue'
import YmapPlugin from 'vue-yandex-maps';

const app = createApp(App);

const settings = {
  apiKey: '186f0adf-8b02-43df-a8ae-8c25e6a58865',
  lang: 'ru_RU',
  enterprise: false,
  version: '2.1',
};

app.use(YmapPlugin, settings);
app.mount("#app");
