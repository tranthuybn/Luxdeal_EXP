<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <el-card class="h-100vh">
    <div class="flex message-box__header items-center justify-between h-1/10 px-4">
      <div class="flex message-box__customer items-center">
        <img :src="defaultImg" alt="..." width="45" height="45" />
        <span class="pl-2">{{ user.Name ? user.Name : user.UserName }}</span>
      </div>
      <div class="flex items-center w-1/4">
        <el-form class="message-box__search w-full">
          <el-input
            placeholder="Tìm theo nội dung ..."
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
    <section class="h-4/5">
      <ul class="message-box__body !h-full !dark:bg-[var(--el-bg-color)] border-1">
        <li
          class="content-message dark:bg-[var(--el-bg-color)]"
          v-for="(mess, index) in messageStreamContent"
          :key="index"
        >
          <section class="friend-send" v-if="mess.user !== 'admin'">
            <div class="media">
              <div class="media-body ml-0">
                <section v-if="typeof mess.content === 'object'">
                  <!-- Tư vấn bán hàng -->
                  <div class="product-link" v-if="mess.type === TYPE_OF_MESSAGE_SELECTED">
                    <div class="product-link__header">
                      <div class="media">
                        <img class="product-link__img" :src="mess.content.imageUrl" alt="..." />
                        <div class="media-body">
                          <div class="product-link__name">{{ mess.content.name }}</div>
                          <div class="product-link__font">{{
                            mess.content.productPropertyAttribute
                          }}</div>
                          <div class="product-link__font"
                            >{{ formatPrice(mess.content.price) }} <img :src="dIcon" alt="..."
                          /></div>
                        </div>
                      </div>
                    </div>
                    <div class="product-link__footer">
                      <div class="product-link__price"
                        >Đang trả giá: {{ formatPrice(message.content.dealPrice) }} đ</div
                      >
                      <div
                        class="product-link__cancel"
                        v-if="
                          message.content.isActive === false && message.content.isAccept !== true
                        "
                        >Đã huỷ !</div
                      >
                      <div class="product-link__done" v-if="message.content.isAccept"
                        >Đồng ý bán !</div
                      >
                      <div
                        class="flex-item"
                        v-if="
                          message.content.isAccept === false && message.content.isActive === true
                        "
                      >
                        <el-button @click="cancelProduct(message.content.id)">Hủy</el-button>
                        <el-button @click="agreeToSell(message.content.id)">Đồng ý bán</el-button>
                      </div>
                    </div>
                  </div>
                  <!-- Tư vấn thế chấp -->
                  <div class="contract" v-else-if="message.type === TYPE_OF_MESSAGE_DEPOSIT">
                    <div class="contract__header">
                      <div class="contract__name">
                        Mã hợp Đồng
                        <span>{{ message.content.orderCode }}</span>
                      </div>
                      <div class="contract__view">Chi tiết <i class="el-icon-arrow-right"></i></div>
                    </div>
                    <div class="contract__footer">
                      <div class="contract__item">
                        Đã bán
                        <span
                          >{{ formatPrice(message.content.sellPrice) }} <img :src="dIcon" alt="..."
                        /></span>
                      </div>
                      <div class="contract__item">
                        Phí ký gửi
                        <span
                          >{{ formatPrice(message.content.feeMoney) }} <img :src="dIcon" alt="..."
                        /></span>
                      </div>
                    </div>
                  </div>
                  <!-- Tư ván cho thuê -->
                  <div class="contract" v-else-if="message.type === TYPE_OF_MESSAGE_LEASE">
                    <div class="contract__header">
                      <div class="contract__name">
                        Mã hợp Đồng
                        <span>{{ message.content.orderCode }}</span>
                      </div>
                      <div class="contract__view">Chi tiết <i class="el-icon-arrow-right"></i></div>
                    </div>
                    <div class="contract__footer">
                      <div class="contract__item">
                        Đã nhận cọc
                        <span
                          >{{ formatPrice(message.content.depositPaidMoney) }}
                          <img :src="dIcon" alt="..."
                        /></span>
                      </div>
                      <div class="contract__item">
                        Dư nợ phí thuê
                        <span
                          >{{ formatPrice(message.content.duNoPhiThueQuaHan) }}
                          <img :src="dIcon" alt="..."
                        /></span>
                      </div>
                    </div>
                  </div>
                  <!-- Tư vấn ký gửi -->
                  <div class="contract" v-else-if="message.type === TYPE_OF_MESSAGE_PAWN">
                    <div class="contract__header">
                      <div class="contract__name">
                        Mã hợp Đồng
                        <span>{{ message.content.orderCode }}</span>
                      </div>
                      <div class="contract__view">Chi tiết <i class="el-icon-arrow-right"></i></div>
                    </div>
                    <div class="contract__footer">
                      <div class="contract__item">
                        Dư nợ gốc
                        <span
                          >{{ formatPrice(message.content.debtTotalMoney) }}
                          <img :src="dIcon" alt="..."
                        /></span>
                      </div>
                      <div class="contract__item">
                        Dư nợ phí thế chấp
                        <span
                          >{{
                            formatPrice(
                              message.content.currentInterestMoney,
                              '+',
                              message.content.currentWarrantyMoney
                            )
                          }}
                          <img :src="dIcon" alt="..."
                        /></span>
                      </div>
                    </div>
                  </div>
                </section>
                <section
                  class="friend-send__message"
                  v-else-if="typeof mess.content === 'string' && mess.content !== ''"
                >
                  {{ mess.content }}
                </section>
                <section class="content-message__time" v-else-if="mess.content !== ''">
                  {{ moment(mess.createdDate).format('HH:mm A') }}
                </section>
              </div>
            </div>
          </section>
          <section class="you-send" v-if="mess.user === 'admin'">
            <div class="you-send__message">
              {{ mess.content }}
            </div>
            <div class="content-message__time">
              {{ moment(mess.createdDate).format('HH:mm A') }}
            </div>
          </section>
          <!-- deal here -->
        </li>
        <!-- messages here -->
      </ul>
    </section>
    <div class="message-box__footer p-3">
      <el-form
        class="message-box__send h-full flex-grow pr-4"
        ref="messageInput"
        :model="messageInputForm"
        @submit.native.prevent
      >
        <el-form-item prop="chatContent" class="h-full relative" style="margin: 0">
          <el-input
            class="h-45px"
            placeholder="Nhập nội dung ..."
            v-model="messageInputForm.chatContent"
            @keyup.enter.native="onSubmit"
          />
          <el-button :icon="sendIcon" @click="onSubmit" class="absolute right-4" />
        </el-form-item>
      </el-form>
      <div class="flex flex-nowrap justify-around gap-2">
        <el-upload class="message-box__feel" action="#" :show-file-list="false">
          <div size="small" class="message-box__icon">
            <img :src="faceIcon" alt="..." />
            Trạng thái
          </div>
        </el-upload>
        <el-upload class="message-box__feel" action="#" :show-file-list="false">
          <div size="small" class="message-box__icon">
            <img :src="albumIcon" alt="..." />
            Thư viện
          </div>
        </el-upload>
        <el-upload class="message-box__feel" action="#" :show-file-list="false">
          <div size="small" class="message-box__icon">
            <img :src="contractIcon" alt="..." />
            Hợp đồng
          </div>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { ElUpload, ElForm, ElFormItem, ElInput, ElButton, ElAlert, ElCard } from 'element-plus'
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
          if (el.messages.from !== 'admin') {
          } else {
            this.messageStreamContent.push({
              content: el.messages.content ?? '',
              user: el.messages.from,
              createdDate: el.messages.createdDate,
              type: el.type
            })
          }
        }
      }
      return []
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
.ml-0 {
  margin-left: 0 !important;
}
ul {
  list-style: none;
}
.message-box__body {
  box-shadow: inset 0px 0px 5px rgba(129, 168, 244, 0.6);
}
.h-680px :deep(.el-card__body) {
  height: 100%;
}
</style>
