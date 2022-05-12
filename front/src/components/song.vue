<template>
  <div v-if="props.song" @click="setSelected"
    class="px-4 py-4 bg-gray-800 shadow-2xl rounded-3xl flex justify-start items-start flex-col gap-1 cursor-pointer group hover:-translate-y-1 transform transition duration-300 pb-4 w-48">
    <img
      class="h-40 w-40 aspect-square bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl group-hover:-translate-y-1 transform transition duration-300 shrink-0"
      :src="`http://localhost:3002/${props.song.image}`" alt="no img">
    <div class="flex justify-start items-start flex-col gap-0 w-full">
      <h1 class="text-lg font-semibold group-hover:-translate-y-0.5 transform transition duration-300 w-full truncate">
        {{
            props.song.title
        }}
      </h1>
      <h2
        class="text-base font-normal group-hover:-translate-y-0.5 transform transition duration-300 w-full truncate pr-4">
        {{
            props.song.artist
        }}
      </h2>
    </div>
    <!-- <h3 class="absolute bottom-2 right-3 text-xs text-gray-400">800 plays</h3> -->
  </div>
</template>

<script setup>
import { useSongs } from '../store/useSongs';
const songStore = useSongs();

const props = defineProps({
  song: {
    type: Object,
    required: true
  }
});

const setSelected = () => {
  songStore.setSelected(props.song);
};

</script>