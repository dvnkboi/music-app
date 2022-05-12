<template>
  <div :class="[props.background || 'from-gray-400 to-gray-700']"
    class="h-40 w-72 bg-gradient-to-br rounded-3xl flex justify-start items-end text-gray-900 relative overflow-hidden group hover:-translate-y-1 transition duration-300 cursor-pointer">
    <div class="flex justify-between items-center px-5 py-2 w-full relative z-50">
      <div class="flex justify-start items-start flex-col">
        <h1 class="text-3xl font-bold group-hover:-translate-y-1 transition duration-300">{{ props.title }}</h1>
      </div>
    </div>
  </div>

</template>


<script setup>
import { computed } from '@vue/reactivity';

const props = defineProps({
  background: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
});

</script>

<style>
.rose {
  @apply bg-gradient-to-br from-rose-500 to-rose-700;
}

.green {
  @apply bg-gradient-to-br from-green-500 to-green-700;
}

.yellow {
  @apply bg-gradient-to-br from-yellow-500 to-yellow-700;
}

.blue {
  @apply bg-gradient-to-br from-blue-500 to-blue-700;
}

.red {
  @apply bg-gradient-to-br from-red-500 to-red-700;
}

.cyan {
  @apply bg-gradient-to-br from-cyan-500 to-cyan-700;
}

.purple {
  @apply bg-gradient-to-br from-purple-500 to-purple-700;
}

.gray {
  @apply bg-gradient-to-br from-gray-500 to-gray-700;
}

.orange {
  @apply bg-gradient-to-br from-orange-500 to-orange-700;
}
</style>