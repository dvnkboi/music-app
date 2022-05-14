import { defineStore } from "pinia";
import localforage from "localforage";

export const useSongs = defineStore("songStore", {
  state: () => ({
    isPlaying: false,
    playlist: {
      songs: [],
      currentIndex: 0,
      type: "",
    },
    categories: [],
    selectedSong: {
      path: "",
    },
    isPlaying: false,
    currentCategory: {},
    currentTime: 0,
    likedSongs: {},
    previousUser: {},
    user: {
      name: "User",
      color: "rose"
    }
  }),
  getters: {
    getPlaylist: (state) => state.playlist,
    getSongFromPlaylist: (state) => (id = "0") => state.playlist.songs.find((song) => song.id === id),
    getCategories: (state) => state.categories,
    isLiked: (state) => (id = "0") => state.likedSongs?.[id] ? true : false,
  },
  actions: {

    // player logic
    async setSelected(song, type = "pop") {
      if (!song) return;
      this.selectedSong = song;
      // this.isPlaying = false;
      if (type === "liked") {
        this.playlist = {
          songs: Object.values(this.likedSongs),
          currentIndex: this.playlist.currentIndex,
          type: "liked",
        };
      }
      else {
        if (this.playlist.type != type || this.currentCategory.id !== song.category) {
          console.log("category changed");
          await this.setCurrentCategoryById(song.category);
        }
      }
      this.playlist.currentIndex = this.playlist.songs.findIndex((s) => song.id === s.id);
      console.log(this.playlist);
      this.playlist.type = type;
      await this.savePlayList(this.playlist);
    },
    async setPlaylist(playlist, startAt = null) {
      this.playlist = playlist;
      await this.setSelected(playlist.songs?.[startAt == null ? playlist.cyrrentIndex || 0 : startAt], playlist.type);
    },
    async setSelectedIndex(index) {
      await this.setSelected(this.playlist.songs[index]);
    },
    nextSong() {
      if (this.playlist.currentIndex < this.playlist.songs.length - 1) {
        this.playlist.currentIndex++;
        this.selectedSong = this.playlist.songs[this.playlist.currentIndex];
      }
      else {
        this.playlist.currentIndex = 0;
        this.selectedSong = this.playlist.songs[this.playlist.currentIndex];
      }
    },
    previousSong() {
      if (this.playlist.currentIndex > 0) {
        this.playlist.currentIndex--;
        this.selectedSong = this.playlist.songs[this.playlist.currentIndex];
      }
    },
    setTime(time) {
      this.currentTime = time;
    },

    //server data fetching
    async setCurrentCategory(category) {
      category = (await (await fetch(`http://localhost:3002/api/v1/category?name=${category}`)).json()).data.data[0];
      this.currentCategory = category;
      this.playlist.songs = (await (await fetch(`http://localhost:3002/api/v1/song?category=${category.id}`)).json()).data.data;
    },
    async setCurrentCategoryById(category) {
      category = (await (await fetch(`http://localhost:3002/api/v1/category/${category}`)).json()).data.doc;
      this.currentCategory = category;
      this.playlist.songs = (await (await fetch(`http://localhost:3002/api/v1/song?category=${category.id}`)).json()).data.data;
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
    },

    //liked songs and local storage
    async likeSong(song) {
      this.likedSongs[song.id] = song;
      await this.flushToStorage();
      if (this.playlist.type == "liked") this.playlist.songs = Object.values(this.likedSongs);
    },
    async dislikeSong(song) {
      delete this.likedSongs[song.id];
      await this.flushToStorage();
      if (this.playlist.type == "liked") this.playlist.songs = Object.values(this.likedSongs);
    },
    async flushToStorage() {
      await localforage.setItem(`likedSongs_${this.user.name}`, JSON.stringify(this.likedSongs));
    },
    async getStoredSongs() {
      this.likedSongs = JSON.parse(await localforage.getItem(`likedSongs_${this.user.name}`)) || {};
    },
    async setUser(user) {
      this.previousUser = this.user;
      this.user = user.name && user.name.length > 0 ? user : { name: "User", color: "rose" };
      await localforage.setItem(`user`, JSON.stringify(this.user));
      await this.getStoredSongs();
    },
    async rollbackUser() {
      this.user = this.previousUser.name && this.previousUser.name != '' ? this.previousUser : { name: "User", color: "rose" };
      await localforage.setItem(`user`, JSON.stringify(this.user));
      await this.getStoredSongs();
    },
    async getUser() {
      const user = JSON.parse(await localforage.getItem(`user`));
      this.user = Object.values(user || {}).length > 0 ? user : { name: "User", color: "blue" };
      await this.getStoredSongs();
      return this.user;
    },
    async savePlayList(playlist) {
      const reducedPlaylist = JSON.parse(JSON.stringify(playlist));
      delete reducedPlaylist.songs;
      await localforage.setItem(`playlist_${this.user.name}`, JSON.stringify(reducedPlaylist));
    },
    async playLiked() {
      const likedSongs = Object.values(this.likedSongs);
      this.playlist.songs = likedSongs;
      this.playlist.currentIndex = 0;
      this.playlist.type = "liked";
      this.setSelected(this.playlist.songs[0]);
      await this.savePlayList(this.playlist);
    },
    async getPlayList() {
      await this.getUser();
      await this.getStoredSongs();
      const playlist = JSON.parse(await localforage.getItem(`playlist_${this.user.name}`));
      if (!playlist) {
        await this.setPlaylist({
          songs: [],
          currentIndex: 0,
          type: "pop",
        });
        await this.setCurrentCategory(this.playlist.type);
      }
      if (playlist.type == "liked") {
        await this.setPlaylist(playlist);
        this.playlist.songs = Object.values(this.likedSongs);
      }
      else {
        await this.setPlaylist(playlist);
        await this.setCurrentCategory(playlist.type);
      }
      this.setSelected(this.playlist.songs[this.playlist.currentIndex], this.playlist.type);
      return this.playlist;
    },
  }
});