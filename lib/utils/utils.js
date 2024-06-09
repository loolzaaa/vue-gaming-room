import axios from 'axios'
import { useRoomStore } from '../store/room'

const holdToActionEvents = {}

export function holdToAction(mode, button, callback, timeout = 1000) {
  if (mode === 'enable') {
    let actionTimer
    let isHoldingButton

    const pointerDownEvent = () => {
      isHoldingButton = true
      actionTimer = setTimeout(() => {
        callback(button)
      }, timeout)
    }

    const pointerUpEvent = () => {
      if (isHoldingButton) {
        if (actionTimer) {
          clearTimeout(actionTimer)
        }
      }
    }

    button.addEventListener('pointerdown', pointerDownEvent)
    window.addEventListener('pointerup', pointerUpEvent)
    holdToActionEvents[button.id] = {
      holdDown: pointerDownEvent,
      holdUp: pointerUpEvent
    }
  } else if (mode === 'disable') {
    let events = holdToActionEvents[button.id]
    if (events) {
      button.removeEventListener('pointerdown', events.holdDown)
      window.removeEventListener('pointerup', events.holdUp)
    }
  }
}

export function changeMemberNickname() {
  let nickname = prompt('Enter your nickname:')
  if (nickname && nickname.trim().length > 0) {
    nickname = nickname.trim()
    const code = useRoomStore().roomCode
    const userId = useRoomStore().userId
    axios.post(`/room/${code}/${userId}/nickname?newNickname=${nickname}`).then(() => {
      useRoomStore().nickname = nickname
    })
  }
}

export function changeMemberColor(color) {
  if (/^#[0-9A-Fa-f]{6,8}$/.test(color)) {
    color = color.substring(0, 7)
    const code = useRoomStore().roomCode
    const userId = useRoomStore().userId
    axios.post(`/room/${code}/${userId}/color?newColor=${color}`).then(() => {
      console.log(`Player ${userId} change color to ${color}`)
    })
  }
}