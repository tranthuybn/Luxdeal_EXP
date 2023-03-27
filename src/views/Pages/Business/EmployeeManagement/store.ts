import { defineStore } from 'pinia'

export const localStore = defineStore({
  id: 'local',
  state: () => ({
    data: {}
  }),
  getters: {
    getData() : any {
      return this.data
    }
  },
  actions: {
    setData(data) {
      this.data = data
    }
  }
})