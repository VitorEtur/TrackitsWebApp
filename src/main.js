/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { registerPlugins } from '@/plugins'
import 'vuetify/dist/vuetify.min.css'

import { createVuetify } from 'vuetify'
import { VDataTable } from 'vuetify/labs/VDataTable'

export default createVuetify({
 components: {
    VDataTable,
 },
})

const app = createApp(App)

// Use os plugins, router e vuetify
app.use(router)
app.use(vuetify)

// Registre outros plugins personalizados
registerPlugins(app)

app.mount('#app')
