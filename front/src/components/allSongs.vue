<template>
  <div class=" flex justify-start items-start gap-2 px-10 py-5">
    <Song @click="changeSong(song)" :key="song?.id" :song="song" v-for="song in songs"></Song>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useSongs } from '../store/useSongs';
import Song from './song.vue';
const songs = ref([]);
songs.value = (await axios.get('http://localhost:3001/songs')).data;


const songStore = useSongs();
songStore.songs = songs.value;

const changeSong = (song) => {
  songStore.setSelected(song);
}


</script>

<style>
</style>