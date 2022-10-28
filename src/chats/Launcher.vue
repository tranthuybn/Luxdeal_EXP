<template>
  <div>
    <div
      v-if="showLauncher"
      class="sc-launcher"
      :class="{ opened: isOpen }"
      :style="{ backgroundColor: colors.launcher.bg }"
      @click.prevent="isOpen ? close() : openAndFocus()"
    >
      <div v-if="newMessagesCount > 0 && !isOpen" class="sc-new-messsages-count">
        {{ newMessagesCount }}
      </div>
      <img v-if="isOpen" class="sc-closed-icon" :src="icons.close.img" :alt="icons.close.name" />
      <img v-else class="sc-open-icon" :src="icons.open.img" :alt="icons.open.name" />
    </div>
    <div class="list-icon-chat" :class="{ opened: isOpen, closed: !isOpen }">
      <div class="list-icon-chat-inner">
        <div
          class="icon-chat-item count-more"
          v-if="listItemChatBottom.length >= 7"
          @mouseover="mouseoverShowMoreOption"
          @mouseleave="mouseleaverHidenMoreOption"
        >
          <div class="wr-list-chat-more" :class="styleMoreItem">
            <ul class="list-chat-more">
              <li
                v-for="moreItem in listChatMore"
                :key="moreItem.user.id"
                @click="handleClickItemChat(moreItem)"
              >
                <span>{{ moreItem.user.name }}</span>
                <span @click.stop="handleCloseChatItem(moreItem)"
                  ><img class="close-item" :src="icons.CloseSvgIcon.img" alt="close"
                /></span>
              </li>
            </ul>
          </div>
          <span>+ {{ listItemChatBottom.length >= 7 ? listItemChatBottom.length - 5 : 0 }}</span>
        </div>
        <div
          class="icon-chat-item"
          v-for="(chatItem, index) in listChatItemFilter"
          :key="chatItem.user.id"
          :class="{ lastItem: index === listChatItemFilter.length - 1 }"
          @click="handleClickItemChat(chatItem)"
          @mouseover="mouseoverShowMoreOption"
          @mouseleave="mouseleaverHidenMoreOption"
        >
          <span
            class="chat-tooltip"
            :class="{ none: countMore > 1 && index === listChatItemFilter.length - 6 }"
            >{{ chatItem.user.name }}</span
          >
          <img :src="chatItem.user.imageUrl" :alt="chatItem.user.name" />
          <span
            class="close-chat-item"
            :class="{ none: countMore > 1 && index === listChatItemFilter.length - 6 }"
            @click.stop="handleCloseChatItem(chatItem.user.id)"
          >
            <img class="close-item" :src="icons.CloseSvgIcon.img" alt="close" />
          </span>
        </div>
      </div>
      <div
        @mouseover="mouseoverShowMoreOption"
        @mouseleave="mouseleaverHidenMoreOption"
        :class="{
          show: listItemChatBottom.length > 0 && isShowMoreOption,
          active: isShowPopupOptionMore
        }"
        class="moreOption"
        @click="togglePopupMoreOption"
        @focusout="hidenPopupMoreOption"
        tabindex="1"
      >
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 210 210"
          style="enable-background: new 0 0 210 210"
          xml:space="preserve"
        >
          <g id="XMLID_27_">
            <path
              id="XMLID_28_"
              d="M25,80C11.215,80,0,91.215,0,105s11.215,25,25,25c13.785,0,25-11.215,25-25S38.785,80,25,80z"
            />
            <path
              id="XMLID_30_"
              d="M105,80c-13.785,0-25,11.215-25,25s11.215,25,25,25c13.785,0,25-11.215,25-25S118.785,80,105,80z"
            />
            <path
              id="XMLID_71_"
              d="M185,80c-13.785,0-25,11.215-25,25s11.215,25,25,25c13.785,0,25-11.215,25-25S198.785,80,185,80z"
            />
          </g>
        </svg>
        <ul class="more-option-popup" :class="isShowPopupOptionMore ? 'show' : ''">
          <li @click="handleCloseAllChat">Đóng tất cả đoạn chát</li>
          <li @click="handleZoomOutChat">Thu nhỏ đoạn chát đang mở</li>
        </ul>
      </div>
    </div>
    <ChatWindow
      :message-list="messageList"
      :on-user-input-submit="onMessageWasSent"
      :participants="participantsFilter"
      :title="chatWindowTitle"
      :is-open="isOpen"
      :show-emoji="showEmoji"
      :show-emoji-in-text="showEmojiInText"
      :show-file="showFile"
      :show-confirmation-deletion="showConfirmationDeletion"
      :confirmation-deletion-message="confirmationDeletionMessage"
      :show-header="showHeader"
      :placeholder="placeholder"
      :show-typing-indicator="showTypingIndicator"
      :colors="colors"
      :always-scroll-to-bottom="alwaysScrollToBottom"
      :message-styling="messageStyling"
      :listChatOpen="listChatOpen"
      :popupOpened="popupOpened"
      @close="close"
      @scroll-to-top="$emit('scrollToTop')"
      @on-type="$emit('onType', $event)"
      @edit="$emit('edit', $event)"
      @remove="$emit('remove', $event)"
      @select-user="handleOpenChat"
      @get-chat-popup="handleCloseChat"
      @change-text-search="handleSearch"
    >
      <template #header>
        <slot name="header"> </slot>
      </template>
      <template #user-avatar="scopedProps">
        <slot name="user-avatar" :user="scopedProps.user" :message="scopedProps.message"> </slot>
      </template>
      <template #text-message-body="scopedProps">
        <slot
          name="text-message-body"
          :message="scopedProps.message"
          :messageText="scopedProps.messageText"
          :messageColors="scopedProps.messageColors"
          :me="scopedProps.me"
        >
        </slot>
      </template>
      <template #system-message-body="scopedProps">
        <slot name="system-message-body" :message="scopedProps.message"> </slot>
      </template>
      <template #text-message-toolbox="scopedProps">
        <slot name="text-message-toolbox" :message="scopedProps.message" :me="scopedProps.me">
        </slot>
      </template>
    </ChatWindow>
  </div>
