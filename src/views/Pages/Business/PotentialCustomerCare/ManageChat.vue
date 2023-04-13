<template>
  <section class="!h-87vh">
    <el-tabs v-model="activeName" class="library-tab h-full" tab-position="left" stretch>
      <el-tab-pane :name="item.name" v-for="item in listTypeMessages" :key="item.name" >
        <template #label>
          <div
           @click="getTypeMessage(item)"
            class="library-tab__name pr-2 w-full h-full dark:(text-white) text-center flex flex-col content-center items-center pt-4"
            :class="{ active: item.isActive }">
            <Icon icon="ps:headset" :size="24" />
            <div style="word-break: break-word"
              class="whitespace-normal overflow-ellipsis w-full overflow-hidden leading-normal">{{ item.name }}</div>
          </div>
        </template>
      </el-tab-pane>
      <div class="message-box h-full">
        <el-row class="h-full w-full bg-white dark:bg-[var(--el-bg-color)]">
          <div class="border-x dark:!bg-[var(--el-bg-color)] flex-grow min-w-1/2 h-full">
            <MessagePanel v-if="selectedUser" :user="selectedUser" ref="childComponentRef"
              :messagesOfCurrentUser="selectedUser" @send-data="receiveDataFromChild" :typeMessage="typeMessageSelected"
              :channelId="isChannelId" @input="onMessage" />
          </div>
          <el-col :span="5" class="h-full" id="hideDocument">
            <el-card class="message-box__right-site flex flex-col !h-full">
              <div class="message-box__child-title !sticky top-0 z-5 bg-white dark:!bg-[var(--el-bg-color)] py-4 mb-4">
                <el-button :icon="rightArrow" @click="hideDocumentList()"
                  class="!flex !border-0 !w-full !justify-between !font-bold !py-4 !rounded-none">{{ t('reuse.document')
                  }}</el-button>
              </div>
              <div v-if="documentList.length > 0">
                <div v-for="(item, index) in documentList" :key="index" class="pb-16">
                  <div v-if="item.type === 'TuVanMuaHang'" class="flex flex-col">
                    <el-card>
                      <div class="flex pb-1 border-bottom-1">
                        <div class="basis-1/2"><img :src="item.content.productImagePath" class="w-full" />
                        </div>
                        <div class="pl-4">
                          <div class="font-bold">{{ item.content.productBrand }}</div>
                          <div>{{ item.content.productName }}</div>
                          <div>{{ formatMoneyInput(item.content.totalMoney) }}đ</div>
                        </div>
                      </div>
                      <div class="flex flex-col">
                        <div class="my-2 font-bold">{{ t('reuse.negotiationPrice') }}
                          {{ formatMoneyInput(item.content.currentInterestMoney) }}đ</div>
                        <div v-if="item.content.orderStatus == 3">
                          <el-button class="w-full my-2 !font-bold !py-6" @click="documentAction(0)">{{ t('reuse.cancel')
                          }}</el-button>
                          <el-button class="!m-0 w-full !bg-black !font-bold !py-6" @click="documentAction(1)"><span
                              class="text-white">{{ t('reuse.agreeToSell') }}</span></el-button>
                        </div>
                        <div v-if="item.content.orderStatus == 2" class="font-bold text-red-500">
                          {{ t('reuse.cancelled') }}!
                        </div>
                        <div v-if="item.content.orderStatus == 1" class="font-bold">
                          {{ t('reuse.agreeToSell') }}!
                        </div>
                      </div>
                    </el-card>
                  </div>
                  <div><small class="text-[#a19c9c]">{{ item.createdDate }}</small></div>
                </div>
              </div>
              <div v-else class="message-box__emtpy h-4/5 flex items-center justify-center flex-wrap">
                <div>
                  <div><img :src="emptyIcon" alt="..." /></div>
                  <div>Không có dữ liệu</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5" class="h-full user_input">
            <el-card class="message-box__left-site h-full">
              <div class="!sticky top-0 z-5 bg-white dark:!bg-[var(--el-bg-color)] mb-4"
                style="box-shadow: var(--el-box-shadow-light)">
                <el-input class="p-4 h-70px" :placeholder="`${t('reuse.findNameAccount')} ...`" v-model="searchPeople"
                  :suffix-icon="searchIcon" @keydown.enter="SearchUser" />
              </div>
              <UserList v-for="user in users" :key="user._id" :user="user" :typeMessage="typeMessageSelected"
                :selected="selectedUser === user" @select="onSelectUser(user)" @send-data="handleData" />
              <!-- <div class="absolute bottom-10px right-10px"><el-avatar
