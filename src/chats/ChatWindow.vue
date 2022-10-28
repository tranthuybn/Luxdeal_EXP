<template>
  <div>
    <div class="scc-chat-window" :class="{ opened: isOpen, closed: !isOpen }">
      <!-- <div style="color: red" @click="handleSelectUser">sss</div> -->
      <HeaderList
        :title="title"
        :colors="colors"
        @close="$emit('close')"
        @userList="handleUserListToggle"
        @changeTextSearch="changeTextSearch"
      >
        <template>
          <slot name="header"> </slot>
        </template>
      </HeaderList>
      <UserList :colors="colors" :participants="participants" @select-user="selectUser" />
    </div>
    <div
      class="sc-chat-window"
      v-if="listChatOpen.length > 0"
      :class="{ opened: isOpen, closed: !isOpen }"
    >
      <div
        class="sc-chat-window-inner"
        v-for="(chatPopup, index) in listChatOpenFilter"
        :key="chatPopup.user.id"
        :class="{ popupOpened: chatPopup.popupOpened }"
        :style="{
          right: index === 0 ? '320px' : `${320 + chatPosition * index}px`
        }"
      >
        <Header
          v-if="showHeader"
          :title="chatPopup.user.name"
          :titleImageUrl="chatPopup.user.imageUrl"
          :colors="colors"
          :chatPopupSelect="chatPopup"
          @close="$emit('close')"
          @userList="handleUserListToggle"
          @getChatPopup="getChatPopup"
        >
          <template>
            <slot name="header"> </slot>
          </template>
        </Header>
        <MessageList
          :messages="messages"
          :participants="participants"
          :show-typing-indicator="showTypingIndicator"
          :colors="colors"
          :always-scroll-to-bottom="alwaysScrollToBottom"
          :show-confirmation-deletion="showConfirmationDeletion"
          :confirmation-deletion-message="confirmationDeletionMessage"
          :message-styling="messageStyling"
          @scrollToTop="$emit('scrollToTop')"
          @remove="$emit('remove', $event)"
        >
          <template #user-avatar="scopedProps">
            <slot name="user-avatar" :user="scopedProps.user" :message="scopedProps.message">
            </slot>
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
        </MessageList>
        <UserInput
          :show-emoji="showEmoji"
          :show-emoji-in-text="showEmojiInText"
          :on-submit="onUserInputSubmit"
          :suggestions="getSuggestions()"
          :show-file="showFile"
          :placeholder="placeholder"
          :colors="colors"
          @onType="$emit('onType', $event)"
          @edit="$emit('edit', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import HeaderList from './HeaderList.vue'
import MessageList from './MessageList.vue'
import UserInput from './UserInput.vue'
import UserList from './UserList.vue'

export default {
  components: {
    Header,
    MessageList,
    UserInput,
    UserList,
    HeaderList
  },
  props: {
    showEmoji: {
      type: Boolean,
      default: false
    },
    showEmojiInText: {
      type: Boolean,
      default: false
    },
    showFile: {
      type: Boolean,
      default: false
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
      required: true
    },
    onUserInputSubmit: {
      type: Function,
      required: true
    },
    messageList: {
      type: Array,
      default: () => []
    },
    isOpen: {
      type: Boolean,
      default: () => false
    },
    placeholder: {
      type: String,
      required: true
    },
    showTypingIndicator: {
      type: String,
      required: true
    },
    colors: {
      type: Object,
      required: true
    },
    alwaysScrollToBottom: {
      type: Boolean,
      required: true
    },
    messageStyling: {
      type: Boolean,
      required: true
    },
    showConfirmationDeletion: {
      type: Boolean,
      required: true
    },
    confirmationDeletionMessage: {
      type: String,
      required: true
    },
    listChatOpen: {
      type: Array,
      required: true,
      default: () => []
    },
    popupOpened: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      showUserList: true,
      chatPosition: 405
    }
  },
  computed: {
    messages() {
      let messages = this.messageList
      return messages
    },
    listChatOpenFilter() {
      return [...this.listChatOpen].filter((chatItem, index) => index < 3).reverse()
    }
  },
  methods: {
    handleUserListToggle(showUserList) {
      this.showUserList = showUserList
    },
    getSuggestions() {
      return this.messages.length > 0 ? this.messages[this.messages.length - 1].suggestions : []
    },
    selectUser(user) {
      this.$emit('selectUser', user)
    },
    getChatPopup(chatItem) {
      this.$emit('getChatPopup', chatItem)
    },
    changeTextSearch(textSearch) {
      this.$emit('changeTextSearch', textSearch)
    }
  }
}
</script>

<style scoped>
.sc-chat-window-inner {
  width: 400px;
  height: calc(100% - 120px);
  max-height: 590px;
  position: fixed;
  right: 320px;
  bottom: 100px;
  box-sizing: border-box;
  box-shadow: 0px 7px 40px 2px rgba(148, 149, 150, 0.1);
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  animation: fadeIn;
  animation-duration: 0.3s;
  animation-timing-function: ease-in-out;
  z-index: 1000;
}

.scc-chat-window {
  width: 290px;
  height: 100%;
  max-height: calc(100% - 120px);
  position: fixed;
  right: 25px;
  bottom: 100px;
  box-sizing: border-box;
  box-shadow: 0px 7px 40px 2px rgba(148, 149, 150, 0.1);
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  animation: fadeIn;
  animation-duration: 0.3s;
  animation-timing-function: ease-in-out;
  z-index: 1000;
}

.sc-chat-window.closed {
  opacity: 0;
  display: none;
  bottom: 90px;
}

.scc-chat-window.closed {
  opacity: 0;
  display: none;
  bottom: 90px;
}

@keyframes fadeIn {
  0% {
    display: none;
    opacity: 0;
  }

  100% {
    display: flex;
    opacity: 1;
  }
}

.sc-message--me {
  text-align: right;
}
.sc-message--them {
  text-align: left;
}

@media (max-width: 450px) {
  .sc-chat-window {
    width: 100%;
    height: 100%;
    max-height: 100%;
    right: 0px;
    bottom: 0px;
    border-radius: 0px;
  }
  .sc-chat-window {
    transition: 0.1s ease-in-out;
  }
  .sc-chat-window.closed {
    bottom: 0px;
  }
}
</style>
