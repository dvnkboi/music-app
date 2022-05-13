<template>
  <navBar />
  <div class="flex justify-start items-start flex-col h-full pt-16">
    <div class="flex justify-start items-start w-full h-full">
      <div class="h-full max-h-full pb-24">
        <div class="h-full max-h-full overflow-y-auto overflow-x-hidden flex-shrink-0 ">
          <playingNow class="" />
        </div>
      </div>
      <div class="p-5 w-full flex col justify-start items-start flex-col gap-10 h-full overflow-auto pb-28">
        <router-view />
      </div>
    </div>

  </div>
  <Player />

</template>

<script setup>
import { onMounted } from 'vue';
import navBar from './components/navBar.vue';
import Player from './components/player.vue';
import playingNow from './components/playingNow.vue';
import { useSongs } from './store/useSongs';
const songStore = useSongs();

onMounted(async () => {
  await songStore.setCurrentCategory("pop");
  songStore.setSelected(songStore.playlist[0]);
});
</script>

<style>
/* ./src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body,
html,
#app {
  @apply h-screen w-full bg-gray-900 text-gray-50 select-none;
}


.fade-x-enter-from {
  @apply opacity-0 -translate-x-2 scale-95;
}

.fade-x-leave-to {
  @apply opacity-0 translate-x-2 scale-95;
}


.list-fade-x-enter-from {
  @apply opacity-0 -translate-x-2 scale-95;
}

.list-fade-x-leave-to {
  @apply opacity-0 translate-x-2 scale-95;
}

.list-fade-x-leave-active {
  @apply absolute;
}


* {
  scrollbar-width: auto;
  scrollbar-color: #0E0F10 #050505;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 13px;
}

*::-webkit-scrollbar-track {
  background: #050505;
}

*::-webkit-scrollbar-thumb {
  background-color: #0E0F10;
  border-radius: 14px;
  border: 3px solid #050505;
}
</style>
