<template>
  <div class="p-5 w-full fixed bottom-0">
    <div class="bg-gray-800 rounded-3xl h-16 w-full text-white flex justify-start items-center">
      <!-- controlls -->
      <div class="flex justify-start items-center gap-2 p-5">
        <div @click="previous"
          class="rounded-full h-7 w-7 bg-gray-700 cursor-pointer hover:-translate-y-0.5 transition duration-300 flex justify-center items-center text-base">
          <i class="ri-skip-back-fill"></i>
        </div>
        <div @click="playPause"
          class="rounded-full h-10 w-10 bg-gray-700 cursor-pointer hover:-translate-y-0.5 transition duration-300 flex justify-center items-center text-2xl">
          <transition name="fade-x" appear mode="out-in">
            <i v-if="!playing" class="ri-play-fill transition duration-300"></i>
            <i v-else class="ri-pause-fill transition duration-300"></i>
          </transition>
        </div>
        <div @click="skip"
          class="rounded-full h-7 w-7 bg-gray-700 cursor-pointer hover:-translate-y-0.5 transition duration-300 flex justify-center items-center text-base">
          <i class="ri-skip-forward-fill"></i>
        </div>
      </div>
      <!-- time slider time -->
      <div class="w-full flex justify-start items-center gap-4 pr-5">
        <div class="text-gray-400">{{ getTime(player?.currentTime) }}</div>
        <div ref="progressSlider"
          class="relative flex-grow h-6 flex justify-start items-center pointer-events-auto cursor-pointer">
          <div class="w-full overflow-hidden relative h-1 rounded-full pointer-events-none">
            <div class="absolute w-full h-1 rounded-full bg-gray-700 ">
            </div>
            <div class="-translate-x-full">
              <div :style="progressBar" class="absolute w-full h-1 rounded-full bg-blue-600"></div>
            </div>
          </div>
          <div :style="progressBar" class="absolute w-full rounded-full pointer-events-none">
            <div class="h-4 w-4 rounded-full bg-blue-600 -translate-x-1/2">
            </div>
          </div>
        </div>
        <div class="text-gray-400">{{ getTime(player?.duration) }}</div>
      </div>
    </div>
  </div>

  <audio ref="player" :src="selectedUrl" crossorigin="anonymous"></audio>

</template>

<script setup>
import { PointerUtils } from '../lib/taptap/index';
import { ref, computed, onBeforeUnmount, onMounted, watch } from 'vue';
import { useSongs } from '../store/useSongs';
import { storeToRefs } from 'pinia';
const songStore = useSongs();
const { selectedSong } = storeToRefs(songStore);

const player = ref(null);
const playBtn = ref(null);
const progressSlider = ref(null);
const playing = ref(false);
const progress = ref(0);
let boundingBox = null;
const progressPointer = new PointerUtils();
const docPointer = new PointerUtils();

const playPause = () => {
  playing.value = !playing.value;
  if (playing.value) {
    player.value.play();
  } else {
    player.value.pause();
  }
};

const skip = () => {
  songStore.nextSong();
};

const previous = () => {
  songStore.previousSong();
};

const getTime = (time) => {
  time = isNaN(time) ? 0 : time;
  const minutes = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60) < 10 ? `0${Math.floor(time - minutes * 60)}` : Math.floor(time - minutes * 60);
  return `${minutes}:${seconds}`;
};

const progressBar = computed(() => {
  return `transform:translateX(${progress.value}%)`;
});


const interval = setInterval(() => {
  if (!progressPointer.isPressed) {
    progress.value = (player.value.currentTime / player.value.duration) * 100;
    songStore.currentTime = Math.floor(player.value.currentTime || 0);
  }
}, 250);

const selectedUrl = computed(() => {
  return `http://localhost:3002/${selectedSong.value.path}`;
});

onMounted(() => {
  boundingBox = progressSlider.value.getBoundingClientRect();
  progressPointer.hook();
  progressPointer.downEl = progressSlider.value;
  progressPointer.moveEl = progressSlider.value;
  progressPointer.downPrevent = true;
  progressPointer.movePrevent = true;
  progressPointer.downCb = (e) => {
    progress.value = PointerUtils.clamp((e.clientX - boundingBox.left) / boundingBox.width * 100, 0, 100);
    player.value.currentTime = (progress.value / 100) * player.value.duration;
  };
  progressPointer.moveCb = (e) => {
    if (progressPointer.isPressed) {
      progress.value = PointerUtils.clamp((e.clientX - boundingBox.left) / boundingBox.width * 100, 0, 100);
      player.value.currentTime = (progress.value / 100) * player.value.duration;
    }
  };

  docPointer.hook();
  docPointer.moveCb = (e) => {
    if (progressPointer.isPressed) {
      progress.value = PointerUtils.clamp((e.clientX - boundingBox.left) / boundingBox.width * 100, 0, 100);
      player.value.currentTime = (progress.value / 100) * player.value.duration;
    }
  };
});

window.addEventListener('resize', () => {
  boundingBox = progressSlider.value.getBoundingClientRect();
});

onBeforeUnmount(() => {
  clearInterval(interval);
});

</script>