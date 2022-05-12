<template>
  <div class="flex justify-start items-center flex-col p-5 gap-10 w-min h-full">
    <div class="flex justify-start items-start flex-col">
      <div class="min-w-[380px] max-w-[500px] min-h-[380px] max-h-[500px] aspect-square flex-grow overflow-hidden">
        <transition name="fade-x" appear mode="out-in">
          <img :key="selectedSong.image" class="w-full transition duration-300 rounded-3xl"
            :src="`http://localhost:3002/` + selectedSong.image" alt="">
        </transition>
      </div>
      <transition name="fade-x" appear mode="out-in">
        <h1 :key="selectedSong.title" class="text-3xl font-bold pt-2 transition duration-300">{{ selectedSong.title }}
        </h1>
      </transition>
      <transition name="fade-x" appear mode="out-in">
        <h2 :key="selectedSong.artist" class="text-2xl font-semibold transition duration-300">{{ selectedSong.artist }}
        </h2>
      </transition>

    </div>
    <div class="w-full flex justify-start items-start flex-col gap-2 h-full">
      <h3 class="font-bold text-xl">lyrics</h3>
      <div
        class="text-2xl flex justify-center items-start flex-col font-bold relative bg-gray-800 bg-opacity-50 rounded-3xl w-full h-full overflow-hidden">
        <h4
          :class="{ 'opacity-20 -translate-y-full -mt-4 scale-90': index == 0, 'opacity-20 translate-y-full -mb-4 scale-90': index == 2 }"
          v-for="indexedLyric, index in displayedLyrics" :key="indexedLyric?.index || 0"
          class="transition-all origin-center absolute w-full px-8 h-1/3 flex justify-start items-center">{{
              indexedLyric?.lyric
          }}</h4>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useSongs } from '../store/useSongs';
import { watch, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
const songStore = useSongs();
const { selectedSong } = storeToRefs(songStore);

const displayedLyrics = ref([]);

watch(() => songStore.selectedSong, () => {
  const [closest, index] = findClosest(Object.keys(selectedSong?.value.lyrics), 0);
  displayedLyrics.value[0] = displayedLyrics.value[1];
  displayedLyrics.value[1] = {
    lyric: selectedSong.value.lyrics[closest],
    index: closest
  };
  displayedLyrics.value[2] = {
    lyric: selectedSong?.value.lyrics[Object.keys(selectedSong?.value.lyrics)[index + 1]],
    index: Object.keys(selectedSong?.value.lyrics)[index + 1]
  };
});

watch(() => songStore.currentTime, (newTime) => {
  const [closest, index] = findClosest(Object.keys(selectedSong?.value.lyrics), newTime);
  if (displayedLyrics.value[1]?.lyric == selectedSong.value.lyrics[closest]) return;
  displayedLyrics.value[0] = displayedLyrics.value[1];
  displayedLyrics.value[1] = {
    lyric: selectedSong.value.lyrics[closest],
    index: closest
  };
  displayedLyrics.value[2] = {
    lyric: selectedSong?.value.lyrics[Object.keys(selectedSong?.value.lyrics)[index + 1]],
    index: Object.keys(selectedSong?.value.lyrics)[index + 1]
  };
});


const findClosest = (array, value) => {
  let index = 0;
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