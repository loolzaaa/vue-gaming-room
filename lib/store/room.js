import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useRoomStore = defineStore('room', () => {
  const gameName = ref(null)
  const nickname = ref(localStorage.getItem('nickname'))
  const userId = ref(localStorage.getItem(`${gameName.value}UserId`))
  const roomCode = ref(null)
  const gameSettings = ref(null)

  const webSocket = ref(null)
  const webSocketEventHandlers = ref({
    PONG: () => {},
    GAME_STATE: () => {},
    ERROR: (data) => alert('WS ERROR: ' + data)
  })

  function updateRoomData(data) {
    gameName.value = data.gameName
    userId.value = data.userId
    roomCode.value = data.code
    localStorage.setItem(`${gameName.value}UserId`, userId.value)
    localStorage.setItem('nickname', nickname.value)
  }

  function connectToWs(wsToken) {
    const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
    let webSocketEntrypoint = `${wsScheme}://${window.location.host}${env.VGR_BASE}game-ws`
    webSocket.value = new WebSocket(`${webSocketEntrypoint}?token=${userId.value}:${wsToken}`)
    webSocket.value.onopen = () => keepAlive()
    webSocket.value.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      let handler = webSocketEventHandlers.value[msg.event]
      if (handler) {
        handler(msg.data, msg.event)
      } else {
        console.log('WS handler not found: ' + msg.event)
      }
    }
    webSocket.value.onclose = () => {
      cancelKeepAlive()
      alert('WebSocket connection close')
      location.reload()
    }
    webSocket.value.onerror = (event) => {
      cancelKeepAlive()
      alert('WebSocket connection error')
      console.log(event)
    }
  }

  function addWsEventHandler(event, handler) {
    webSocketEventHandlers.value[event] = handler
  }

  let keepAliveTimer
  function keepAlive(timeout = 10000) {
    if (webSocket.value.readyState == webSocket.value.OPEN) {
      webSocket.value.send(JSON.stringify({ event: 'PING' }))
    }
    keepAliveTimer = setTimeout(keepAlive, timeout)
  }
  function cancelKeepAlive() {
    if (keepAliveTimer) {
      clearTimeout(keepAliveTimer)
    }
  }

  return {
    gameName,
    nickname,
    userId,
    roomCode,
    gameSettings,
    webSocket,
    updateRoomData,
    connectToWs,
    addWsEventHandler
  }
})
