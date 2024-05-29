<script setup>
import axios from 'axios'
import { useRoomStore } from '../store/room'

const store = useRoomStore()

const props = defineProps({
  gameStarted: {
    type: Boolean,
    required: true
  },
  spectatorsCount: {
    type: Number,
    required: true
  },
  currentMember: {
    type: Object,
    required: false
  }
})

function exitGame() {
  let exit = confirm('Are you sure you want to exit?')
  if (exit) {
    window.location.href = import.meta.env.BASE_URL
  }
}

function restartGame() {
  let restart = confirm('Are you sure you want to restart?')
  if (restart) {
    axios.post(`/room/${store.roomCode}/restart?userId=${store.userId}`).then(() => {
      console.log(`Player ${store.userId} restarted the game`)
    })
  }
}
</script>

<template>
  <div class="room-panel">
    <span @click="exitGame" class="room-panel__item">Выход</span>
    <span
      v-if="props.gameStarted && props.currentMember?.admin"
      @click="restartGame"
      class="room-panel__item"
    >
      Перезапуск
    </span>
    <span class="room_panel__divider"></span>
    <span class="room-panel__item is-right">Наблюдатели: {{ props.spectatorsCount }}</span>
  </div>
</template>

<style scoped>
.room-panel {
  position: fixed;
  top: 0;
  left: 0;
  padding: 2px 16px;
  width: 100%;
  font-size: 1rem;
  color: var(--main-app-text-color);
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  background-color: var(--dark-app-color);
  z-index: 10;
}
.room-panel__item {
  margin: 0 12px;
  cursor: pointer;
}
.room-panel__item:first-child {
  margin-left: 0;
}
.room-panel__item:last-child {
  margin-right: 0;
}
.room-panel__item:hover {
  color: var(--main-app-color);
}
.room-panel__item.is-right {
  text-align: right;
}
.room_panel__divider {
  flex-grow: 1;
}
</style>
