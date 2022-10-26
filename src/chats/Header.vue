<template>
  <div class="sc-header" :style="{ background: colors.header.bg, color: colors.header.text }">
    <img v-if="titleImageUrl" class="sc-header--img" :src="titleImageUrl" alt="avatar" />
    <div v-if="!disableUserListToggle" class="sc-header--title enabled" @click="toggleUserList">
      {{ title }}
    </div>
    <div v-else class="sc-header--title">{{ title }}</div>

    <div
      v-if="showCloseButton"
      class="sc-header--close-button"
      @click="getChatPopup(chatPopupSelect.user.id)"
    >
      <img :src="icons.close.img" :alt="icons.close.name" />
    </div>
  </div>
</template>

<script>
import { mapState } from './store/'
import CloseIcon from './assets/close.svg'

export default {
  props: {
    icons: {
      type: Object,
      default: function () {
        return {
          close: {
            img: CloseIcon,
            name: 'default'
          }
        }
      }
    },
    title: {
      type: String,
      required: true
    },
    colors: {
      type: Object,
      required: true
    },
    chatPopupSelect: {
      type: Object,
      required: true
    },
    titleImageUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      inUserList: false
    }
  },
  computed: {
    ...mapState(['disableUserListToggle', 'showCloseButton'])
  },
  methods: {
    toggleUserList() {
      this.inUserList = !this.inUserList
      this.$emit('userList', this.inUserList)
    },
    getChatPopup(chatItem) {
      this.$emit('getChatPopup', chatItem)
    }
  }
}
</script>

<style scoped>
.sc-header {
  min-height: 74px;
  padding: 10px;
  border-bottom: 1px solid #eeeeee;
  position: relative;
  box-sizing: border-box;
  display: flex;
}

.sc-header--img {
  border-radius: 50%;
  align-self: center;
  width: 48px;
  height: 48px;
}

.sc-header--title {
  align-self: center;
  padding: 0 14px;
  flex: 1;
  user-select: none;
  font-size: 13px;
  font-weight: 700;
}

.sc-header--title.enabled {
  cursor: pointer;
  border-radius: 5px;
}

.sc-header--close-button {
  width: 40px;
  align-self: center;
  height: 40px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 5px;
  margin-left: auto;
}

.sc-header--close-button img {
  width: 100%;
  height: 100%;
  padding: 13px;
  box-sizing: border-box;
}

@media (max-width: 450px) {
  .sc-header {
    border-radius: 0px;
  }
}
</style>
