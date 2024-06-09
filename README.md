# Vue Gaming Room

A basic platform for creating web-based games with a room concept based on Vue.

When entering the game page, the user must specify his nickname, and then create his own or join someone else’s room, specifying its code. Further behavior of the application depends on the game implementation.

## Usage

- [Scaffold your Vite empty project](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).  
**Select Pinia as state manager.**
- Install necessary dependencies:
```shell
npm install axios @loolzaaa/vue-gaming-room
```
- Replace some predefined variable in Vite config:
```javascript
// vite.config.js

// ... some imports ...
export default defineConfig({
    // ... some properties ...
    // Vue Gaming Room constant replacement
    define: {
        'env.VGR_BASE': 'import.meta.env.BASE_URL'
    }
})
```
- Import Vue Gaming Room styles to your project
```javascript
// main.js
import '@loolzaaa/vue-gaming-room/style'
```
- Import `GamingRoom` component to you `App.vue` and use it in conjunction with your room implementation
```javascript
<script setup>
import { GamingRoom } from '@loolzaaa/vue-gaming-room'

// REQUIRED: This is your room implementation component
import RoomMain from '@/components/RoomMain.vue'

// REQUIRED: This is your room background
import bgImg from '@/assets/bg.jpeg'

// OPTIONAL: This is your settings component implementation
import SettingsMain from '@/components/SettingsMain.vue'

// OPTIONAL: Fine-tune background styles
const bgStyles = {
  position: '52% 0', // CSS: background-position
  opacity: 0.75, // Background overlay opacity
  color: '#000', // Background overlay color
}

// OPTIONAL: You can provide link (precedence) or component with game rules
</script>

<template>
  <GamingRoom
    :bgImg="bgImg"
    :bgStyles="bgStyles"
    :roomComp="RoomMain"
    :settingsComp="SettingsMain"
    rulesLink="/rules.pdf"
  >
    <!-- <div class="logo">Some logo for game</div> -->
  </GamingRoom>
</template>
```
- Place some favicon to public folder

## Room implementation props

|Prop name|Type|Required|Description|
|---|---|---|---|
|`members`|`Array`|`true`|list of room members (players with one admin and spectators)|
|`gameStarted`|`Boolean`|`true`|game started flag|
|`currentMember`|`Object`|`false`|current player/member who has the game running|
|`changeReadyStatus`|`Function`|`true`|function for changing ready/not ready to game status|
|`changePlayerStatus`|`Function`|`true`|function for changing player/spectator status|
|`startGame`|`Function`|`true`|function for start game routine|
|`newGameData`|`Object`|`false`|some data from game server for new game after starting|

## Using State Manager

Import Pinia to your component and use it as usual:
```javascript
import { useRoomStore } from '@loolzaaa/vue-gaming-room'

console.log(store.roomCode) // Example: AFRG
```

### Pinia Room store properties

|Prop name|Description|
|---|---|
|`gameName`|Current game name|
|`nickname`|Current player nickname|
|`userId`|Current player user id (used for game state receiving from game server)|
|`roomCode`|Current game room code|
|`gameSettings`|Current game settings|
|`webSocket`|WebSocket instance for sending some events|
|`addWsEventHandler`|Function for registering event handlers from game server via WebSocket|

**IMPORTANT!** If you provide settings component, you **must** set initial value of game settings in state manager.

## Change theme colors

You need to install SASS to changing main colors of Vue Gaming Library:
```shell
npm i sass -D
```

After that, you can create some `style.scss` in assets folder and change color variables:
```scss
// Use all component styles from library
@use '@loolzaaa/vue-gaming-room/style';

// Change some variables
@use '@loolzaaa/vue-gaming-room/sass/variables' with (
    $main-color: #b577b5,
    $dark-color: #352233,
);
@use '@loolzaaa/vue-gaming-room/sass';
```

Finally, import created `style.scss` in app entry point:
```diff
// main.js
- import '@loolzaaa/vue-gaming-room/style'
+ import './assets/main.scss'
```

## Using library utils

### Change member nickname

```javascript
import { useRoomStore } from '@loolzaaa/vue-gaming-room'
import { changeMemberNickname } from '@loolzaaa/vue-gaming-room/utils'

const store = useRoomStore()

function changeNickname(member) {
  if (member.nickname !== store.nickname) {
    return
  }
  changeMemberNickname()
}
```

### Change member color

```javascript
<script setup>
import { useRoomStore } from '@loolzaaa/vue-gaming-room'
import { changeMemberColor } from '@loolzaaa/vue-gaming-room/utils'

const store = useRoomStore()

function changeColor(event) {
  changeMemberColor(event.target.value) // function accepts #123456 RGB format
}
</script setup>

<template>
  <!-- currentMember from library props -->
  <input
    type="color"
    :value="currentMember.color"
    @change="changeColor"
  />
</template>
```

### Hold to action button

Below an example start button that need to hold for game start if not all members ready

```javascript
import { ref, computed } from 'vue'
import { holdToAction } from '@loolzaaa/vue-gaming-room/utils'

const startFn = () => props.startGame(false)
const forceStartFn = () => props.startGame(true)

const startGameBtn = ref(null) // Start button ref from template

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
```

`holdToAction` function signature:  
`function holdToAction(mode, button, callback, timeout = 1000)`  

## Game server

You can find Java implementation of Vue Gaming Room Server [here](https://github.com/loolzaaa/vue-gaming-room-java-server).