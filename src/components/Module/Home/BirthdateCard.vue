<template>
  <div class="container">
    <v-sheet class="text-center w-100 text-h1 bg-transparent">Aniversariantes do mês!</v-sheet>

    <canvas ref="canvas" id="birthday" class="fireworks-canvas" />
    <v-row class="ma-0 d-flex justify-space-around card-row" style="margin: 0 auto !important">
      <v-card
        v-for="(item, index) in module?.data?.birthdate_on_month"
        :key="item.username"
        class="card mx-auto pa-0 rounded-pill align-self-center"
        width="270"
        height="55"
      >
        <div>
          <div style="width: 55px; float: left">
            <v-avatar size="55px">
              <img :src="'data:image/jpeg;base64,' + item?.avatar?.avatar" width="55" alt="" />
            </v-avatar>
          </div>
          <div style="width: 200px; float: left" class="py-2">
            <v-card-subtitle class="py-0 px-2">
              {{ item?.name }}
            </v-card-subtitle>
            <v-card-subtitle class="py-0 px-2">
              Aniversário: {{ item?.birthdate?.substr(5) }}
            </v-card-subtitle>
          </div>
        </div>
      </v-card>
    </v-row>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { moduleStore } from '@/store'

  // Helper functions
  const PI2 = Math.PI * 2
  const random = (min, max) => (Math.random() * (max - min + 1) + min) | 0
  const timestamp = () => new Date().getTime()

  // Store
  const module = moduleStore()

  // Canvas reference
  const canvas = ref(null)
  let ctx = null
  let birthday = null
  let then = timestamp()
  let animationFrameId = null

  // Firework class
  class Firework {
    constructor(x, y, targetX, targetY, shade, offsprings) {
      this.dead = false
      this.offsprings = offsprings
      this.x = x
      this.y = y
      this.targetX = targetX
      this.targetY = targetY
      this.shade = shade
      this.history = []
    }

    update(delta) {
      if (this.dead) return

      let xDiff = this.targetX - this.x
      let yDiff = this.targetY - this.y
      if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
        this.x += xDiff * 2 * delta
        this.y += yDiff * 2 * delta

        this.history.push({ x: this.x, y: this.y })
        if (this.history.length > 20) this.history.shift()
      } else {
        if (this.offsprings && !this.madeChilds) {
          let babies = this.offsprings / 2
          for (let i = 0; i < babies; i++) {
            let targetX = (this.x + this.offsprings * Math.cos((PI2 * i) / babies)) | 0
            let targetY = (this.y + this.offsprings * Math.sin((PI2 * i) / babies)) | 0
            birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0))
          }
        }
        this.madeChilds = true
        this.history.shift()
      }

      if (this.history.length === 0) this.dead = true
      else if (this.offsprings) {
        for (let i = 0; this.history.length > i; i++) {
          let point = this.history[i]
          ctx.beginPath()
          ctx.fillStyle = `hsl(${this.shade},100%,${i}%)`
          ctx.arc(point.x, point.y, 1, 0, PI2, false)
          ctx.fill()
        }
      } else {
        ctx.beginPath()
        ctx.fillStyle = `hsl(${this.shade},100%,50%)`
        ctx.arc(this.x, this.y, 1, 0, PI2, false)
        ctx.fill()
      }
    }
  }

  // Birthday class
  class Birthday {
    constructor() {
      this.fireworks = []
      this.counter = 0
      this.resize()
    }

    resize() {
      this.width = canvas.value.width = window.innerWidth
      let center = (this.width / 2) | 0
      this.spawnA = (center - center / 4) | 0
      this.spawnB = (center + center / 4) | 0
      this.height = canvas.value.height = window.innerHeight
      this.spawnC = this.height * 0.1
      this.spawnD = this.height * 0.5
    }

    onClick(evt) {
      let x = evt.clientX || (evt.touches && evt.touches[0].pageX)
      let y = evt.clientY || (evt.touches && evt.touches[0].pageY)
      let count = random(3, 5)
      for (let i = 0; i < count; i++) {
        this.fireworks.push(
          new Firework(
            random(this.spawnA, this.spawnB),
            this.height,
            x,
            y,
            random(0, 260),
            random(30, 110)
          )
        )
      }
      this.counter = -1
    }

    update(delta) {
      ctx.globalCompositeOperation = 'hard-light'
      // Clear the canvas for transparency instead of filling with black
      ctx.clearRect(0, 0, this.width, this.height)

      ctx.globalCompositeOperation = 'lighter'
      for (let firework of this.fireworks) firework.update(delta)

      this.counter += delta * 3
      if (this.counter >= 1) {
        this.fireworks.push(
          new Firework(
            random(this.spawnA, this.spawnB),
            this.height,
            random(0, this.width),
            random(this.spawnC, this.spawnD),
            random(0, 360),
            random(30, 110)
          )
        )
        this.counter = 0
      }

      if (this.fireworks.length > 1000) {
        this.fireworks = this.fireworks.filter((firework) => !firework.dead)
      }
    }
  }

  // Animation loop
  const loop = () => {
    animationFrameId = requestAnimationFrame(loop)
    let now = timestamp()
    let delta = now - then
    then = now
    birthday.update(delta / 1000)
  }

  // Fetch birthdate data
  const getBirthdateOnMonth = async () => {
    await module.getDataPart('api/people/employee/birthdate-on-month', ['birthdate_on_month'])
  }

  // Lifecycle hooks
  onMounted(() => {
    // Initialize canvas
    ctx = canvas.value.getContext('2d')
    birthday = new Birthday()

    // // Event listeners
    // window.addEventListener('resize', () => birthday.resize())
    // canvas.value.addEventListener('click', (evt) => birthday.onClick(evt))
    // canvas.value.addEventListener('touchstart', (evt) => birthday.onClick(evt))

    // Start animation
    loop()

    // Fetch birthdate data
    getBirthdateOnMonth()
  })

  onUnmounted(() => {
    // Cleanup
    // window.removeEventListener('resize', () => birthday.resize())
    // canvas.value.removeEventListener('click', (evt) => birthday.onClick(evt))
    // canvas.value.removeEventListener('touchstart', (evt) => birthday.onClick(evt))
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  })
</script>

<style scoped>
  .container {
    position: relative;
    width: 100%;
    height: 100vh;
  }

  .fireworks-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .card-row {
    position: absolute;
    width: 100% !important;
    height: calc(100% - 200px);
    z-index: 2;
    padding: 10px 0;
    bottom: 0;
  }
</style>
