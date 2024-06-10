<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  players: {
    type: Array,
    required: true
  },
  newGameData: {
    type: Object
  }
})

const gameStatus = ref(null)

function updateGameState(data) {
  if (!data) {
    return
  }
  gameStatus.value = data.currentAction
}

store.addWsEventHandler('END_GAME', endGame)
store.addWsEventHandler('GAME_STATE', updateGameState)

onMounted(() => {
  if (props.newGameData) {
    updateGameState(props.newGameData)
  }
})
</script>

<template>
  <div class="game-container">
    <div class="game-status">
      <span>{{ gameStatus }}</span>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  position: relative;
  margin-top: 0;
  width: 100%;
  overflow: hidden;
  font-size: 16px;
}
@media only screen and (max-width: 1024px) {
  .game-container {
    margin-top: 16px;
    font-size: 8px;
    height: 85vh;
  }
}
.game-status {
  padding: 10px 16px;
  width: 100%;
  font-size: 1.5rem;
  text-align: center;
  letter-spacing: 0.25rem;
  background: var(--main-app-color40);
  border-radius: 8px;
  box-shadow: 0px 4px 30px var(--main-app-color40);
  backdrop-filter: blur(4px);
  border: 1px solid var(--main-app-color20);
}
@media only screen and (max-width: 1024px) {
  .game-status {
    padding: 2px 16px;
    font-size: 1rem;
    letter-spacing: 0.15rem;
  }
}
.game-status.is-active {
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
}
</style>
