<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <el-card class="h-full">
    <div class="flex message-box__header items-center justify-between h-1/10 px-4">
      <div class="flex message-box__customer items-center">
        <img :src="defaultImg" alt="..." width="50" height="50" />
        <span class="pl-2">{{ user.Name ? user.Name : user.UserName }}</span>
      </div>
      <div class="flex items-center w-1/4">
        <el-form class="message-box__search w-full">
          <el-input
            :placeholder="`${t('reuse.findContent')} ...`"
            v-model="search"
            :suffix-icon="searchIcon"
            class="h-50px"
          />
        </el-form>
        <div id="showDocument">
          <el-button
            :icon="leftArrow"
            class="!pl-4 !border-0 !font-bold hidden"
            @click="showDocumentList(0)"
            >Tài liệu</el-button
          ></div
        ></div
      >
    </div>
    <el-alert v-if="noMoreLoadData" title="Đã hiển thị hết tin nhắn" type="success" effect="dark" />
    <!-- <p v-if="scrollLoading" class="text-center"> Đang tải thêm ... </p> -->
    <section class="h-650px">
      <ul
        class="message-box__body !h-full !dark:bg-[var(--el-bg-color)] border-top-1 dark:border-transparent"
      >
        <li
          class="content-message dark:bg-[var(--el-bg-color)]"
          v-for="(mess, index) in messageStreamContent"
          :key="index"
        >
          <section class="friend-send" v-if="mess.user !== 'admin'">
            <div class="media">
              <div class="media-body ml-0">
                <section v-if="typeof mess.content === 'object'">
                  <el-card class="w-1/3 h-250px m-auto">
                    <div class="flex border-bottom-1">
                      <div class="basis-1/2"
                        ><img :src="mess.content.productImagePath" class="w-full" />
                      </div>
                      <div class="pl-4">
                        <div class="font-bold">{{ mess.content.productBrand }}</div>
                        <div>{{ mess.content.productName }}</div>
                        <div>{{ formatMoneyInput(mess.content.totalMoney) }}đ</div>
                      </div> </div
                    ><div class="flex flex-col"
                      ><div class="my-2 font-bold text-center"
                        >{{ t('reuse.negotiationPrice') }}
                        {{ formatMoneyInput(mess.content.currentInterestMoney) }}đ</div
                      >
                      <div v-if="mess.content.orderStatus == 3" class="flex justify-center">
                        <el-button class="w-full !font-bold" @click="documentAction(0)">{{
                          t('reuse.cancel')
                        }}</el-button>
                        <el-button class="w-full !bg-black !font-bold" @click="documentAction(1)"
                          ><span class="text-white">{{ t('reuse.agreeToSell') }}</span></el-button
                        >
                      </div>
                      <div v-if="mess.content.orderStatus == 2" class="font-bold text-red-500">
                        {{ t('reuse.cancelled') }}!
                      </div>
                      <div v-if="mess.content.orderStatus == 1" class="font-bold">
                        {{ t('reuse.agreeToSell') }}!
                      </div>
                    </div>
                  </el-card>
                </section>
                <section
                  class="!ml-4"
                  v-else-if="typeof mess.content === 'string' && mess.content !== ''"
                >
                  <div class="flex message-box__customer items-center">
                    <img :src="defaultImg" alt="..." width="35" height="35" />
                    <span class="pl-2 text-black">{{ user.Name ? user.Name : user.UserName }}</span>
                  </div>
                  <div class="friend-send__message ml-11 rounded">{{ mess.content }}</div>
                  <div class="ml-11 text-xs text-[#949494] pt-1 pb-2">20/10/2021</div>
                </section>
                <section class="content-message__time" v-else-if="mess.content !== ''">
                  {{ moment(mess.createdDate).format('HH:mm A') }}
                </section>
              </div>
            </div>
          </section>
          <section class="you-send" v-if="mess.user === 'admin'">
            <section v-if="typeof mess.content === 'object'" class="rounded">
              {{ mess.content }}
            </section>
            <section v-else>
              <div class="you-send__message">
                {{ mess.content }}
              </div>
              <div class="content-message__time text-xs text-[#949494] pb-2">
                {{ moment(mess.createdDate).format('HH:mm A') }}
              </div></section
            >
          </section>
          <!-- deal here -->
        </li>
        <!-- messages here -->
      </ul>
    </section>
    <div class="message-box__footer p-3 h-1/10">
      <el-form
        class="message-box__send h-full flex-grow pr-4"
        ref="messageInput"
        :model="messageInputForm"
        @submit.native.prevent
      >
        <el-form-item prop="chatContent" class="h-full relative" style="margin: 0">
          <el-input
            class="h-45px"
            :placeholder="`${t('reuse.inputContent')} ...`"
            v-model="messageInputForm.chatContent"
            @keyup.enter.native="onSubmit"
          />
          <el-button
            :icon="sendIcon"
            @click="onSubmit"
            class="absolute right-1 !text-blue-500 biggerIcon"
          />
        </el-form-item>
      </el-form>
      <div class="flex flex-nowrap justify-around gap-2">
        <el-upload class="message-box__feel" action="#" :show-file-list="false">
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
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { ElUpload, ElForm, ElFormItem, ElInput, ElButton, ElAlert, ElCard } from 'element-plus'
import { Icon } from '@/components/Icon'
</script>
<script>
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
import { useIcon } from '@/hooks/web/useIcon'
import { formatMoneyInput } from '@/utils/format.ts'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const sendIcon = useIcon({ icon: 'mdi:send' })
const searchIcon = useIcon({ icon: 'uiw:search' })
const leftArrow = useIcon({ icon: 'material-symbols:chevron-left' })
export default {
  name: 'MessagePanel',
  props: {
    user: Object,
    channelId: String,
    messagesOfCurrentUser: Array
  },
  data() {
    return {
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
      noMoreLoadData: false
    }
  },
  computed: {
    isValid() {
      return this.messageInputForm.chatContent?.length > 0
    },

    disableScroll() {
      return this.noMoreLoadData || this.scrollLoading
    }
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
    }
  },
  created() {
    this.message = this.messagesOfCurrentUser
  },
  methods: {
    onSubmit() {
      this.$refs.messageInput.validate(async (valid) => {
        if (valid) {
          this.$emit('input', this.messageInputForm.chatContent)
          this.messageInputForm.chatContent = ''
        }
      })
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
</style>
