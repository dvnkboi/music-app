import { defineStore } from "pinia";

export const useSongs = defineStore("songStore", {
  state: () => ({
    playlist: [],
    categories: [],
    selectedSong: {
      path: "",
    },
    currentIndex: 0,
    isPlaying: false,
    currentCategory: "",
    currentTime: 0,
  }),
  getters: {
    getPlaylist: (state) => state.playlist,
    getSong: (state) => (id) => state.playlist.find((song) => song.id === id),
    getCategories: (state) => state.categories,
  },
  actions: {
    setSelected(song) {
      this.selectedSong = song;
    },
    setPlaylist(playlist, startAt = 0) {
      this.playlist = playlist;
      this.selectedSong = playlist[startAt];
    },
    nextSong() {
      if (this.currentIndex < this.playlist.length - 1) {
        this.currentIndex++;
        this.selectedSong = this.playlist[this.currentIndex];
      }
      else {
        this.currentIndex = 0;

        this.selectedSong = this.playlist[this.currentIndex];
      }
    },
    previousSong() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.selectedSong = this.playlist[this.currentIndex];
      }
    },
    async setCurrentCategory(category) {
      category = (await (await fetch(`http://localhost:3002/api/v1/category?name=${category}`)).json()).data.data[0];
      this.currentCategory = category;
      this.playlist = await fetch(`http://localhost:3002/api/v1/song?category=${category.id}`);
      this.playlist = (await this.playlist.json()).data.data;
    },
    setTime(time) {
      this.currentTime = time;
    },
    async fetchCategories() {
      const categories = await fetch("http://localhost:3002/api/v1/category?fields=name,background");
      this.categories = (await categories.json()).data.data;
      return this.categories;
    }
  }
});