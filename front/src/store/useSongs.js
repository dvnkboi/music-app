import { defineStore } from "pinia";

export const useSongs = defineStore("songStore", {
  state: () => ({
    isPlaying: false,
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
    async setSelected(song) {
      this.selectedSong = song;
      // this.isPlaying = false;
      if (this.currentCategory.id !== song.category) {
        await this.setCurrentCategoryById(song.category);
      }
      this.currentIndex = this.playlist.findIndex((s) => song.id === s.id);
    },
    setPlaylist(playlist, startAt = 0) {
      this.playlist = playlist;
      this.setSelected(playlist[startAt]);
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
      this.playlist = (await (await fetch(`http://localhost:3002/api/v1/song?category=${category.id}`)).json()).data.data;
    },
    async setCurrentCategoryById(category) {
      category = (await (await fetch(`http://localhost:3002/api/v1/category/id=${category}`)).json()).data.data[0];
      console.log(category);
      this.currentCategory = category;
      this.playlist = (await (await fetch(`http://localhost:3002/api/v1/song?category=${category.id}`)).json()).data.data;
    },
    setTime(time) {
      this.currentTime = time;
    },
    async fetchCategories(limit = 3, page = 1) {
      const categories = await fetch(`http://localhost:3002/api/v1/category?fields=name,background&limit=${limit}&page=${page}`);
      this.categories = (await categories.json()).data.data;
      return this.categories;
    },
    async fetchSongs(category, limit = 10, page = 1) {
      const catInfo = (await (await fetch(`http://localhost:3002/api/v1/category?name=${category}`)).json()).data.data[0];
      if (catInfo) {
        return (await (await fetch(`http://localhost:3002/api/v1/song?category=${catInfo.id}&limit=${limit}&page=${page}`)).json()).data.data;
      }
    }
  }
});