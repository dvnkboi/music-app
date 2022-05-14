<template>
  <div class="flex justify-center md:justify-start items-center gap-5 w-full flex-wrap">
    <router-link to="/liked" class="w-full md:w-fit">
      <likedSongs />
    </router-link>
    <div v-for="category in categories" :key="category.title" class="w-5/12 md:w-fit">
      <router-link :to="`/category/${category.name || 'pop'}`">
        <category :background="category.background" :title="category.name" />
      </router-link>
    </div>
  </div>
  <div class="flex flex-col justify-start items-start gap-5">
    <h1 class="text-3xl font-bold">Playlist</h1>
    <div class="flex justify-center md:justify-start items-start flex-row flex-wrap gap-5">
      <song v-for="song in playlist.songs" :song="song" :type="playlist.type" />
    </div>
  </div>
</template>


<script setup>
import playingNow from '../components/playingNow.vue';
import likedSongs from '../components/likedSongs.vue';
import category from '../components/category.vue';
import song from '../components/song.vue';
import { storeToRefs } from 'pinia';
import { useSongs } from '../store/useSongs';
import { onMounted, ref } from 'vue';

const songStore = useSongs();

const { playlist } = storeToRefs(songStore);

const categories = ref([]);

onMounted(async () => {
  categories.value = await songStore.fetchCategories(5, 1);
});





</script>