<script setup>
import GamingRoom from '../lib/components/GamingRoom.vue'
import RoomMain from './components/RoomMain.vue'

import bgImg from './assets/bg.jpg'

const bgStyles = {
  opacity: 0.8,
}
</script>

<template>
  <GamingRoom
    :bgImg="bgImg"
    :bgStyles="bgStyles"
    :roomComp="RoomMain"
  />
</template>
