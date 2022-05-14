<template>
  <transition name="fade-x" appear>
    <div v-if="props.song" @click="setSelected"
      :class="{ 'ring-2 ring-blue-500': playing, 'ring-0 ring-transparent': !playing }"
      class="px-4 py-4 bg-gray-800 shadow-2xl rounded-3xl flex justify-start items-start flex-col gap-1 cursor-pointer group hover:-translate-y-1 transform transition duration-300 pb-8 w-48">
      <div class="relative">
        <img
          class="h-40 w-40 aspect-square bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl group-hover:-translate-y-1 transform transition duration-300 shrink-0"
          :src="`http://localhost:3002/${props.song.image}`" alt="no img">
        <div @click.prevent.stop
          class="transition duration-300 absolute bottom-0 right-2 text-3xl group-hover:-translate-y-1.5 transform ">
          <transition name="fade-x" appear mode="out-in">
            <i v-if="isLiked(song.id)" @click="songStore.dislikeSong(song)"
              class="ri-heart-fill transition duration-300 shadow-sm"></i>
            <i v-else @click="songStore.likeSong(song)" class="ri-heart-line transition duration-300 shadow-sm"></i>
          </transition>
        </div>
      </div>
      <div class="flex justify-start items-start flex-col gap-0 w-full">
        <h1
          class="text-lg font-semibold group-hover:-translate-y-0.5 transform transition duration-300 w-full truncate">
          {{ props.song.title }}
        </h1>
        <h2
          class="text-base font-normal group-hover:-translate-y-0.5 transform transition duration-300 w-full truncate pr-4">
          {{ props.song.artist }}
        </h2>
      </div>
      <transition name="fade-x" appear>
        <h3 v-if="playing" class="absolute bottom-2 right-3 text-xs text-gray-400 transition duration-300">playing</h3>
      </transition>
    </div>
  </transition>

</template>

<script setup>
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useSongs } from '../store/useSongs';
const songStore = useSongs();
const { selectedSong, isLiked } = storeToRefs(songStore);

const props = defineProps({
  song: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    default: 'liked'
  }
});

const playing = computed(() => {
  return selectedSong.value?.id === props.song.id;
});

const setSelected = () => {
  if (songStore.selectedSong?.id == props.song.id) return;
  songStore.setSelected(props.song, props.type);
};

</script>