</template>

<script>
import store from './store/'
import ChatWindow from './ChatWindow.vue'
import CloseSvgIcon from './assets/close.svg'
import CloseIcon from './assets/close-icon.png'
import OpenIcon from './assets/logo-no-bg.svg'

export default {
  components: {
    ChatWindow
  },
  props: {
    icons: {
      type: Object,
      default: function () {
        return {
          open: {
            img: OpenIcon,
            name: 'default'
          },
          close: {
            img: CloseIcon,
            name: 'default'
          },
          CloseSvgIcon: {
            img: CloseSvgIcon,
            name: 'default'
          }
        }
      }
    },
    showEmoji: {
      type: Boolean,
      default: false
    },
    autoFocus: {
      type: Boolean,
      default: true
    },
    showEmojiInText: {
      type: Boolean,
      default: false
    },
    showEdition: {
      type: Boolean,
      default: false
    },
    showDeletion: {
      type: Boolean,
      default: false
    },
    showConfirmationDeletion: {
      type: Boolean,
      default: false
    },
    confirmationDeletionMessage: {
      type: String,
      default: 'Do you really want to delete the message?'
    },
    isOpen: {
      type: Boolean,
      required: true
    },
    open: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    },
    showFile: {
      type: Boolean,
      default: false
    },
    showLauncher: {
      type: Boolean,
      default: true
    },
    showCloseButton: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    participants: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: () => ''
    },
    titleImageUrl: {
      type: String,
      default: () => ''
    },
    onMessageWasSent: {
      type: Function,
      required: true
    },
    messageList: {
      type: Array,
      default: () => []
    },
    newMessagesCount: {
      type: Number,
      default: () => 0
    },
    placeholder: {
      type: String,
      default: 'Write a message...'
    },
    showTypingIndicator: {
      type: String,
      default: () => ''
    },
    colors: {
      type: Object,
      validator: (c) =>
        'header' in c &&
        'bg' in c.header &&
        'text' in c.header &&
        'launcher' in c &&
        'bg' in c.launcher &&
        'messageList' in c &&
        'bg' in c.messageList &&
        'sentMessage' in c &&
        'bg' in c.sentMessage &&
        'text' in c.sentMessage &&
        'receivedMessage' in c &&
        'bg' in c.receivedMessage &&
        'text' in c.receivedMessage &&
        'userInput' in c &&
        'bg' in c.userInput &&
        'text' in c.userInput,
      default: function () {
        return {
          header: {
            bg: '#ffffff',
            text: '#1b1b1c'
          },
          launcher: {
            bg: '#4e8cff'
          },
          messageList: {
            bg: '#ffffff'
          },
          sentMessage: {
            bg: '#4e8cff',
            text: '#ffffff'
          },
          receivedMessage: {
            bg: '#f4f7f9',
            text: '#ffffff'
          },
          userInput: {
            bg: '#f4f7f9',
            text: '#565867'
          }
        }
      }
    },
    alwaysScrollToBottom: {
      type: Boolean,
      default: () => false
    },
    messageStyling: {
      type: Boolean,
      default: () => false
    },
    disableUserListToggle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listUserSelected: [],
      listChatOpen: [],
      listItemChatBottom: [],
      participantsFilter: this.participants,
      popupOpened: false,
      countMore: 1,
      isShowMoreOption: false,
      isShowPopupOptionMore: false
    }
  },
  computed: {
    chatWindowTitle() {
      if (this.title !== '') return this.title

      if (this.participants.length === 0) return 'You'
      if (this.participants.length > 1) return 'You, ' + this.participants[0].name + ' & others'

      return 'You & ' + this.participants[0].name
    },
    listChatItemFilter() {
      return [...this.listItemChatBottom].filter((chatItem, index) => index < 6).reverse()
    },
    listChatMore() {
      return [...this.listItemChatBottom].filter((chatItem, index) => index > 4).reverse()
    },
    styleMoreItem() {
      let className = null
      if (this.listItemChatBottom.length === 7) {
        className = 'th1'
      } else if (this.listItemChatBottom.length === 8) {
        className = 'th2'
      } else if (this.listItemChatBottom.length >= 9) {
        className = 'th3'
      }
      return className
    }
  },
  watch: {
    $props: {
      deep: true,
      immediate: true,
      handler(props) {
        for (const prop in props) {
          store.setState(prop, props[prop])
        }
      }
    }
  },
  methods: {
    handleZoomOutChat() {
      this.listItemChatBottom = [...this.listChatOpen, ...this.listItemChatBottom]
      this.listUserSelected = []
      this.listChatOpen = []
    },
    handleCloseAllChat() {
      this.listUserSelected = []
      this.listChatOpen = []
      this.listItemChatBottom = []
    },
    togglePopupMoreOption() {
      this.isShowPopupOptionMore = !this.isShowPopupOptionMore
    },
    hidenPopupMoreOption() {
      this.isShowPopupOptionMore = false
    },
    mouseoverShowMoreOption() {
      this.isShowMoreOption = true
    },
    mouseleaverHidenMoreOption() {
      this.isShowMoreOption = false
    },
    openAndFocus() {
      this.open()
      if (this.autoFocus) {
        this.$event.$emit('focusUserInput')
      }
    },
    handleOpenChat(user) {
      const messageUser = this.messageList.filter((message) => message.author === user.id)
      const userFormat = {
        user,
        popupOpened: this.popupOpened,
        messageUser
      }
      const isSelected = this.listUserSelected.includes(user.id)
      // handle show popup chat
      if (isSelected) {
        const index = this.listChatOpen.findIndex((chatPopup) => chatPopup.user.id === user.id)
        this.listChatOpen.forEach((chatPopup) => (chatPopup.popupOpened = false))
        if (this.listChatOpen.length > 0) {
          this.listChatOpen[index].popupOpened = true
        }
        if (this.listChatOpen.length === 3) {
          if (user.id !== this.listChatOpen[0].user.id) {
            this.listChatOpen.splice(index, 1)
            this.listUserSelected.splice(index, 1)
            this.listChatOpen.unshift(userFormat)
            this.listUserSelected.unshift(userFormat.user.id)
          }
        }
      } else {
        this.listUserSelected.unshift(user.id)
        this.listChatOpen.unshift(userFormat)
        if (this.listChatOpen.length > 3) {
          this.listItemChatBottom.unshift(this.listChatOpen[this.listChatOpen.length - 1])
          this.listChatOpen.splice(this.listChatOpen.length - 1, 1)
          this.listUserSelected.splice(this.listUserSelected.length - 1, 1)
        }
        const index2 = this.listItemChatBottom.findIndex((chatItem) => chatItem.user.id === user.id)
        if (index2 !== -1) {
          this.listItemChatBottom.splice(index2, 1)
          return
        }
      }
      // handle show more item
      if (this.listItemChatBottom.length >= 7) {
        this.countMore += 1
      }
    },
    handleClickItemChat(chatItem) {
      const index = this.listItemChatBottom.findIndex((item) => item.user.id === chatItem.user.id)
      this.listItemChatBottom.splice(index, 1)
      this.listItemChatBottom.unshift(this.listChatOpen[2])
      this.listChatOpen.splice(2, 1)
      this.listChatOpen.unshift(chatItem)
    },
    handleCloseChat(id) {
      const index1 = this.listChatOpen.findIndex((chatPopup) => chatPopup.user.id === id)
      const index2 = this.listUserSelected.findIndex((select) => select === id)
      if (this.listChatOpen.length >= 7) {
        this.countMore -= 1
      }
      this.listChatOpen.splice(index1, 1)
      this.listUserSelected.splice(index2, 1)
      if (this.listItemChatBottom.length > 0) {
        this.listUserSelected.push(this.listItemChatBottom[0].user.id)
        this.listChatOpen.push(this.listItemChatBottom[0])
        this.listItemChatBottom.splice(0, 1)
      }
      if (this.listItemChatBottom.length < 7) {
        this.countMore = 1
      }
    },
    handleCloseChatItem(id) {
      const index = this.listItemChatBottom.findIndex((chatItem) => chatItem.user.id === id)
      this.listItemChatBottom.splice(index, 1)
      if (this.listItemChatBottom.length < 7) {
        this.countMore = 1
      } else {
        this.countMore -= 1
      }
    },
    handleSearch(textSearch) {
      this.participantsFilter = this.participants.filter((el, i) => {
        if (el.name.includes(textSearch)) {
          return el
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.sc-launcher {
  width: 50px;
  height: 50px;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  right: 25px;
  bottom: 25px;
  border-radius: 50%;
  box-shadow: none;
  transition: box-shadow 0.2s ease-in-out;
  cursor: pointer;
  z-index: 101;
}

.sc-launcher:before {
  content: '';
  position: relative;
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: box-shadow 0.2s ease-in-out;
}

.sc-launcher .sc-open-icon,
.sc-launcher .sc-closed-icon {
  width: 50px;
  height: 50px;
  position: fixed;
  right: 25px;
  bottom: 25px;
  transition: opacity 100ms ease-in-out, transform 100ms ease-in-out;
}

.sc-launcher .sc-closed-icon {
  transition: opacity 100ms ease-in-out, transform 100ms ease-in-out;
  width: 50px;
  height: 50px;
}

.sc-launcher .sc-open-icon {
  padding: 15px;
  box-sizing: border-box;
  opacity: 1;
}

.sc-launcher.opened .sc-open-icon {
  transform: rotate(-90deg);
  opacity: 1;
}

.sc-launcher.opened .sc-closed-icon {
  transform: rotate(-90deg);
  opacity: 1;
}

.sc-launcher.opened:before {
  box-shadow: 0px 0px 400px 250px rgba(148, 149, 150, 0.2);
}

.sc-launcher:hover {
  box-shadow: 0 0px 27px 1.5px rgba(0, 0, 0, 0.2);
}

.sc-new-messsages-count {
  position: absolute;
  top: -3px;
  left: 41px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  background: #ff4646;
  color: white;
  text-align: center;
  margin: auto;
  font-size: 12px;
  font-weight: 500;
}
.list-icon-chat {
  position: fixed;
  height: 50px;
  bottom: 25px;
  right: 85px;
  width: auto;
  max-width: 360px;
  transition: all 0.3s;
  z-index: 1001;
  &.closed {
    opacity: 0;
    display: none;
  }
}

.list-icon-chat-inner {
  z-index: 100;
  display: flex;
}
.icon-chat-item {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 10px;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ffffff;
  transition: box-shadow 0.2s ease-in-out;
  &.unLastItem {
    margin-right: -10px;
  }
  &:hover {
    &:not(.count-more) {
      .chat-tooltip {
        opacity: 1;
        visibility: visible;
      }
    }
    .close-chat-item {
      transform: scale(1);
    }
  }
  > img {
    width: 100%;
    height: 50px;
    max-width: 50px;
    min-width: 50px;
    display: block;
    border-radius: 50%;
  }
}
.count-more {
  background-color: rgba(0, 0, 0, 0.45);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  letter-spacing: -1.75px;
  font-size: 14px;
  z-index: 1;
  &:hover {
    .wr-list-chat-more {
      opacity: 1;
      visibility: visible;
    }
  }
}
.chat-tooltip {
  position: absolute;
  opacity: 0;
  visibility: hidden;
  box-shadow: 0 6px 12px 4px rgb(0, 0, 0, 0.2);
  top: -46px;
  background-color: #ffffff;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  padding: 7px 12px;
  z-index: 3;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.2s;
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    display: block;
    position: absolute;
    background: #ffffff;
    bottom: -9px;
    transform: rotate(45deg) translateX(-50%);
    left: 50%;
  }
}
.close-chat-item {
  position: absolute;
  bottom: 0;
  left: 0;
  color: #000;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  transition: all 0.2s;
  transform: scale(0);
  &:hover {
    background-color: #e1e1e1;
  }
}
.wr-list-chat-more {
  position: absolute;
  left: 50%;
  bottom: -15px;
  transform: translateX(-50%);
  top: -133px;
  opacity: 0;
  visibility: hidden;
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    display: block;
    position: absolute;
    background: #ffffff;
    transform: rotate(45deg) translateX(-50%);
    left: 50%;
    bottom: 6px;
  }
  &.th1 {
    height: 100px;
    top: -96px;
  }
  &.th2 {
    height: 135px;
    top: -132px;
  }
  &.th3 {
    height: 138px;
    top: -135px;
  }
}
.list-chat-more {
  background: #ffffff;
  max-height: 124px;
  min-width: 200px;
  padding: 7px 4px 7px 10px;
  overflow-y: auto;
  box-shadow: 0 6px 12px 4px rgb(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: all 0.3s;
  &::-webkit-scrollbar {
    width: 6px;
    &:hover {
      background-color: #e5e5e5;
    }
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: #b0b3bc;
    opacity: 0;
    visibility: hidden;
    transition: all 0.6s;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  &:hover {
    &::-webkit-scrollbar-thumb {
      opacity: 1;
      visibility: visible;
    }
  }
  li {
    font-size: 13px;
    color: #1b1b1c;
    font-weight: 700;
    display: flex;
    padding: 8px 0 8px 8px;
    transition: all 0.3s;
    span {
      display: block;
      &:first-child {
        font-size: 13px;
        color: #1b1b1c;
        font-weight: 700;
        letter-spacing: -0.7px;
        width: calc(100% - 20px);
        padding-right: 10px;
      }
      &:last-child {
        width: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s;
        &:hover {
          background-color: #e1e1e1;
        }
      }
    }
    &:hover {
      background-color: #f7f7f7;
    }
  }
}
.none {
  display: none !important;
}
.close-item {
  width: 9px;
  height: 9px;
}
.moreOption {
  position: absolute;
  top: 50%;
  right: 100%;
  width: 36px;
  transform: translateY(-50%);
  border-radius: 50%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: rgb(0 0 0 / 35%) 0px 5px 15px;
  background-color: #ffffff;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s;
  &.show,
  &.active {
    opacity: 1;
  }
  svg {
    width: 18px;
  }
}
.more-option-popup {
  position: absolute;
  min-width: 300px;
  right: calc(100% + 15px);
  box-shadow: 0 6px 12px 4px rgb(0 0 0 / 20%);
  background: #fff;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.3s;
  opacity: 0;
  visibility: hidden;
  &.show {
    opacity: 1;
    visibility: visible;
  }
  li {
    font-size: 14px;
    font-weight: 500;
    padding: 7px 10px;
    display: flex;
    &::before {
      content: '';
      margin-right: 7px;
      display: block;
      background-size: auto;
      width: 20px;
      height: 20px;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAqCAYAAACz+XvQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE3N0REQjdGNTZBMDExRURCQ0YwRjBBQzQxRTcwNjY3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE3N0REQjgwNTZBMDExRURCQ0YwRjBBQzQxRTcwNjY3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTc3RERCN0Q1NkEwMTFFREJDRjBGMEFDNDFFNzA2NjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTc3RERCN0U1NkEwMTFFREJDRjBGMEFDNDFFNzA2NjciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6EELmZAAACEElEQVR42uxVTShEURSe97ylvWmSlbEQi5EyK0XK7ySlyMaaFQs2ykLJwsaKtc2wUBJDNpQVNZnFSGEslGT2lmp85/XJdb135814SvLV9+7r3nO/e879OcfqnRmK6DheO3DQjIODYDsY49ATmAUz4DbmvupzbQ+xCTR34Bh4CvaDdWQ/+2TsjrafYKkewmAVzQA4hf6ziAGw7URzBK7Ddu6LhxQbBTvKiQloI16Pcu6HIF2fBlth+BIJCNq2SlTv4Vugwz2bDOKZIfxNMG7zNK91MRjNgw0ekxtkzCP8K9GyeTX2PBY+B3NcXfUkxzEd+6IlId/ID1Yp+ISyC46wy/332hrYNsqpi4f14LPhJEe4+r6fGCEaMTsSMkTwEYwaTk/CTJG76p5qEI0nEbwEu037J2Eq4fuJikbW5kMf9jBIggl1z/if4JgOiSAT/sVmCloANzBQW4VYLZPEgmjZDCWN5hDMVyJK2zwzTvpTtmEK2gGLhpPUw7yQOWr6svSMzayxLO+bT/JEufhRnqYcYjPDTBszNg3i4BbYxVtQJDPsk7G4LuZ6WCqVQn8pocLpm039V72/XvVq8BHlKMRWqr0qjcmmh/vz2x5x0FT1KoVb9USwje/1uxCNdser6mFPFgMeytKPVz1HqXoFn5WDwlz1qkDZqlcp3KongtuSfYOk/TIXu0W0/qveL6x6bwIMAKwwP7DxDOqhAAAAAElFTkSuQmCC');
    }
    &:first-child {
      &::before {
        background-position: 0 0;
      }
    }
    &:last-child {
      &::before {
        background-position: 20px 20px;
      }
    }
    &:hover {
      background-color: #f7f7f7;
    }
  }
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    display: block;
    position: absolute;
    background: #ffffff;
    transform: rotate(45deg) translateY(-50%);
    top: 50%;
    right: -2px;
  }
}
</style>
