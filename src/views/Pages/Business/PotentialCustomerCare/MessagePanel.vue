<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <el-card class="h-full">
    <div class="flex message-box__header items-center justify-between h-1/10 px-4">
      <div class="flex message-box__customer items-center">
        <img :src="defaultImg" alt="..." width="50" height="50" />
        <span class="pl-2">{{ user.userName }}</span>
      </div>
      <div class="flex items-center w-1/4">
        <el-input :placeholder="`${t('reuse.findContent')} ...`" v-model="search" :suffix-icon="searchIcon"
          class="p-4 h-70px" />
        <div id="showDocument">
          <el-button :icon="leftArrow" class="!pl-4 !border-0 !font-bold hidden" @click="showDocumentList(0)">Tài
            liệu</el-button>
        </div>
      </div>
    </div>
    <el-alert v-if="noMoreLoadData" title="Đã hiển thị hết tin nhắn" type="success" effect="dark" />
    <!-- <p v-if="scrollLoading" class="text-center"> Đang tải thêm ... </p> -->
    <section class="h-650px">
      <ul class="message-box__body !h-full !dark:bg-[var(--el-bg-color)] border-top-1 dark:border-transparent">
        <div class="messages-chat" id="messages" style=" overflow: auto;">
        </div>
        <div class="content-message dark:bg-[var(--el-bg-color)]" id="box-product">
          <section class="friend-send" >
            <div class="media">
              <div class="media-body h-250px ml-0">
                  <el-card class="w-1/3  m-auto">
                    <div class="flex border-bottom-1">
                      <div class="basis-1/2"><img src="@/assets/imgs/avatar.jpg" class="w-full" />
                      </div>
                      <div class="pl-4">
                        <div class="font-bold">productBrand</div>
                        <div>Túi </div>
                        <div>1000000 đ</div>
                      </div>
                    </div>
                    <div class="flex flex-col">
                      <div class="my-2 font-bold text-center">{{ t('reuse.negotiationPrice') }}
                        20000 đ</div>
                      <div  class="flex justify-center">
                        <el-button class="w-full !font-bold" @click="documentAction(0)">{{
                          t('reuse.cancel')
                        }}</el-button>
                        <el-button class="w-full !bg-black !font-bold" @click="documentAction(1)"><span
                            class="text-white">Đồng ý</span></el-button>
                      </div>
                    </div>
                  </el-card>
              </div>
            </div>
          </section>
        </div>
      </ul>
    </section>
    <div class="message-box__footer p-3 h-1/10">
      <el-form class="message-box__send h-full flex-grow pr-4" ref="messageInput" :model="messageInputForm"
        @submit.native.prevent>
        <el-form-item prop="chatContent" class="h-full relative" style="margin: 0">
          <el-input class="h-45px" :placeholder="`${t('reuse.inputContent')} ...`" v-model="messageInputForm.chatContent"
            @keyup.enter.native="onSubmit" />
          <el-button :icon="sendIcon" @click="onSubmit" class="absolute right-1 !text-blue-500 biggerIcon" />
        </el-form-item>
      </el-form>
      <div class="flex flex-nowrap justify-around gap-2">
        <el-upload class="message-box__feel" action="#" :show-file-list="false">
          +
          <div size="small" class="message-box__icon">
            <Icon icon="carbon:face-satisfied" :size="27" />
            <small>{{ t('reuse.status') }}</small>
          </div>
        </el-upload>
        <el-upload class="message-box__feel" action="#" :show-file-list="false">
          <div size="small" class="message-box__icon">
            <Icon icon="ic:outline-image" :size="27" />
            <small>{{ t('reuse.library') }}</small>
          </div>
        </el-upload>
        <el-upload class="message-box__feel" action="#" :show-file-list="false">
          <div size="small" class="message-box__icon">
            <Icon icon="ion:document-text-outline" :size="27" />
            <small>{{ t('reuse.contract') }}</small>
          </div>
        </el-upload>
        <div class="message-box__feel" id="priceDeal" action="#" :show-file-list="false" @click="showModal = true">
          <div size="small" class="message-box__icon">
            <Icon icon="ion:document-text-outline" :size="27" />
            <small>Deal giá</small>
          </div>
        </div>
      </div>
    </div>
    <modal :title="modalTitle" v-if="showModal" @close="showModal = false">
      <div>{{ modalContent }}</div>
    </modal>

    
  </el-card>
