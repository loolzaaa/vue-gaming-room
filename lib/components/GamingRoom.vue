<script setup>
import { ref, computed } from 'vue'

import EnterView from './EnterView.vue'
import RoomView from './RoomView.vue'

const props = defineProps({
  bgImg: {
    required: true
  },
  roomComp: {
    type: Object,
    required: true
  },
  bgStyles: {
    type: Object,
    default: {}
  }
})

const showRoomView = ref(false)
const wsToken = ref(null)
const gameStarted = ref(false)

const processBgStyles = computed(() => {
  return {
    '--bgPosition': props.bgStyles.position ? props.bgStyles.position : '0 0',
    '--bgOpacity': props.bgStyles.opacity ? props.bgStyles.opacity : 0.4,
    '--bgColor': props.bgStyles.color ? props.bgStyles.color : '#000',
    backgroundImage: 'url(' + props.bgImg + ')',
  }
})

function updateRoomData(data) {
  wsToken.value = data.wsToken
  gameStarted.value = data.gameStarted
  showRoomView.value = true
}
</script>

<template>
  <div class="bg" :style="processBgStyles">
    <EnterView v-if="!showRoomView" @update-room-data="updateRoomData">
      <slot></slot>
    </EnterView>
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
  background-position: var(--bgPosition);
  background-attachment: fixed;
}
.bg::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: var(--bgOpacity);
  background-color: var(--bgColor);
}
</style>
