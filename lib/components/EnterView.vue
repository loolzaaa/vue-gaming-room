<script setup>
import axios from 'axios'
import { useRoomStore } from '../store/room'

const store = useRoomStore()

const emit = defineEmits(['updateRoomData'])

function createRoom() {
  if (!store.nickname || store.nickname.trim().length < 1) {
    console.log('Nickname must be at least 1 character')
    return
  }
  store.nickname = store.nickname.trim()
  let params = `nickname=${store.nickname}`
  if (store.userId) {
    params += `&userId=${store.userId}`
  }
  axios.post(`/room/create?${params}`).then((resp) => {
    store.updateRoomData(resp.data)
    emit('updateRoomData', { wsToken: resp.data.wsToken, gameStarted: resp.data.gameStarted })
    history.pushState(
      '',
      document.title,
      window.location.pathname + window.location.search + '#' + store.roomCode
    )
  })
}

function joinToRoom() {
  if (!store.roomCode || store.roomCode.trim().length !== 4) {
    console.log('Room code must be 4 characters long')
    return
  }
  if (!store.nickname || store.nickname.trim().length < 1) {
    console.log('Nickname must be at least 1 character')
    return
  }
  store.nickname = store.nickname.trim()
  let params = `nickname=${store.nickname}`
  if (store.userId) {
    params += `&userId=${store.userId}`
  }
  axios.post(`/room/join/${store.roomCode}?${params}`).then((resp) => {
    store.updateRoomData(resp.data)
    emit('updateRoomData', { wsToken: resp.data.wsToken, gameStarted: resp.data.gameStarted })
  })
}

if (location.hash && location.hash.length === 5) {
  store.roomCode = location.hash.substring(1).toUpperCase()
  joinToRoom()
}
</script>

<template>
  <div class="main-menu__container">
    <slot></slot>
    <div class="main-menu">
      <div class="main-menu__input">
        <label for="nickname">Введите никнейм</label>
        <input id="nickname" v-model="store.nickname" type="text" autocomplete="false" />
      </div>
      <button @click="createRoom" class="main-menu__button">Создать игру</button>
      <div class="main-menu__input">
        <label for="room-code">Введите код комнаты</label>
        <input id="room-code" v-model="store.roomCode" type="password" autocomplete="false" />
      </div>
      <button @click="joinToRoom" class="main-menu__button">Присоединиться к игре</button>
    </div>
  </div>
</template>

<style>
.main-menu__container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
}
.main-menu {
  position: relative;
  padding: 35px 40px;
  overflow: hidden;
  background: var(--main-app-color40);
  border-radius: 8px;
  box-shadow: 0px 4px 30px var(--main-app-color40);
  backdrop-filter: blur(4px);
  border: 1px solid var(--main-app-color20);
  animation: main-menu 0.7s ease;
  z-index: 1;
}
@media only screen and (max-width: 1024px) {
  .main-menu {
    width: 100%;
  }
}
@keyframes main-menu {
  0% {
    transform: translateY(-10%) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.main-menu__input {
  display: block;
}
.main-menu__input label {
  display: block;
  padding-left: 2px;
  margin-bottom: 4px;
  font-size: 1rem;
  color: var(--main-app-text-color);
  cursor: pointer;
}
.main-menu__input input {
  width: 100%;
  outline: none;
  border: none;
  font-size: 1.5rem;
  text-align: center;
  border-radius: 4px;
  background: var(--dark-app-color40);
  color: var(--main-app-text-color);
  transition: all 0.2s ease;
}
.main-menu__input input:hover {
  background: var(--main-app-color40);
}
.main-menu__input input:focus {
  box-shadow: 0px 4px 12px #00000040;
  background: var(--main-app-color80);
}
.main-menu__button {
  margin-top: 10px;
  padding: 4px 16px;
  font-size: 1.25rem;
  background: var(--dark-app-color);
  border: 2px solid var(--dark-app-color20);
  color: var(--main-app-text-color);
  border-radius: 4px;
  width: 100%;
  transition: all 0.2s cubic-bezier(0.8, 0.15, 0.15, 0.8);
  cursor: pointer;
}
.main-menu__button:first-of-type {
  margin-bottom: 16px;
}
.main-menu__button:hover {
  background: var(--main-app-color80);
  transition: all 0.1s ease;
}
.main-menu__button:focus {
  outline: none;
  box-shadow: 0px 0px 0px 2px var(--dark-app-color80);
  background: var(--dark-app-color60);
}
</style>