</template>
<script setup>
import { ElUpload, ElForm, ElFormItem, ElInput, ElButton, ElAlert, ElCard } from 'element-plus'
import { Icon } from '@/components/Icon'
</script>
<script>
import Modal from './modalProductList.vue';
import contractIcon from '@/assets/svgs/chat/contract.svg'
import albumIcon from '@/assets/svgs/chat/album.svg'
import faceIcon from '@/assets/svgs/chat/face.svg'
import dIcon from '@/assets/svgs/chat/d.svg'
import defaultImg from '@/assets/svgs/chat/default.jpg'
import moment from 'moment'
import {
  TYPE_OF_MESSAGE_SELECTED,
  TYPE_OF_MESSAGE_PAWN,
  TYPE_OF_MESSAGE_LEASE,
  TYPE_OF_MESSAGE_DEPOSIT,
  PAGE_SIZE_ARRAY
} from '@/utils/chatConstants'
import { useCache } from '@/hooks/web/useCache'
import { usePermissionStore } from '@/store/modules/permission'
import { useIcon } from '@/hooks/web/useIcon'
import { formatMoneyInput } from '@/utils/format.ts'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const { wsCache } = useCache()
const permissionStore = usePermissionStore()
const sendIcon = useIcon({ icon: 'mdi:send' })
const searchIcon = useIcon({ icon: 'uiw:search' })
const leftArrow = useIcon({ icon: 'material-symbols:chevron-left' })
export default {
  name: 'MessagePanel',
  props: {
    user: Object,
    channelId: String,
    messagesOfCurrentUser: Array,
    refss: Array
  },
  expose: ['showMessage1', 'showMessage', 'showMessageSocketRe', 'displayDealPrice'],
  components: {
    Modal,
  },
  data() {
    return {
      showModal: false,
      modalTitle: 'Modal Title',
      modalContent: '',
      message: [],
      TYPE_OF_MESSAGE_SELECTED,
      TYPE_OF_MESSAGE_PAWN,
      TYPE_OF_MESSAGE_LEASE,
      TYPE_OF_MESSAGE_DEPOSIT,
      PAGE_SIZE_ARRAY,
      moment,
      messageInputForm: {
        chatContent: ''
      },
      dataMessageChat: wsCache.get(permissionStore.getGroupChatID),
      contractIcon,
      albumIcon,
      faceIcon,
      sendIcon,
      dIcon,
      defaultImg,
      search: '',
      dealId: null,
      messageStreamContent: [],
      pageIndex: 1,
      pageSize: PAGE_SIZE_ARRAY[0],
      scrollLoading: false,
      noMoreLoadData: false,
      messages: document.querySelector("#messages")
    }
  },
  computed: {
    isValid() {
      return this.messageInputForm.chatContent?.length > 0
    },

    disableScroll() {
      return this.noMoreLoadData || this.scrollLoading
    },

  },

  watch: {
    message: {
      deep: true,
      handler(val) {
        if (Array.isArray(val) && val.length > 0) {
          this.getMessageStreamContent()
        }
      }
    },
    channelId: {
      handler(val) {
        this.pageIndex = 1
        this.noMoreLoadData = false
        if (this.message.length > 0) {
          this.message.splice(0, this.message.length)
        }
        this.getConversationByChanelId()
      }
    },
    messagesOfCurrentUser: {
      deep: true,
      handler(val) {
        if (Array.isArray(val) && val.length > 0) {
          this.PageIndex = 1
          this.message = val
        }
      }
    },
    refss: {
      deep: true,
      handler(val) {
        this.showMessage1(val)
      }
    },
    dataMessageChat: {
      deep: true,
      handler(val) {
        this.showMessage1(val)
      }
    },
  },
  created() {
    this.message = this.messagesOfCurrentUser
  },
  mounted() {
    this.displayDealPrice()
  },
  methods: {
    displayDealPrice() {
      console.log(wsCache.get(permissionStore.getTypeChat))
      if (wsCache.get(permissionStore.getTypeChat) == "6430ec70d761c80ca0c1c1d1") {
        document.getElementById("priceDeal").style.display = "block";
        document.getElementById("box-product").style.display = "block";
      } else {
        document.getElementById("priceDeal").style.display = "none";
        document.getElementById("box-product").style.display = "none";
      }
    },
    showProductDeal() {

    },
    onSubmit() {
      this.$refs.messageInput.validate(async (valid) => {
        if (valid) {
          this.$emit('input', this.messageInputForm.chatContent)

          var a = {
            chatGroupId: wsCache.get(permissionStore.getGroupChatID),
            text: this.messageInputForm.chatContent,
            chatTypeId: wsCache.get(permissionStore.getTypeChat),
            productId: null,
            file: null,
            sender: {
              id: wsCache.get(permissionStore.getUserIDSentChat),
              UserName: wsCache.get(permissionStore.getUserNameSentChat),
              avatar: null
            }
          }
          this.showMessageSocket(a);
          this.$emit('send-data', JSON.stringify(a))
          this.messageInputForm.chatContent = ''
        }
      })



    },
    showMessageSocketRe(message) {
      console.log(wsCache.get(permissionStore.getUserIDReceive))
      console.log("6666666666666666666666666666")
      if (message.sender.id == wsCache.get(permissionStore.getUserIDReceive) && message.chatTypeId == wsCache.get(permissionStore.getTypeChat)) {
        this.showMessage(message);
      }
    },
    showMessage(message) {

      if (message.sender.id != wsCache.get(permissionStore.getUserIDSentChat)) {
        messages.innerHTML += `
        <div class="message" style="  display: flex;
  align-items: center;
  margin-bottom: 8px;">
    <div class="photo"
      style="background-image: url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80);display: block;width: 45px;height: 45px;background: #E6E7ED;-moz-border-radius: 50px;-webkit-border-radius:50px;background-position: center;background-size: cover;background-repeat: no-repeat;">
      <div class="online"
        style="position: relative;top: 35px;left: 30px;width: 13px;height: 13px;background-color: #8BC34A;border-radius: 13px;border: 3px solid #FAFAFA;">
      </div>
    </div>
    <p class="text" style="    margin: 0 35px;
  background-color: #f6f6f6;
  padding: 10px;
  border-radius: 12px;">
      ${message.text} </p>
  </div>
  <p class="time" style="    font-size: 10px;
  color: lightgrey;
  margin-bottom: 10px;
  margin-left: 85px;"> ${moment(message.createAT).format('DD/MM/YYYY hh:ss:mm')}</p>`
      } else {
        messages.innerHTML += `<div class="message text-only" style="display: flex;align-items: center;margin-bottom: 10px;">
    <div class="response" style="float: right;margin-right: 0px !important;margin-left: auto;">
      <p class="text" style=" background-color: #e3effd !important;padding: 10px;border-radius: 12px;"> ${message.text}</p>
    </div>
  </div>`;
      }
      messages.scrollTop = messages.scrollHeight;
    },
    showMessageSocket(message) {
      if (message.id == wsCache.get(permissionStore.getUserIDSentChat)) {
        messages.innerHTML += `
        <div class="message" style="  display: flex;
  align-items: center;
  margin-bottom: 8px;">
    <div class="photo"
      style="background-image: url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80);display: block;width: 45px;height: 45px;background: #E6E7ED;-moz-border-radius: 50px;-webkit-border-radius:50px;background-position: center;background-size: cover;background-repeat: no-repeat;">
      <div class="online"
        style="position: relative;top: 35px;left: 30px;width: 13px;height: 13px;background-color: #8BC34A;border-radius: 13px;border: 3px solid #FAFAFA;">
      </div>
    </div>
    <p class="text" style="    margin: 0 35px;
  background-color: #f6f6f6;
  padding: 10px;
  border-radius: 12px;">
      ${message.text} </p>
  </div>
  <p class="time" style="    font-size: 10px;
  color: lightgrey;
  margin-bottom: 10px;
  margin-left: 85px;"> ${moment(message.createAT).format('hh:ss:mm')}</p>`
      } else {
        messages.innerHTML += `<div class="message text-only" style="display: flex;align-items: center;margin-bottom: 10px;">
    <div class="response" style="float: right;margin-right: 0px !important;margin-left: auto;">
      <p class="text" style=" background-color: #e3effd !important;padding: 10px;border-radius: 12px;"> ${message.text}</p>
    </div>
  </div>`;
      }
      messages.scrollTop = messages.scrollHeight;

    },
    showMessage1(val) {
      messages.innerHTML = "";
      for (var i = 0; i < val.message.length; i++) {
        this.showMessage(val.message[i])
      }
      messages.scrollTop = messages.scrollHeight;
    },
    formatPrice(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    sortMessage() {
      this.message.sort(function (a, b) {
        var c = new Date(a.messages.createdDate)
        var d = new Date(b.messages.createdDate)
        return c - d
      })
    },
    async getConversationByChanelId() {
      this.scrollLoading = true
      await getConversation({
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        ChannelId: this.channelId
      })
        .then((res) => {
          if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0) {
            this.message.unshift(...res.data.reverse())
          } else this.noMoreLoadData = true
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          this.scrollLoading = false
        })
    },
    cancelProduct(id) {
      this.$confirm('Hủy đơn hàng này?', 'Hủy đơn', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        const date = new Date(Date.now())
        const obj = {
          DealId: id,
          ValidUntil: moment(date).format('YYYY-MM-DD'),
          IsActive: false,
          IsDelete: false
        }
        const formData = Object.keys(obj).reduce((form, key) => {
          if (obj[key]) {
            form.append(key, obj[key])
          }
          return form
        }, new FormData())
        cancelDeal(formData)
          .then((res) => {
            if (res.status === 200 && res.data.statusCode === 200) {
              this.getMessageStreamContent()
              this.$notify({
                title: 'Hủy thành công',
                message: 'Bạn vừa từ trối đơn hàng này',
                type: 'warning'
              })
            } else {
              this.$notify({
                title: 'Thất bại',
                message: res.data.message,
                type: 'error'
              })
            }
          })
          .catch((err) => {
            console.error(err)
          })
      })
    },
    agreeToSell(id) {
      this.$confirm('Xác nhận đồng ý bán?', 'Đồng ý bán', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        type: 'success'
      }).then(() => {
        const obj = {
          DealId: id,
          IsUser: false
        }
        acceptDeal(obj)
          .then((res) => {
            if (res.status === 200 && res.data.statusCode === 200) {
              this.getMessageStreamContent()
              this.$notify({
                title: 'Thành công',
                message: 'Chấp nhận đơn hàng',
                type: 'success'
              })
            } else {
              this.$notify({
                title: 'Thất bại',
                message: res.data.message,
                type: 'error'
              })
            }
          })
          .catch((err) => {
            console.error(err)
          })
      })
    },
    // get media infos if they exist in message list
    async getMessageStreamContent() {
      if (this.message.length > 0) {
        if (this.messageStreamContent.length > 0) {
          this.messageStreamContent.splice(0, this.messageStreamContent.length)
        }
        for (const el of this.message) {
          this.messageStreamContent.push({
            content: el.messages.content ?? '',
            user: el.messages.from,
            createdDate: el.messages.createdDate,
            type: el.type
          })
        }
      }
    },
    scrollEvent() {
      if (!this.disableScroll) {
        this.pageIndex++
        this.getConversationByChanelId()
      }
    },
    getEachMessageOfAConversation(responseData, messageInfo) {
      this.messageStreamContent.push({
        content: responseData ?? '',
        user: messageInfo.messages.from,
        createdDate: messageInfo.messages.createdDate,
        type: messageInfo.type
      })
    },
    getVh(pxVh, baseVh = 768) {
      return (pxVh * 100) / baseVh
    },
    showDocumentList() {
      document.getElementById('hideDocument').style.display = 'block'
      document.getElementById('showDocument').style.display = 'none'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/chat.scss';

.biggerIcon :deep(.el-icon) span {
  font-size: 24px !important;
}

.ml-0 {
  margin-left: 0 !important;
}

ul {
  padding: 1rem;
  list-style: none;
}

.h-680px :deep(.el-card__body) {
  height: 100%;
}

.h-45px :deep(.el-input__wrapper) {
  padding-left: 1rem;
}

.h-250px :deep(.el-card__body) {
  padding: 1rem !important;
}

.messages-chat {
  padding: 0px;
}

.messages-chat .message {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.messages-chat .message .photo {
  display: block;
  width: 45px;
  height: 45px;
  background: #E6E7ED;
  -moz-border-radius: 50px;
  -webkit-border-radius: 50px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.messages-chat .text {
  margin: 0 35px;
  background-color: #f6f6f6;
  padding: 15px;
  border-radius: 12px;
}

.text-only {
  margin-left: 45px;
}

.time {
  font-size: 10px;
  color: lightgrey;
  margin-bottom: 10px;
  margin-left: 85px;
}

.response-time {
  float: right;
  margin-right: 40px !important;
}

.response {
  float: right;
  margin-right: 0px !important;
  margin-left: auto;
  /* flexbox alignment rule */
}

.response .text {
  background-color: #e3effd !important;
}
</style>
