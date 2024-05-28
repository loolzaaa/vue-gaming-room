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
