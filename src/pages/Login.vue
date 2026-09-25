<script setup>
  import { ref, onMounted } from 'vue'
  import { authStore, notifyStore } from '@/store'

  const auth = authStore()
  const notify = notifyStore()

  const valid = ref(false)
  const passwordHide = ref(false)
  const snackbar = ref(true)

  const form = ref({
    username: null,
    password: null,
    remember: false
  })

  const submit = async () => {
    await auth.login(form.value)
  }

  onMounted(() => {
    auth.isSessionActive()
  })
</script>

<template>
  <v-snackbar v-model="snackbar" position="absolute" class="snackbar pa-0" color="info">
    <v-list lines="one" class="bg-transparent pa-1 text-subtitle-1">
      <v-icon icon="mdi-information-variant-circle-outline" />
      Atenção!
    </v-list>
    <v-list lines="one" class="bg-transparent pa-1">
      Para autenticar com matrícula corporativa (usr) use a senha do IdP corporativo
    </v-list>
    <v-list lines="one" class="bg-transparent pa-1">
      Para autenticar com matrícula externa (ext) use a senha de rede + OTP
    </v-list>
  </v-snackbar>
  <v-row class="ma-0 pa-0">
    <v-img src="/assets/img/logo-placeholder.svg" height="70" class="logo_brand" />
    <v-col class="pa-0">
      <v-sheet
        height="100vh"
        class="d-flex logo align-center justify-center pa-0 text-h1 text-white font-weight-bold"
      >
        <img src="/assets/img/Ahtlas.svg" class="svg" width="300" alt="" />
        <!-- Ahtlas -->
      </v-sheet>
    </v-col>

    <v-col class="pa-0">
      <v-sheet color="brand_silver" class="d-flex align-center justify-space-evenly" height="100vh">
        <v-sheet color="brand_silver" width="300" class="mx-auto">
          <div>
            <v-form v-model="valid" @submit.prevent="submit()">
              <v-text-field
                v-model="form.username"
                color="brand_roxo2"
                density="compact"
                :counter="10"
                class="mb-2"
                autocomplete="username"
                prepend-inner-icon="mdi-account"
                label="Usuário"
                variant="underlined"
                :error-messages="notify?.errors?.username"
                required
                hint="Matricula com letras e números"
              ></v-text-field>
              <v-text-field
                v-model="form.password"
                color="brand_roxo2"
                density="compact"
                variant="underlined"
                label="Senha"
                required
                autocomplete="current-password"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="passwordHide ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="passwordHide = !passwordHide"
                :type="passwordHide ? 'text' : 'password'"
                hint="Senha de rede + OTP"
                :error-messages="notify?.errors?.password"
              ></v-text-field>
              <!-- <v-checkbox
                v-model="form.remember"
                density="compact"
                label="Lembrar sessão"
                hide-details
              /> -->
              <v-btn
                :loading="auth.loading"
                variant="outlined"
                color="brand_roxo2"
                type="submit"
                block
                class="mt-2 brand_roxo2--text"
                text="Entrar"
              ></v-btn>
            </v-form>
          </div>
          <div v-if="form?.errors?.auth" class="mt-4 font-medium text-center text-sm text-error">
            {{ form?.errors?.auth }}
          </div>
        </v-sheet>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<style scoped>
  .logo {
    background: linear-gradient(153.69deg, #692fae 40.49%, #467aa5 61.98%, #467aa5 100%);
  }

  .logo_brand {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 999;
  }
  :deep(.v-overlay__content) {
    top: 5px !important;
    padding: 0 !important;
  }
</style>
