<template>
  <div class="sc-header" :style="{ color: colors.header.bg }">
    <input class="sc-search" type="text" placeholder="Tìm theo tên tài khoản..." name="search2" />
    <img
      :src="SearchIcon"
      :style="{
        position: 'absolute',
        right: '25px',
        top: '31px',
        width: '13px',
        height: '13px',
        opacity: 0.3
      }"
    />
  </div>
</template>

<script>
import { mapState } from './store/'
import CloseIcon from './assets/close-icon-big.png'
import SearchIcon from './assets/search-icon.svg'

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
    }
  },
  data() {
    return {
      inUserList: false,
      SearchIcon: SearchIcon
    }
  },
  computed: {
    ...mapState(['disableUserListToggle', 'titleImageUrl', 'showCloseButton'])
  },
  methods: {
    toggleUserList() {
      this.inUserList = !this.inUserList
      this.$emit('userList', this.inUserList)
    }
  }
}
</script>

<style scoped>
.sc-header {
  padding: 20px 15px;
  position: relative;
  box-sizing: border-box;
  display: flex;
}

.sc-search {
  background: #ffffff;
  border: 1px solid #b1b1b1;
  border-radius: 5px;
  font-size: 12px;
  line-height: 14px;
  color: #9ea1a5;

  /* Inside auto layout */

  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  width: 100%;
  height: 35px;
  padding: 0 30px 0 10px;
}

.sc-header--img {
  border-radius: 50%;
  align-self: center;
  padding: 10px;
}

.sc-header--title {
  align-self: center;
  padding: 10px;
  flex: 1;
  user-select: none;
  font-size: 20px;
}

.sc-header--title.enabled {
  cursor: pointer;
  border-radius: 5px;
}

.sc-header--title.enabled:hover {
  box-shadow: 0px 2px 5px rgba(0.2, 0.2, 0.5, 0.1);
}

.sc-header--close-button {
  width: 40px;
  align-self: center;
  height: 40px;
  margin-right: 10px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 5px;
  margin-left: auto;
}

.sc-header--close-button:hover {
  box-shadow: 0px 2px 5px rgba(0.2, 0.2, 0.5, 0.1);
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
