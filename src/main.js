/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
// import { VDataTable } from 'vuetify/lib/labs/components.mjs'


const app = createApp(App)

registerPlugins(app)

app.mount('#app')

// app.use(VDataTable)
app.use(Vuetify)
