<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRoomStore } from '../store/room'

import RoomPanel from './RoomPanel.vue'

const store = useRoomStore()

const props = defineProps({
  wsToken: {
    type: String,
    required: true
  },
  gameStartedProp: {
    type: Boolean,
    required: true
  },
  settingsComp: {
    type: Object,
    required: false
  },
  rulesLink: {
    type: String,
    required: false
  },
  rulesComponent: {
    type: Object,
    required: false
  },
})

// Свойства комнаты
const gameStarted = ref(props.gameStartedProp)

const spectatorsCount = ref(0)
const members = ref([])

const currentMember = computed(() => members.value.find((el) => el.nickname === store.nickname))

// Данные для новой игры
const newGameData = ref(null)

function changeMemberPlayerStatus(status) {
  axios.post(`/room/${store.roomCode}/${store.userId}/player?newStatus=${status}`).then(() => {
    console.log(`${store.userId} is player now`)
  })
}

function changeMemberReadyStatus(status) {
  axios.post(`/room/${store.roomCode}/${store.userId}/ready?newStatus=${status}`).then(() => {
    console.log(`Player ${store.userId} is ready now`)
  })
}

function startGame(force) {
  axios
    .post(`/room/${store.roomCode}/start?userId=${store.userId}&forceStart=${force}`)
    .then(() => {
      console.log(`Player ${store.userId} started the game`)
    })
}

function updateMembers(data) {
  spectatorsCount.value = data.spectatorsCount
  members.value = []
  data.members.forEach((el) => members.value.push(el))
}

store.addWsEventHandler('UPDATE_MEMBERS', updateMembers)
store.addWsEventHandler('START_GAME', (data) => {
  newGameData.value = data
  gameStarted.value = true
})
store.addWsEventHandler('RESTART_GAME', () => {
  gameStarted.value = false
  newGameData.value = null
})
store.connectToWs(props.wsToken)
</script>

<template>
  <div class="room-container">
    <RoomPanel
      :settingsComp="settingsComp"
      :rulesLink="rulesLink"
      :rulesComponent="rulesComponent"
      :gameStarted="gameStarted"
      :spectatorsCount="spectatorsCount"
      :currentMember="currentMember"
    />
    <slot
      :members="members"
      :gameStarted="gameStarted"
      :currentMember="currentMember"
      :changeReadyStatus="changeMemberReadyStatus"
      :changePlayerStatus="changeMemberPlayerStatus"
      :startGame="startGame"
      :newGameData="newGameData"
    >
    </slot>
  </div>
</template>

<style scoped>
.room-container {
  position: relative;
  padding: 48px 20px 20px 20px;
  display: flex;
  flex-direction: row;
  height: 100%;
  min-height: 100vh;
  color: var(--main-app-text-color);
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
@media only screen and (max-width: 1024px) {
  .room-container {
    flex-direction: column;
    height: auto;
  }
}
</style>
