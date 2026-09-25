<template>
  <div>
    <button @click="notifyUser">Enviar Notificação</button>
  </div>
</template>

<script setup>
const { title, body, icon, link } = defineProps({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    required: false // Link é opcional
  }
})

const notifyUser = async () => {
  if (!('Notification' in window)) {
    alert('Este navegador não suporta notificações na área de trabalho.')

    return
  }

  if (Notification.permission === 'default') {
    await Notification.requestPermission()
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon
    })

    // Adicionar evento de clique na notificação
    notification.onclick = () => {
      if (link) {
        window.open(link, '_blank') // Abre o link em uma nova aba
      }
    }
  } else {
    alert('Você precisa habilitar notificações para este site.')
  }
}
</script>
