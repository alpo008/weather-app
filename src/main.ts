import './assets/main.css'

import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as labsComponents from 'vuetify/labs/components'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components: {
    ...components,
    ...labsComponents,
  },
	theme: {
    defaultTheme: 'dark'
  },
  directives
});

import App from './App.vue'

const app = createApp(App).use(vuetify).mount('#weatherapp')
