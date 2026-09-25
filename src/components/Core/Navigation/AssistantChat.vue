<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import loadingDots from '@/components/Core/Utils/loadingDots.vue'

const display = ref(false)

const chat = ref([])
const chatBody = ref(null)

// const options = ref([{label:'sim'}, {label:'não'}]);
const options = ref(false)

const addMessage = (text) => {
  chat.value.push({
    row: 'userRow ma-0 d-flex flex-row-reverse',
    bg: 'userBg',
    text: text
  })
  scrollToBottom()
}

const assistantResonse = (response) => {
  response.forEach((element) => {
    if (element.response_type == 'text') {
      chat.value.push({
        row: 'assistantRow ma-0 d-flex flex-row',
        bg: 'assistantBg',
        text: element.text
      })

      options.value = false
    }
    if (element.response_type == 'option') {
      options.value = element.options
    }
    if (element.response_type == 'suggestion') {
      chat.value.push({
        row: 'assistantRow ma-0 d-flex flex-row',
        bg: 'assistantBg',
        text: element.title
      })
      options.value = element.suggestions
    }
    scrollToBottom()
  })
}

const loading = ref(false)
const form = ref({
  comment: '',
  option: ''
})

const scrollToBottom = async () => {
  await nextTick()
  if (chatBody.value) {
    chatBody.value.scrollTo({
      top: chatBody.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

const submit = () => {
  loading.value = true
  addMessage(form.value.comment)

  axios
    .post('/api/addon/assistant/chat', { comment: form.value.comment })
    .then((response) => {
      assistantResonse(response.data.output.generic)
      loading.value = false
      form.value.comment = null
    })
    .catch((error) => {
      console.error('Erro ao enviar mensagem:', error)
      loading.value = false
    })

  form.comment = null
}

watch(
  () => form.value.option,
  (newValue) => {
    form.value.comment = newValue

    if (form.value.option) {
      submit()

      setTimeout(function () {
        form.value.option = ''
      }, 1000)
    }
  }
)

onMounted(() => {
  // Adicionando um event listener para clicar fora do elemento v-card-text
  document.addEventListener('click', handleClickOutside)
})

// Função para lidar com cliques fora do elemento v-card-text
function handleClickOutside(event) {
  const cardText = document.querySelector('.dontClose')
  if (cardText && !cardText.contains(event.target) && form.option == '') {
    display.value = false
  }
}
</script>

<template>
  <div class="dontClose">
    <v-card class="rounded-b-0 saraChat bg-deep-orange-darken-4 mr-2" elevation="2">
      <v-card-text v-if="display" class="px-1 pt-1 pb-0 sharaBody">
        <!-- <ul ref="chatBody" class="chat rounded-sm py-2 px-1 bg-background" >
        <li :class="n.row" v-for="n in chat" :key="n">
          <v-card elevation="2" :class="n.bg">
                <v-card-text class="pa-1">
                  {{ n.text }}
                </v-card-text>
              </v-card>
        </li>
      </ul> -->
        <div ref="chatBody" class="chat rounded-sm py-2 px-1 overflow-auto bg-background">
          {{ form.option }}
          <div v-for="n in chat" :key="n">
            <v-row :class="n.row">
              <v-card elevation="2" :class="n.bg" class="text-brand_cinza1">
                <v-card-text class="pa-1">
                  {{ n.text }}
                </v-card-text>
              </v-card>
            </v-row>
          </div>
          <loadingDots v-if="loading" />
        </div>
      </v-card-text>
      <v-card-actions v-if="display" class="sharaBody pt-0 px-1">
        <v-text-field
          autofocus
          v-if="!options"
          :readonly="loading"
          v-model="form.comment"
          bg-color="brand_silver"
          density="compact"
          color="brand_silver"
          hide-details=""
          variant="outlined"
          @keyup.enter="submit()"
        />
        <v-autocomplete
          v-else
          v-model="form.option"
          autofocus
          :readonly="loading"
          class="dontClose"
          :items="options"
          bg-color="brand_silver"
          density="compact"
          color="brand_silver"
          variant="outlined"
          hide-details=""
          item-value="label"
          item-title="label"
        />
      </v-card-actions>
      <v-btn
        color="deep-orange-darken-4"
        class="assistantTitle text-center pa-0 mt-n1 text-subtitle-1 rounded-0"
        @click="display = !display"
      >
        <template v-slot:prepend>
          <v-avatar size="27">
            <v-img src="/assets/avatar/assistant.jpg"></v-img>
          </v-avatar>
        </template>
        Assistente
      </v-btn>
    </v-card>
  </div>
</template>
<style scoped>
.userRow {
  padding: 8px 0 0 16px !important;
}

.assistantRow {
  padding: 8px 16px 0 0 !important;
}

.userBg {
  float: right !important;
  background: #b9f6ca !important;
}
.assistantBg {
  background: #c3c5c4 !important;
}

.saraChat {
  width: 270px;
  background-color: #692fae !important;

  position: absolute;
  bottom: 0;
  right: 0;
  /* top: 0px; */
  z-index: 1006;
  /* border-left: 1px solid silver; */
}

::v-deep(.v-field__input) {
  padding: 7px !important;
}

.assistantTitle {
  width: 270px;
  height: 40px;
  background-color: #692fae !important;
  /* background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  ); */
}

.chat {
  height: 300px;
  overflow: auto;
  background-color: #ececec !important;
  /* background-color: #f5f4f4; */
}
.sharaBody {
  background-color: #692fae !important;
  padding-bottom: 0 !important;
  /* margin-bottom: 610px; */
}
</style>
