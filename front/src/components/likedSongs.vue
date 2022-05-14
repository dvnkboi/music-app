<template>
  <div
    class="h-40 w-full md:w-96 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex justify-start items-end text-gray-900 relative overflow-hidden group hover:-translate-y-1 transition duration-300">
    <i class="ri-heart-fill text-[16rem] absolute z-0 -right-16 -bottom-36 opacity-20 text-orange-300"></i>
    <div class="flex justify-between items-center px-5 py-2 w-full relative">
      <div class="flex justify-start items-start flex-col">
        <h1 class="text-3xl font-bold group-hover:-translate-y-2 transition duration-300">Liked songs</h1>
        <h2 class="text-base font-semibold -mt-2 group-hover:-translate-y-1 transition duration-300">{{ songs.length
        }} songs</h2>
      </div>
      <div @click.prevent.stop="playLiked"
        class="w-12 h-12 bg-gray-900 rounded-full flex justify-center items-center text-gray-50 text-2xl hover:-translate-y-1 transition duration-300">
        <i class="ri-play-fill transition duration-300"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSongs } from '../store/useSongs';
import { storeToRefs } from 'pinia';
const songStore = useSongs();
const { likedSongs } = storeToRefs(songStore);

const songs = computed(() => {
  return Object.values(likedSongs.value);
});

const playLiked = () => {
  songStore.playLiked();
};

</script>