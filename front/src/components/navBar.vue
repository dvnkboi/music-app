<template>
  <div class="flex justify-between items-center flex-row w-full p-5 fixed top-0 right-0 left-0">
    <router-link to="/">
      <div
        class="bg-gray-800 text-2xl px-10 py-1 rounded-xl font-semibold flex justify-start items-center gap-2 cursor-pointer group hover:-translate-y-0.5 transition duration-300">
        <h1 class="group-hover:-translate-y-1 transition duration-300">M</h1>
        <h1 class="group-hover:-translate-y-1 transition duration-300 delay-[50ms]">u</h1>
        <h1 class="group-hover:-translate-y-1 transition duration-300 delay-[100ms]">s</h1>
        <h1 class="group-hover:-translate-y-1 transition duration-300 delay-[150ms]">e</h1>
      </div>
    </router-link>
    <div :key="'nav_' + user.name" v-if="user?.name" @click="changeUserName"
      class="bg-gray-800 py-1 px-4 rounded-xl font-semibold flex justify-start items-center gap-4 group hover:-translate-y-0.5 transition duration-300 cursor-pointer">
      <h1 class="">{{ user.name }}</h1>
      <div :class="user.color" class="rounded-full w-8 h-8 flex justify-center items-center capitalize">{{
          user.name?.charAt(0)
      }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSongs } from '../store/useSongs';
import { storeToRefs } from 'pinia';
const songStore = useSongs();
const { user } = storeToRefs(songStore);

const emit = defineEmits(['changeUserName']);

const changeUserName = () => {
  emit('changeUserName');
};

</script>