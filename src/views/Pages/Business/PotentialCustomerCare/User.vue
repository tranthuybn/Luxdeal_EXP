<template>
  <section>
    <div
      class="flex justify-between hover-message py-4"
      @click="onClick"
      :class="{ selected: selected }"
    >
      <div class="media message-list" :class="{ active: user.hasNewMessages }">
        <span class="brage"><img :src="defaultImg" alt="..." /></span>
        <div class="media-body pl-2">
          <div class="message-list__name">{{ user.Name ? user.Name : user.UserName }}</div>
          <div class="message-list__description truncate-h" data-line="1">{{ getLastMessage }}</div>
        </div>
      </div>
      <div class="message-box__note" style="padding-right: 4px">
        <div>{{ moment(user.message.createdDate).format('DD/MM/YYYY') }}</div>
      </div>
    </div>
  </section>
</template>

<script>
import moment from 'moment'
import defaultImg from '@/assets/svgs/chat/default.jpg'
export default {
  name: 'User',
  props: {
    user: Object,
    message: Array,
    selected: Boolean,
    typeMessage: String
  },
  data() {
    return {
      moment,
      defaultImg,
      searchPeople: ''
    }
  },
  computed: {
    status() {
      return this.user.connected ? 'online' : 'offline'
    },
    getLastMessage() {
      return this.user.message.slice(-1).pop().messages.content
    }
  },
  watch: {
    user: {
      immediate: true,
      handler() {
        this.sortMessage()
      }
    },
    typeMessage: {
      handler() {
        this.sortMessage()
      }
    }
  },
  created() {
    this.sortMessage()
  },
  methods: {
    onClick() {
      this.$emit('select')
    },
    sortMessage() {
      // eslint-disable-next-line vue/no-mutating-props
      this.user.message.sort(function (a, b) {
        var c = new Date(a.messages.createdDate)
        var d = new Date(b.messages.createdDate)
        return c - d
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/chat.scss';
</style>
