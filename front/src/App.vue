<template>
  <navBar @changeUserName="changeUserPrompt" />
  <div class="flex justify-start items-start flex-col h-full pt-16">
    <div class="flex justify-start items-start w-full h-full flex-col lg:flex-row overflow-auto">
      <div class="h-screen shrink-0 lg:h-full max-h-full w-full lg:w-fit pb-24">
        <div
          class="h-full overflow-y-auto overflow-x-hidden flex-shrink-0 w-full lg:w-fit flex justify-center lg:justify-start items-start">
          <playingNow />
        </div>
      </div>
      <div class="p-5 w-full flex col justify-start items-start flex-col gap-10 lg:h-full lg:overflow-auto pb-28">
        <router-view />
      </div>
    </div>

  </div>
  <Player />
  <Transition name="fade" appear>
    <div v-if="changingUser" @click.self="cancelUserChange" @keyup.esc="cancelUserChange"
      :class="{ 'backdrop-blur-2xl opacity-100': changingUser, 'backdrop-blur-0 opacity-0': !changingUser }"
      class="fixed h-screen w-full bg-gray-800 bg-opacity-80 z-50 top-0 transition duration-500 flex justify-center items-center">
      <div class="flex justify-start items-center flex-col bg-gray-800 rounded-3xl px-7 py-5 gap-5 pointer-events-auto">
        <div :class="[changingUser ? 'bg-gray-700' : 'text-gray-800']"
          class="bg-gray-700 py-1 px-4 rounded-xl font-semibold flex justify-start items-center gap-4 group hover:-translate-y-0.5 transition duration-300 cursor-pointer absolute top-5 right-5">
          <h1 v-if="tmpUser.name != ''" class="">{{ tmpUser.name }}</h1>
          <div :class="[`${tmpUser.color}`]" class="rounded-full w-8 h-8 flex justify-center items-center capitalize">{{
              tmpUser.name?.charAt(0)
          }}
          </div>
        </div>
        <div @click="focusInput" class="flex justify-start items-start flex-col">
          <h2 class="font-semibold">Name</h2>
          <input ref="userInput" v-model="tmpUser.name" id="userName" placeholder="User" title="User"
            class="rounded-xl px-2 py-1 md:min-w-[300px] text-lg bg-gray-700 text-white select-auto outline-none hover:outline-none"
            type="text" maxlength="20">
        </div>
        <div @click="commitUser"
          class="w-20 h-8 rounded-xl bg-blue-500 mt-5 text-gray-900 font-semibold grid place-items-center cursor-pointer group hover:-translate-y-0.5 transition duration-300 ml-auto">
          <h1 class="transition durration-300 group-hover:-translate-y-0.5">Done</h1>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
import navBar from './components/navBar.vue';
import Player from './components/player.vue';
import playingNow from './components/playingNow.vue';
import { useSongs } from './store/useSongs';
const songStore = useSongs();
const tmpUser = ref({
  name: '',
  color: 'blue'
});
const colors = [
  'rose', 'blue', 'green', 'orange', 'purple'
];

watch(() => tmpUser.value.name, () => {
  if (tmpUser.value.name?.length > 0) {
    tmpUser.value.color = colors[Math.floor(Math.random() * colors.length)];
  }
});

const changingUser = ref(false);
const userInput = ref(null);

const changeUserPrompt = () => {
  changingUser.value = true;
};

const focusInput = () => {
  userInput.value.focus();
};

const commitUser = async () => {
  await songStore.setUser(tmpUser.value);
  changingUser.value = false;
};

const cancelUserChange = async () => {
  const user = await songStore.getUser();
  tmpUser.value = {
    ...user
  };
  changingUser.value = false;
};

onMounted(async () => {
  await songStore.getPlayList();
  console.log(songStore.playlist);
  const user = await songStore.user;
  tmpUser.value = {
    ...user
  };
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

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}

/* .rose-bg {
  @apply bg-rose-500;
}

.orange-bg {
  @apply bg-orange-500;
}

.blue-bg {
  @apply bg-blue-500;
}

.green-bg {
  @apply bg-green-500;
}

.purple-bg {
  @apply bg-purple-500;
} */


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
