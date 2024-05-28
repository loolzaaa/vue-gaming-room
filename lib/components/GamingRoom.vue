<script setup>
import { ref } from 'vue'

import EnterView from './EnterView.vue'
import RoomView from './RoomView.vue'

const props = defineProps({
  bgImg: {
    required: true
  },
  roomComp: {
    type: Object,
    required: true
  }
})

const showRoomView = ref(false)
const wsToken = ref(null)
const gameStarted = ref(false)

function updateRoomData(data) {
  wsToken.value = data.wsToken
  gameStarted.value = data.gameStarted
  showRoomView.value = true
}
</script>

<template>
  <div class="bg" :style="{ backgroundImage: 'url(' + bgImg + ')' }">
    <EnterView v-if="!showRoomView" @update-room-data="updateRoomData" />
    <RoomView v-else :wsToken="wsToken" :gameStartedProp="gameStarted" v-slot="viewProps">
      <component
        :is="props.roomComp"
        :members="viewProps.members"
        :gameStarted="viewProps.gameStarted"
        :currentMember="viewProps.currentMember"
        :changeReadyStatus="viewProps.changeReadyStatus"
        :changePlayerStatus="viewProps.changePlayerStatus"
        :startGame="viewProps.startGame"
        :newGameData="viewProps.newGameData"
      >
      </component>
    </RoomView>
  </div>
</template>

<style scoped>
.bg {
  position: relative;
  min-height: 100vh;
  height: max(100vh, 100%);
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 22.5% 0;
  background-attachment: fixed;
}
.bg::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-color: #000;
}
</style>