:src="user.avatar" v-for="user in popUpChat"
                  :key="user" size="large" class="cursor-pointer" />
                ></div> -->
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-tabs>
  </section>
</template>

<script setup>
import { ElRow, ElCol, ElTabs, ElTabPane, ElButton, ElInput, ElCard, ElAvatar } from 'element-plus'
import UserList from './User.vue'

</script>
<script>
import { formatMoneyInput } from '@/utils/format.ts'
import dIcon from '@/assets/svgs/chat/d.svg'
import emptyIcon from '@/assets/svgs/chat/emtpy.svg'
import moment from 'moment'
import MessagePanel from './MessagePanel.vue'
import { getEmployeeList, getTypeChat } from '@/api/ChatBot'
import { ERP_DOMAIN_CHATS_URL, ERP_DOMAIN_SOCKET_URL } from '@/utils/API_URL'

import {
  TYPE_OF_MESSAGE,
  TYPE_OF_MESSAGE_SELECTED,
  TYPE_OF_MESSAGE_PAWN,
  TYPE_OF_MESSAGE_LEASE,
  TYPE_OF_MESSAGE_DEPOSIT
} from '@/utils/chatConstants'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { useCache } from '@/hooks/web/useCache'
import { usePermissionStore } from '@/store/modules/permission'
import { getMessageChat, getGroupIDChat } from '@/api/ChatBot'
import { ref } from 'vue';
const childComponentRef = ref(0);
const { t } = useI18n()
const searchIcon = useIcon({ icon: 'uiw:search' })
const rightArrow = useIcon({ icon: 'material-symbols:chevron-right' })
var ws = null;
var selfs = null;
const { wsCache } = useCache()
const permissionStore = usePermissionStore()
export default {

  name: 'ManageChat',
  components: {
    MessagePanel
  },

  data() {
    return {
      TYPE_OF_MESSAGE_PAWN,
      TYPE_OF_MESSAGE_LEASE,
      TYPE_OF_MESSAGE_DEPOSIT,
      dIcon,
      ws,
      emptyIcon,
      searchIcon,
      activeName: null,
      typeMessageSelected: TYPE_OF_MESSAGE_SELECTED,
      search: '',
      searchPeople: '',
      chatContent: '',
      statusSell: 1,
      Avatar:
        'https://toigingiuvedep.vn/wp-content/uploads/2021/05/avatar-hinh-anh-dai-dien-nguoi-giau-mat.jpg',
      selectedUser: null,
      isChannelId: null,
      popUpChat: [
        { avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
        { avatar: 'https://i.pngimg.me/thumb/f/720/m2H7K9A0Z5m2G6b1.jpg' },
        {
          avatar:
            'https://cdn.imgbin.com/2/4/15/imgbin-computer-icons-portable-network-graphics-avatar-icon-design-avatar-DsZ54Du30hTrKfxBG5PbwvzgE.jpg'
        }
      ],
      users: [
      ],
      userSearch: [],
      documentList: [
        {
          content: {
            orderServiceId: 95,
            orderServiceDetailsId: 12,
            orderCode: 'DHTC4375213',
            orderStatus: 3,
            userFullName: 'LangVi',
            userPhone: '0987156423',
            userAddress: '67 Giảng Võ , Ba Đình , Hà Nội',
            totalMoney: 129000000,
            paidTotalMoney: 0,
            debtTotalMoney: 0,
            currentInterestMoney: 46956000,
            currentWarrantyMoney: 23478000,
            productId: 0,
            productName: 'Hand Bag',
            productBrand: 'Louis Vuitton',
            productImagePath:
              'https://1.bp.blogspot.com/-UwwTcoPkWl4/YVCSZaQ1xxI/AAAAAAAAIHE/aZi9kWLEs3A17oqVEdByaARpQ7iDPsm1QCLcBGAsYHQ/s680/LV2.jpg'
          },
          createdDate: '20/10/2021',
          type: 'TuVanMuaHang'
        },
        {
          content: {
            orderServiceId: 37,
            orderServiceDetailsId: 119,
            orderCode: 'DHTC8431',
            orderStatus: 2,
            userFullName: '0866936832',
            userPhone: '0866936832',
            userAddress: null,
            totalMoney: 39000000,
            paidTotalMoney: 0,
            debtTotalMoney: 0,
            currentInterestMoney: 14872000,
            currentWarrantyMoney: 7436000,
            productId: 8,
            productName: 'Lady Dior Red Lambskin Bag',
            productBrand: 'Dior',
            productImagePath:
              'https://webassets.ashford.com/images/web/louis_erard/78225PR15BRC37_FXA.jpg'
          },
          createdDate: 'Sat',
          type: 'TuVanMuaHang'
        },
        {
          content: {
            orderServiceId: 95,
            orderServiceDetailsId: 12,
            orderCode: 'DHTC4375213',
            orderStatus: 1,
            userFullName: 'LangVi',
            userPhone: '0987156423',
            userAddress: '67 Giảng Võ , Ba Đình , Hà Nội',
            totalMoney: 129000000,
            paidTotalMoney: 0,
            debtTotalMoney: 0,
            currentInterestMoney: 46956000,
            currentWarrantyMoney: 23478000,
            productId: 0,
            productName: 'Hand Bag',
            productBrand: 'Christian Dior',
            productImagePath: 'https://cf.shopee.vn/file/527759b3eb97d8903651e452105fe8cd'
          },
          createdDate: '12:20 AM',
          type: 'TuVanMuaHang'
        },
        {
          content: {
            orderServiceId: 95,
            orderServiceDetailsId: 12,
            orderCode: 'DHTC4375213',
            orderStatus: 2,
            userFullName: 'LangVi',
            userPhone: '0987156423',
            userAddress: '67 Giảng Võ , Ba Đình , Hà Nội',
            totalMoney: 129000000,
            paidTotalMoney: 0,
            debtTotalMoney: 0,
            currentInterestMoney: 46956000,
            currentWarrantyMoney: 23478000,
            productId: 0,
            productName: 'Hand Bag',
            productBrand: 'Louis Vuitton',
            productImagePath:
              'https://1.bp.blogspot.com/-UwwTcoPkWl4/YVCSZaQ1xxI/AAAAAAAAIHE/aZi9kWLEs3A17oqVEdByaARpQ7iDPsm1QCLcBGAsYHQ/s680/LV2.jpg'
          },
          createdDate: '10:55 AM',
          type: 'TuVanMuaHang',
          childComponentRef: null
        }
      ],
      listTypeMessage: TYPE_OF_MESSAGE,
      listTypeMessages: null,
      dataSocket: null,
      selfs
    }
  },
  watch: {
    selectedUser: {
      handler() {
        this.getDocument()
      }
    },
    activeName: {
      immediate: true,
      handler(val) {
        // load user immediate
        if (val) {
          this.getTypeMessage(val)
        }
      }
    },
    dataSocket: {
      immediate: true,
      handler(val) {
        // load user immediate
        if (val) {
          this.handleData(val)
        }
      }
    },
    searchPeople: {
      handler() {
        this.SearchUser()
      }
    }

  },
  updated() {

  },
  created() {
    this.getTypeChats();
    this.getUser();
  },
  async mounted() {
    // this.handleData("HHHHH")
    await this.getUser();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }
    ws = new WebSocket(ERP_DOMAIN_SOCKET_URL, wsCache.get(permissionStore.getUserIDSentChat));
    ws.onopen = () => {
      console.log("Connection opened!");
    };
    ws.addEventListener("message", function incoming(data) {
      // console.log(data)
      if (data.data == "close" || data.data == "open") {
        _this.getUser()
      } else {
        _this.dataSocketSent(data)
      }

    });
    ws.onclose = function () {
      ws = null;
    };
  },
  methods: {
    receiveDataFromChild(data) {
      ws.send(data);
      // this.$refs.childComponentRef.showMessage(JSON.parse(data))
    },
    handleData(data) {
      wsCache.set(permissionStore.getGroupChatID, data.message.groud_chat );
      this.$refs.childComponentRef.showMessage1(data.message)
    },
    handleDataType(data) {
      this.$refs.childComponentRef.showMessage1(data)
    },
    dataSocketSent(data) {
      // this.users
      var dataSK = JSON.parse(data.data);
      if (dataSK.sender.id != wsCache.get(permissionStore.getUserIDReceive)) {
        for (var i = 0; i < this.users.length; i++) {
          if (this.users[i]._id == dataSK.sender.id) {
            this.users[i].countMessage = this.users[i].countMessage + 1;
          }
        }
      }
      this.users =  this.users.sort((a, b) => {
        // Sắp xếp theo countmessage
        if (a.countmessage > b.countmessage) {
          return -1;
        } else if (a.countmessage < b.countmessage) {
          return 1;
        } else {
          return 0;
        }
      });
      this.$refs.childComponentRef.showMessageSocketRe(dataSK)
    },
    onSelectUser(user) {
      user.countMessage = 0;
      this.selectedUser = user
      user.hasNewMessages = true
      user.unreadMessage = true
    },
    onMessage(content) {
      //  console.log('content', content)
    },
    hideDocumentList() {
      document.getElementById('hideDocument').style.display = 'none'
      document.getElementById('showDocument').style.display = 'block'
    },
    getDocument() {
      console.log('getDocument')
    },
    async getTypeMessage(val) {
      console.log("NGAY LAM VIEC")
      console.log(val)
      console.log("-------------LAM VIEC------------")
      for (let i = 0; i < this.listTypeMessages.length; i++) {
        if (this.listTypeMessages[i].name == val) {
          wsCache.set(permissionStore.getTypeChat, this.listTypeMessages[i]._id);
        }
      }
      var a = {
        group_id: null,
        user_id: wsCache.get(permissionStore.getUserIDSentChat),
        user_id_sent: wsCache.get(permissionStore.getUserIDReceive),
        name: wsCache.get(permissionStore.getUserNameReceive),
        name_sent: wsCache.get(permissionStore.getUserNameSentChat),
        chatTypeId: wsCache.get(permissionStore.getTypeChat),
      }
      const idGroup = await getGroupIDChat(JSON.stringify(a))
      if (idGroup.message == null) {
        a.group_id = null
      } else {
        a.group_id = idGroup.message._id;
        wsCache.set(permissionStore.getGroupChatID, idGroup.message._id);
      }

      const res = await getMessageChat(JSON.stringify(a))
      if (res) {
        this.handleDataType(res)
      }
      this.$refs.childComponentRef.displayDealPrice()
    },

    SearchUser() {
      if (this.searchPeople == "") {
        this.users = this.userSearch;
      } else {
        let seachName = this.searchPeople;
        seachName = seachName.replace(
          /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
          "\\$&"
        );
        return (this.users = this.users.filter((user) => {
          return (
            user.userName.toLowerCase().match(seachName.toLowerCase())
          );
        }));
      }

    },
    async getUser() {
      const res = await getEmployeeList()
      if (res) {
        res.message.map((datafu, index) => {
          datafu.countMessage = 0;
        })
        this.users = res.message;

        const STAFF_INFO = wsCache.get(permissionStore.getStaffInfo);

        var userInfo = this.users.filter((user) => {
          return (
            user.id.match(STAFF_INFO.accountId)
          );
        })
        wsCache.set(permissionStore.getUserNameSentChat, userInfo[0].userName);
        wsCache.set(permissionStore.getUserIDSentChat, userInfo[0]._id)
        this.users = this.users.filter(function (obj) {
          return obj._id !== wsCache.get(permissionStore.getUserIDSentChat);
        });
        this.userSearch = this.users;
      }

    },
    async getTypeChats() {
      const res = await getTypeChat()
      if (res) {
        res.message.map((datafu, index) => {
          if (datafu.isActive == true) {
            this.activeName = datafu.name;
            wsCache.set(permissionStore.getTypeChat, datafu._id);
          }
        })
        this.listTypeMessages = res.message;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/chat.scss';
</style>
