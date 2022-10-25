<template>
  <div class="user-list" :style="{ background: userListColor.userList.bg }">
    <div
      class="user-item"
      v-for="user in participants"
      :key="user.id"
      @click="handleSelectUser(user)"
    >
      <div class="user-avater">
        <img :src="user.imageUrl" class="img-msg" />
      </div>
      <div class="user-text">
        <h4 class="user-name">{{ user.name }}</h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    participants: {
      type: Array,
      required: true
    },
    colors: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    userListColor() {
      const defaultColors = {
        userList: {
          bg: '#FFFFFF',
          text: '#000000'
        }
      }
      return Object.assign(defaultColors, this.colors)
    }
  },
  methods: {
    handleSelectUser(user) {
      this.$emit('selectUser', user)
    }
  }
}
</script>

<style scoped lang="scss">
.user-list {
  height: 100%;
  overflow: auto;
  padding-bottom: 20px;
  &::-webkit-scrollbar {
    width: 6px;
    background-color: #e5e5e5;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: #b0b3bc;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
}

.user-item {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  padding: 7.5px 15px;
  transition: all 0.4s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
}

.user-avater {
  width: 48px;
  height: 48px;
}

.user-name {
  font-size: 12px;
  line-height: 14px;
  font-weight: 700;
  color: #1b1b1c;
}

.user-text {
  width: calc(100% - 48px);
  padding-left: 13px;
}

.img-msg {
  border-radius: 50%;
  width: 100%;
  height: auto;
}

.user-element {
  font-size: 20px;
  vertical-align: middle;
}
</style>
