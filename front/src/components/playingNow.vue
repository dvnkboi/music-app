<template>
  <div :class="{ 'max-w-0 opacity-0 p-0': !validSong, 'max-w-[450px] opacity-100 p-5': validSong }"
    class="flex justify-start items-center flex-col gap-10 w-full lg:w-min h-full transition-all duration-1000">
    <div class="w-[300px] sm:w-[350px] md:w-[400px] flex justify-start items-center md:items-start flex-col">
      <div class="w-full aspect-square overflow-hidden">
        <transition name="fade-x" appear mode="out-in">
          <img v-if="selectedSong.image" :key="selectedSong.image" class="w-full transition duration-300 rounded-3xl"
            :src="`http://localhost:3002/` + selectedSong.image" alt="">
        </transition>
      </div>
      <transition name="fade-x" appear mode="out-in">
        <h1 :key="selectedSong.title"
          class="text-3xl font-bold pt-2 transition duration-300 text-center md:text-left w-full flex justify-between items-center pr-4">
          {{ selectedSong.title }}
          <transition name="fade-x" appear>
            <div v-if="selectedSong.title" class="transition duration-300">
              <transition name="fade-x" appear mode="out-in">
                <i v-if="isLiked(selectedSong.id)" @click="songStore.dislikeSong(selectedSong)"
                  class="ri-heart-fill transition duration-300"></i>
                <i v-else @click="songStore.likeSong(selectedSong)" class="ri-heart-line transition duration-300"></i>
              </transition>
            </div>
          </transition>
        </h1>
      </transition>
      <transition name="fade-x" appear mode="out-in">
        <h2 :key="selectedSong.artist" class="text-2xl font-semibold transition duration-300 text-center md:text-left">
          {{ selectedSong.artist }}
        </h2>
      </transition>

    </div>
    <div class="w-full flex justify-start items-start flex-col gap-2 h-full">
      <h3 class="font-bold text-xl">lyrics</h3>
      <div
        class="text-2xl flex justify-center items-start flex-col font-bold relative bg-gray-800 bg-opacity-50 rounded-3xl w-full h-full overflow-hidden">
        <h4
          :class="{ 'opacity-20 -translate-y-full -mt-4 scale-90': index == 0, 'opacity-20 translate-y-full -mb-4 scale-90': index == 2 }"
          v-for="indexedLyric, index in displayedLyrics" :key="indexedLyric?.index"
          class="transition-all origin-center absolute w-full px-8 h-1/3 flex justify-start items-center">{{
              indexedLyric?.lyric
          }}</h4>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useSongs } from '../store/useSongs';
import { watch, ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
const songStore = useSongs();
const { selectedSong, isLiked } = storeToRefs(songStore);
const displayedLyrics = ref([]);
let prepared = ref(false);

// const isLiked = computed(() => {
//   return songStore.isLiked(selectedSong.id);
// });

watch(() => songStore.selectedSong, () => {
  displayedLyrics.value = [];
  updateLyrics(0);
});

watch(() => songStore.currentTime, (newTime) => {
  updateLyrics(newTime);
});

const validSong = computed(() => {
  return prepared.value && selectedSong.value && selectedSong.value.title != "";
});

const updateLyrics = (time) => {
  if (selectedSong.value == null || selectedSong.value.lyrics == null || Object.keys(selectedSong.value.lyrics).length < 1) return;
  const [closest, index] = findClosest(Object.keys(selectedSong?.value.lyrics || {}), time);
  if (displayedLyrics.value[1]?.lyric == selectedSong.value.lyrics[closest] && displayedLyrics.value[2]?.lyric == selectedSong?.value.lyrics[Object.keys(selectedSong?.value.lyrics)[index + 1]]) return;
  displayedLyrics.value[0] = displayedLyrics.value[1];
  displayedLyrics.value[1] = {
    lyric: selectedSong.value.lyrics[closest],
    index: closest
  };
  displayedLyrics.value[2] = {
    lyric: selectedSong?.value.lyrics[Object.keys(selectedSong?.value.lyrics)[index + 1]],
    index: Object.keys(selectedSong?.value.lyrics)[index + 1]
  };
};

onMounted(() => {
  setTimeout(() => {
    prepared.value = true;
  }, 1000);
});

const findClosest = (array, value) => {
  let index = null;
  for (const val of array) {
    if (val > value) {
      value = val;
      index = array.indexOf(val);
      break;
    }
  }

  return [array[index - 1], index - 1];
};


</script>

<style>
</style>