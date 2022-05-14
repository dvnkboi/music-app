<template>
  <div class="flex justify-start items-start flex-col gap-5 w-full">
    <h1 class="text-6xl font-bold capitalize pb-5 -mt-3">Liked songs</h1>
    <h2 class="text-xl font-bold capitalize pb-5 -mt-8">{{ songs.length }} songs</h2>
    <div v-if="songs.length > 0" class="flex justify-center md:justify-start items-start gap-5 flex-wrap flex-grow">
      <song class="transition-all duration-300" :key="song.id" v-for="song in songs" :song="song" :type="'liked'" />
    </div>
    <div v-else class="text-2xl flex-grow">No liked songs, like a song to update this section</div>
  </div>
</template>

<script setup>
import song from '../components/song.vue';
import { ref, onMounted, computed } from 'vue';
import { useSongs } from '../store/useSongs';
import { storeToRefs } from 'pinia';
const songStore = useSongs();
const { likedSongs } = storeToRefs(songStore);

const songs = computed(() => {
  return Object.values(likedSongs.value);
});

onMounted(async () => {
});

</script>