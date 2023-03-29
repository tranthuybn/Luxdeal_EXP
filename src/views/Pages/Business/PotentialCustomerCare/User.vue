<template>
  <section>
    <div
      class="flex justify-between hover-message py-4"
      @click="onClick"
      :class="{ selected: selected }"
    >
      <div class="media message-list" :class="{ active: user.hasNewMessages }">
        <el-badge :is-dot="unreadMessage" class="brage" type="primary">
          <img :src="defaultImg" alt="..."
        /></el-badge>
        <div class="media-body pl-2">
          <div class="message-list__name">{{ user.userName }}</div>
          <div class="message-list__description truncate-h" data-line="1">{{ getLastMessage }}</div>
        </div>
      </div>
      <div class="message-box__note" style="padding-right: 4px; font-size: 12px;">
        <div v-if="user.countMessage!=0">
          <div style="color: red;font-size: 17px; text-align: right;">{{ user.countMessage }}<sup>+</sup></div>
        </div>
        <div>{{ moment(user.createAT).format('DD/MM/YYYY') }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ElBadge } from 'element-plus'
</script>
<script>
import moment from 'moment'
import { useCache } from '@/hooks/web/useCache'
import { usePermissionStore } from '@/store/modules/permission'
import defaultImg from '@/assets/svgs/chat/default.jpg'
import { getMessageChat,getGroupIDChat } from '@/api/ChatBot'
import { ERP_DOMAIN_CHATS_URL } from '@/utils/API_URL'
// import { el } from 'element-plus/es/locale'
const { wsCache } = useCache()
const permissionStore = usePermissionStore()
export default {
  name: 'User',
  props: {
    user: Object,
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
      return this.user.phone
    },
    unreadMessage() {
      return this.user.unreadMessage
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
    async onClick() {
      //this.user.message.slice(-1).pop().newMessage = false
     

      this.$emit('select')
      var a = {
        group_id : null,
        user_id : wsCache.get(permissionStore.getUserIDSentChat),
        user_id_sent: this.user._id,
        name : this.user.userName,
        name_sent: wsCache.get(permissionStore.getUserNameSentChat),
      }
      wsCache.set(permissionStore.getUserNameReceive, this.user.userName )
      wsCache.set(permissionStore.getUserIDReceive, this.user._id )
      const idGroup = await getGroupIDChat(JSON.stringify(a))
      if(idGroup.message == null){
        a.group_id = null
      } else{
        a.group_id = idGroup.message._id;
      wsCache.set(permissionStore.getGroupChatID, idGroup.message._id );
      }

      const res = await getMessageChat(JSON.stringify(a))
      if(res){
        this.$emit('send-data', { message: res})
      }
    },
    sortMessage() {
      // // eslint-disable-next-line vue/no-mutating-props
      // this.user.sort(function (a, b) {
      //   var c = new Date(a.createAT)
      //   var d = new Date(b.createAT)
      //   return c - d
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/chat.scss';
</style>
