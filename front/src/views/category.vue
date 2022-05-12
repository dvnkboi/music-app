<template>
  <div class="flex justify-start items-start flex-col gap-5 w-full h-full">
    <div class="flex justify-start items-start gap-5 flex-wrap flex-grow">
      <song v-for="song in songs" :song="song" />
    </div>
    <div
      class="w-24 h-8 bg-blue-500 text-gray-900 rounded-xl mx-auto flex justify-center items-center group hover:-translate-y-1 transition duration-300 cursor-pointer">
      <transition name="fade-x" appear mode="out-in">
        <h1 v-if="!loading" @click="loadMore()" class="transition duration-300 font-semibold">Load more</h1>
        <h1 class="transition duration-300" v-else>
          <div class="animate-spin"><i class="ri-loader-5-fill font-semibold"></i></div>
        </h1>
      </transition>
    </div>
  </div>

</template>


<script setup>
import song from '../components/song.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSongs } from '../store/useSongs';
const songStore = useSongs();
const route = useRoute();
const songs = ref([]);
let page = 1;
const loading = ref(false);

const loadMore = async () => {
  loading.value = true;
  const nextSongs = await songStore.fetchSongs(route.params.category, 10, page);
  if (nextSongs && nextSongs.length > 0) {
    page++;
    songs.value.push(...nextSongs);
  }
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

onMounted(async () => {
  page = 1;
  await loadMore();
});

</script>