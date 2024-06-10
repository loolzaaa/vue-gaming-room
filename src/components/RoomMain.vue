<script setup>
import { ref, computed } from 'vue'
import { useRoomStore } from '../../lib/store/room'
import { holdToAction, changeMemberNickname } from '../../lib/utils/utils'

import GameMain from './GameMain.vue'

const store = useRoomStore()

const props = defineProps({
  members: {
    type: Array,
    required: true
  },
  gameStarted: {
    type: Boolean,
    required: true
  },
  currentMember: {
    type: Object,
    required: false
  },
  changeReadyStatus: {
    type: Function,
    required: true
  },
  changePlayerStatus: {
    type: Function,
    required: true
  },
  startGame: {
    type: Function,
    required: true
  },
  newGameData: {
    type: Object,
    required: false
  }
})

const startFn = () => props.startGame(false)
const forceStartFn = () => props.startGame(true)

const startGameBtn = ref(null)

const allMembersReady = computed(() => {
  let allReady = props.members.every((el) => el.ready)
  if (startGameBtn.value) {
    startGameBtn.value.removeEventListener('click', startFn)
    holdToAction('disable', startGameBtn.value)
    if (allReady) {
      startGameBtn.value.addEventListener('click', startFn)
    } else {
      holdToAction('enable', startGameBtn.value, forceStartFn, 2000)
    }
  }
  return allReady
})

function changeNickname(member) {
  if (member.nickname !== store.nickname) {
    return
  }
  changeMemberNickname()
}
</script>

<template>
  <div class="room-actions">
    <h1 class="room_actions__heading">Игроки:</h1>
    <table class="room-actions__members">
      <tr v-for="member in props.members" :key="member.nickname">
        <td><span class="member-color" :style="{ backgroundColor: member.color }"></span></td>
        <td>
          <span @click="changeNickname(member)">{{ member.nickname }}</span>
          <span v-if="member.admin" style="color: yellow; margin-left: 4px">&#9733;</span>
        </td>
        <td>
          <span class="icon" :style="{ color: member.ready ? 'green' : 'red' }">
            {{ member.ready ? '&#9989;' : '&#10007;' }}
          </span>
        </td>
      </tr>
    </table>
    <button
      v-if="!props.gameStarted"
      @click="props.changePlayerStatus(!currentMember)"
      class="room-actions__button"
    >
      {{ props.currentMember ? 'Перейти к зрителям' : 'Войти в игру' }}
    </button>
    <button
      v-if="!props.gameStarted && props.currentMember?.player"
      @click="props.changeReadyStatus(!currentMember.ready)"
      class="room-actions__button"
      :style="{ backgroundColor: props.currentMember.ready ? '#2c8160' : '#8e2927' }"
    >
      {{ props.currentMember.ready ? 'Готов' : 'Не готов' }}
    </button>
    <button
      id="startGameBtn"
      ref="startGameBtn"
      v-if="!props.gameStarted && props.currentMember?.admin"
      :class="['room-actions__button', allMembersReady ? '' : 'hold-button']"
    >
      {{ 'Начать игру' + (allMembersReady ? '' : ' (принуд.)') }}
    </button>
  </div>
  <GameMain v-if="props.gameStarted" :players="props.members" :newGameData="newGameData" />
</template>

<style scoped>
.room-actions {
  flex-shrink: 0;
  padding: 10px 16px;
  margin-right: 16px;
  width: 300px;
  overflow: hidden;
  background: var(--main-app-color40);
  border-radius: 8px;
  box-shadow: 0px 4px 30px var(--main-app-color40);
  backdrop-filter: blur(4px);
  border: 1px solid var(--main-app-color20);
}
@media only screen and (max-width: 1024px) {
  .room-actions {
    width: 100%;
    margin-right: 0;
  }
}
.room_actions__heading {
  font-size: 1.75rem;
  font-weight: 400;
  text-align: left;
  margin-bottom: 8px;
  color: var(--main-app-text-color);
}
@media only screen and (max-width: 1024px) {
  .room_actions__heading {
    font-size: 1.25rem;
  }
}
.room-actions__members {
  width: 100%;
  font-size: 1.25rem;
  background: var(--dark-app-color80);
  margin-bottom: 18px;
}
@media only screen and (max-width: 1024px) {
  .room-actions__members {
    margin-bottom: 0;
  }
}
.room-actions__members td {
  padding: 2px 0;
}
.room-actions__members td:first-child {
  padding: 2px 8px;
}
.room-actions__members td:first-child,
td:last-child {
  text-align: center;
  width: 40px;
}
.member-color {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
}
.room-actions__button {
  margin-top: 10px;
  padding: 4px 16px;
  font-size: 1rem;
  background: var(--dark-app-color);
  border: 2px solid var(--dark-app-color20);
  color: var(--main-app-text-color);
  border-radius: 4px;
  width: 100%;
  transition: all 0.2s cubic-bezier(0.8, 0.15, 0.15, 0.8);
  cursor: pointer;
}
.room-actions__button:hover {
  background: var(--main-app-color80);
  transition: all 0.1s ease;
}
.hold-button:active {
  background-image: linear-gradient(
    to right,
    var(--dark-app-color) 0%,
    var(--dark-app-color) 50%,
    var(--dark-app-color20),
    50%,
    var(--dark-app-color20) 100%
  );
  background-size: 200% 100%;
  background-position: 100%; /* 100% -> 0% */
  border: 2px solid var(--dark-app-color);
  animation: 2s confirmation forwards;
}
</style>
