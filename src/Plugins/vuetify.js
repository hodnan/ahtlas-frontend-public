// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

import { md2 } from 'vuetify/blueprints'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const light = {
  dark: false,
  colors: {
    app: '#153376',
    footer: '#153376',
    background: '#ededed',
    background2: '#FFFFFF',
    background_error500: '#64B5F6',
    dialog: '#FFFFFF',
    primary: '#385db0',
    accent: '#1976D2',
    secondary: '#FF8F00',
    info: '#26A69A',
    warning: '#FFC107',
    error: '#DD2C00',
    success: '#16b530',
    disabled: '#d6d6d6',
    imput_border: '#aaaaaa',
    brand_txt: '#858585',
    brand_roxo1: '#692fae',
    brand_roxo2: '#5d48ab',
    brand_azul1: '#5261ab',
    brand_azul2: '#467aa5',
    brand_verde1: '#2fac9e',
    brand_verde2: '#3b93a2',
    brand_verde_dark: '#08544c',
    brand_rosa: '#f24d99',
    brand_laranja: '#ff6600',
    brand_amarelo: '#ffc800',
    brand_preto: '#000000',
    brand_cinza1: '#262626',
    brand_cinza2: '#404040',
    brand_cinza3: '#737373',
    brand_cinza4: '#8c8c8c',
    brand_cinza5: '#a6a6a6',
    brand_cinza6: '#bfbfbf',
    brand_silver: '#ededed',
    brand_dark: '#161617'
  }
}

const dark = {
  dark: true,
  colors: {
    app: '#212121',
    footer: '#212121',
    background: '#424242',
    background2: '#212121',
    background_error500: '#424242',
    dialog: '#424242',
    // primary: '#9db8f2',
    primary: '#385db0',
    accent: '#1976D2',
    secondary: '#FF8F00',
    info: '#26A69A',
    warning: '#FFC107',
    error: '#DD2C00',
    success: '#16b530',
    disabled: '#363636',
    imput_border: '#aaaaaa',
    brand_txt: '#ededed',
    brand_roxo1: '#692fae',
    brand_roxo2: '#5d48ab',
    brand_azul1: '#5261ab',
    brand_azul2: '#467aa5',
    brand_verde1: '#2fac9e',
    brand_verde2: '#3b93a2',
    brand_verde_dark: '#08544c',
    brand_rosa: '#f24d99',
    brand_laranja: '#ff6600',
    brand_amarelo: '#ffc800',
    brand_preto: '#000000',
    brand_cinza1: '#262626',
    brand_cinza2: '#404040',
    brand_cinza3: '#737373',
    brand_cinza4: '#8c8c8c',
    brand_cinza5: '#a6a6a6',
    brand_cinza6: '#bfbfbf',
    brand_silver: '#ededed',
    brand_dark: '#161617'
  }
}

const vuetify = createVuetify({
  components,
  directives,
  blueprint: md2,
  icons: {
    defaultSet: 'mdi'
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light,
      dark
    },
    styles: { configFile: '../assets/scss/settings.scss' }
  }
})

export default vuetify
