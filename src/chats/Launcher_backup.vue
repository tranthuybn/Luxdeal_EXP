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
        <div class="icon-chat-item count-more" v-if="countMore > 1">
          <ul class="list-chat-more">
            <li
              v-for="moreItem in listChatMore"
              :key="moreItem.user.id"
              @click="handleClickMoreChatItem(moreItem)"
            >
              <span>{{ moreItem.user.name }}</span>
              <span><img class="close-item" :src="icons.CloseSvgIcon.img" alt="close" /></span>
            </li>
          </ul>
          <span>+ {{ countMore }}</span>
        </div>
        <div
          class="icon-chat-item"
          v-for="(chatItem, index) in listChatItemFilter"
          :key="chatItem.user.id"
          :class="{ lastItem: index === listChatItemFilter.length - 1 }"
          @click="handleClickItemChat(chatItem)"
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
    </div>
    <ChatWindow
      :message-list="messageList"
      :on-user-input-submit="onMessageWasSent"
      :participants="participants"
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
      @scrollToTop="$emit('scrollToTop')"
      @onType="$emit('onType', $event)"
      @edit="$emit('edit', $event)"
      @remove="$emit('remove', $event)"
      @selectUser="handleOpenChat"
      @getChatPopup="handleCloseChat"
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
      listChatMore: [],
      listItemChatBottom: [],
      popupOpened: false,
      countMore: 1
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
    listChatMores() {
      return [...this.listItemChatBottom].filter((chatItem, index) => index >= 4).reverse()
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
    openAndFocus() {
      this.open()
      if (this.autoFocus) {
        this.$event.$emit('focusUserInput')
      }
    },
    handleOpenChat(user) {
      console.log(this.listChatMores)
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
      if (this.countMore === 2) {
        this.listChatMore = [
          this.listItemChatBottom[this.listItemChatBottom.length - 1],
          this.listItemChatBottom[this.listItemChatBottom.length - 2]
        ]
      } else if (this.countMore > 2) {
        this.listChatMore.push(
          this.listItemChatBottom[this.listItemChatBottom.length - this.countMore]
        )
      }
    },
    handleClickItemChat(chatItem) {
      const index = this.listItemChatBottom.findIndex((item) => item.user.id === chatItem.user.id)
      this.listItemChatBottom.splice(index, 1)
      this.listChatOpen.splice(2, 1)
      this.listChatOpen.unshift(chatItem)
      if (this.countMore > 1) {
        this.countMore -= 1
      }
    },
    handleClickMoreChatItem(moreChatItem) {
      const index1 = this.listItemChatBottom.findIndex(
        (item) => item.user.id === moreChatItem.user.id
      )
      const index2 = this.listChatMore.findIndex((item) => item.user.id === moreChatItem.user.id)
      this.listItemChatBottom.splice(index1, 1)
      this.listChatMore.splice(index2, 1)
      this.listChatOpen.splice(2, 1)
      this.listChatOpen.unshift(moreChatItem)
      if (this.countMore > 1) {
        this.countMore -= 1
      }
      console.log(this.listItemChatBottom)
      console.log(this.listChatMore)
      console.log(this.listChatOpen)
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
      }
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
.list-chat-more {
  position: absolute;
  right: calc(100% + 15px);
  bottom: -15px;
  background: #ffffff;
  max-height: 124px;
  min-width: 200px;
  padding: 7px 4px 7px 10px;
  overflow-y: auto;
  box-shadow: 0 6px 12px 4px rgb(0, 0, 0, 0.2);
  border-radius: 10px;
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
</style>
