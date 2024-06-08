<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRoomStore } from '../store/room'

import CommonModal from './CommonModal.vue'

const store = useRoomStore()

const props = defineProps({
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

let rulesHref
if (props.rulesLink) {
  let link = props.rulesLink
  if (link.startsWith('/')) {
    link = link.substring(1)
  }
  rulesHref = env.VGR_BASE + link
}

const icons = import.meta.glob(`../assets/*-icon.svg`, { import: 'default', query: '?raw', eager: true })
function icon(name) {
  return icons[`../assets/${name}-icon.svg`]
}

function exitGame() {
  let exit = confirm('Are you sure you want to exit?')
  if (exit) {
    window.location.href = env.VGR_BASE
  }
}

const isSettingsShow = ref(false)
function showSettings() {
  isSettingsShow.value = true
}
function updateSettings() {
  if (!store.gameSettings) {
    return
  }
  let msg = {
    event: 'UPDATE_SETTINGS',
    data: {
      code: store.roomCode,
      settings: store.gameSettings,
    }
  }
  store.webSocket.send(JSON.stringify(msg))
  isSettingsShow.value = false
}

function restartGame() {
  let restart = confirm('Are you sure you want to restart?')
  if (restart) {
    axios.post(`/room/${store.roomCode}/restart?userId=${store.userId}`).then(() => {
      console.log(`Player ${store.userId} restarted the game`)
    })
  }
}

function showSpectators() {
  axios.get(`/room/${store.roomCode}/spectators`)
    .then((resp) => {
      let members = resp.data.map((el) => el.nickname).join('\n')
      alert(members)
    })
}
</script>

<template>
  <div class="room-panel">
    <span @click="exitGame" class="room-panel__item">
      <i v-html="icon('exit')" class="icon"></i>
      Выход
    </span>
    <span v-if="props.rulesLink || props.rulesComponent" class="room-panel__item">
      <a
        v-if="props.rulesLink"
        :href="rulesHref" 
        target="_blank" 
        rel="noopener noreferrer">
        <i v-html="icon('rules')" class="icon"></i>
      </a>
      <component v-if="props.rulesComponent" :is="props.rulesComponent">
        <i v-html="icon('rules')" class="icon"></i>
      </component>
    </span>
    <span 
      v-if="props.settingsComp && props.currentMember?.admin" 
      @click="showSettings"
      class="room-panel__item"
    >
      <i v-html="icon('settings')" class="icon"></i>
    </span>
    <span
      v-if="props.gameStarted && props.currentMember?.admin"
      @click="restartGame"
      class="room-panel__item"
    >
      <i v-html="icon('restart')" class="icon"></i>
    </span>
    <span class="room_panel__divider"></span>
    <span @click="showSpectators" class="room-panel__item is-right">
      Наблюдатели: {{ props.spectatorsCount }}
    </span>
  </div>
  <CommonModal v-if="isSettingsShow" @close="isSettingsShow = false">
    <template #header>
      <div>Настройки</div>
    </template>
    <component :is="settingsComp" :updateSettingsFn="updateSettings" />
    <template #footer>
      <div style="display: flex; justify-content: flex-end;">
        <button
          class="save-settings__btn" 
          @click="updateSettings"
        >
          Сохранить
        </button>
      </div>
    </template>
  </CommonModal>
</template>

<style scoped>
.room-panel {
  position: fixed;
  top: 0;
  left: 0;
  padding: 2px 16px;
  width: 100%;
  font-size: 1rem;
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  color: var(--main-app-text-color);
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  background-color: var(--dark-app-color);
  z-index: 10;
}
.room-panel__item {
  display: block;
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
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.175em;
  fill: var(--main-app-text-color);
}
.room-panel__item:hover > .icon {
  fill: var(--main-app-color);
}
.save-settings__btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  color: var(--main-app-text-color);
  cursor: pointer;
  background-color: var(--dark-app-color);
}
.save-settings__btn:hover {
  background-color: var(--main-app-color);
}
</style>
