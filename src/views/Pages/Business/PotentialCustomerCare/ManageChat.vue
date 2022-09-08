<template>
  <section class="!h-full">
    <el-tabs v-model="activeName" class="library-tab h-full" tab-position="left" stretch>
      <el-tab-pane
        :name="item.value"
        v-for="item in listTypeMessage"
        :key="item.value"
        @click="getTypeMessage(item.value)"
      >
        <template #label>
          <div
            class="library-tab__name pr-2 w-full h-full dark:(text-white) text-center flex flex-col content-center items-center pt-4"
            :class="{ active: item.isActive }"
          >
            <Icon icon="uil:headphones" :size="24" />
            <div
              style="word-break: break-word"
              class="whitespace-normal overflow-ellipsis w-full overflow-hidden leading-normal"
              >{{ item.label }}</div
            ></div
          >
        </template>
      </el-tab-pane>
      <div class="message-box h-full">
        <el-row class="h-full w-full bg-white dark:bg-[var(--el-bg-color)]">
          <div class="border-x dark:!bg-[var(--el-bg-color)] flex-grow min-w-1/2">
            <MessagePanel
              v-if="selectedUser"
              :user="selectedUser"
              :messagesOfCurrentUser="selectedUser.message"
              :typeMessage="typeMessageSelected"
              :channelId="isChannelId"
              @input="onMessage"
          /></div>
          <el-col :span="5" class="h-full" id="hideDocument">
            <el-card class="message-box__right-site flex flex-col !h-full">
              <div
                class="message-box__child-title !sticky top-0 z-5 bg-white dark:!bg-[var(--el-bg-color)] py-4 mb-4"
              >
                <el-button
                  :icon="rightArrow"
                  @click="hideDocumentList()"
                  class="!flex !border-0 !w-full !justify-between !font-bold !py-4 !rounded-none"
                  >{{ t('reuse.document') }}</el-button
                >
              </div>
              <div v-if="documentList.length > 0">
                <div v-for="(item, index) in documentList" :key="index" class="pb-16">
                  <div v-if="item.type === 'TuVanMuaHang'" class="flex flex-col">
                    <el-card>
                      <div class="flex border-bottom-1">
                        <div class="basis-1/2"
                          ><img :src="item.content.productImagePath" class="w-full" />
                        </div>
                        <div class="pl-4">
                          <div class="font-bold">{{ item.content.productBrand }}</div>
                          <div>{{ item.content.productName }}</div>
                          <div>{{ formatMoneyInput(item.content.totalMoney) }}đ</div>
                        </div> </div
                      ><div class="flex flex-col"
                        ><div class="my-2 font-bold"
                          >{{ t('reuse.negotiationPrice') }}
                          {{ formatMoneyInput(item.content.currentInterestMoney) }}đ</div
                        >
                        <div v-if="item.content.orderStatus == 3">
                          <el-button
                            class="w-full my-2 !font-bold !py-6"
                            @click="documentAction(0)"
                            >{{ t('reuse.cancel') }}</el-button
                          >
                          <el-button
                            class="!m-0 w-full !bg-black !font-bold !py-6"
                            @click="documentAction(1)"
                            ><span class="text-white">{{ t('reuse.agreeToSell') }}</span></el-button
                          >
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
                  <div
                    ><small class="text-[#a19c9c]">{{ item.createdDate }}</small></div
                  >
                </div></div
              >
              <div
                v-else
                class="message-box__emtpy h-4/5 flex items-center justify-center flex-wrap"
              >
                <div>
                  <div><img :src="emptyIcon" alt="..." /></div>
                  <div>Không có dữ liệu</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5" class="h-full user_input">
            <el-card class="message-box__left-site h-full">
              <div
                class="!sticky top-0 z-5 bg-white dark:!bg-[var(--el-bg-color)] mb-4"
                style="box-shadow: var(--el-box-shadow-light)"
              >
                <el-input
                  class="p-4 h-70px"
                  :placeholder="`${t('reuse.findNameAccount')} ...`"
                  v-model="searchPeople"
                  :suffix-icon="searchIcon"
              /></div>
              <UserList
                v-for="user in currentUsersFollowTab"
                :key="user.userID"
                :user="user"
                :typeMessage="typeMessageSelected"
                :message="user.message"
                :selected="selectedUser === user"
                @select="onSelectUser(user)"
              />
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-tabs>
  </section>
</template>

<script setup>
import { ElRow, ElCol, ElTabs, ElTabPane, ElButton, ElInput, ElCard } from 'element-plus'
import UserList from './User.vue'
import MessagePanel from './MessagePanel.vue'
</script>
<script>
import { formatMoneyInput } from '@/utils/format.ts'
import dIcon from '@/assets/svgs/chat/d.svg'
import emptyIcon from '@/assets/svgs/chat/emtpy.svg'
import moment from 'moment'
import {
  TYPE_OF_MESSAGE,
  TYPE_OF_MESSAGE_SELECTED,
  TYPE_OF_MESSAGE_PAWN,
  TYPE_OF_MESSAGE_LEASE,
  TYPE_OF_MESSAGE_DEPOSIT
} from '@/utils/chatConstants'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const searchIcon = useIcon({ icon: 'uiw:search' })
const rightArrow = useIcon({ icon: 'material-symbols:chevron-right' })
export default {
  name: 'ManageChat',
  data() {
    return {
      TYPE_OF_MESSAGE_PAWN,
      TYPE_OF_MESSAGE_LEASE,
      TYPE_OF_MESSAGE_DEPOSIT,
      dIcon,
      emptyIcon,
      searchIcon,
      activeName: TYPE_OF_MESSAGE_SELECTED,
      typeMessageSelected: TYPE_OF_MESSAGE_SELECTED,
      search: '',
      searchPeople: '',
      chatContent: '',
      statusSell: 1,
      Avatar:
        'https://toigingiuvedep.vn/wp-content/uploads/2021/05/avatar-hinh-anh-dai-dien-nguoi-giau-mat.jpg',
      selectedUser: null,
      isChannelId: null,
      users: [
        {
          _id: '619b472a8f0d634cb1dbc90a',
          userID: '3388729826251144eff683e410c6a1cc',
          UserName: 'vinhntry',
          Name: 'Trọng Vinh',
          connected: true,
          unreadMessage: true,
          message: [
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: 'hu hu',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T03:01:58.308Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: 'abc',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:07:57.867Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: 'h i hi',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:08:55.171Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: 'he he',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:08:58.837Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: 'a hi hi',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:17:31.958Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: 'bạn muốn mình tư vấn gì ạ',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-03-14T04:57:09.039Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: '3213',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-07T10:24:39.176Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: '12321',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-07T10:24:41.201Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: '123',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-07T10:24:42.519Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: '13',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-07T10:24:45.017Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            }
          ]
        },
        {
          _id: '619b480d8f0d634cb1dbc90b',
          userID: 'c8afe1e6e67a545d2d3d898bca9a983f',
          UserName: 'vinhnt1',
          unreadMessage: true,
          connected: true,
          message: []
        },
        {
          _id: '619b4e7e8f0d634cb1dbc90c',
          userID: '1118aa62d3b31f7177e878c382c91594',
          UserName: 'aaa',
          unreadMessage: true,
          connected: true,
          message: [
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'Mình có thể giúp gì cho bạn',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-28T07:02:02.549Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'DDA xin chào quý khách',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-28T07:02:12.149Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'DDA',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-28T07:02:35.516Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'DDA xin chào quý khách',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-29T04:26:02.331Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'alo',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-01-05T08:19:41.124Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'noah 2',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:18:54.307Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'sdkjf ',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:45:18.989Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'glksdfj dfklgj argj',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:45:23.619Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'abc',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:56:50.399Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'abc',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:02:36.683Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61a0ac99039f3d67ffdf5c63',
          userID: '90dcda6de4e999b417b527134dac4539',
          UserName: 'vinht',
          connected: true,
          message: []
        },
        {
          _id: '61a74033924671bf6cc06449',
          userID: 'f56ea76e4f3035c3720dba43f6279cf2',
          UserName: 'tongphuong',
          connected: true,
          message: [
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: 'Mình có thể giúp gì cho bạn',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-26T04:27:46.450Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: 'noah ',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:19:35.907Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: '',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:19:36.036Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: '',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:19:37.745Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: '',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:19:43.691Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: '',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:19:44.643Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: 'ahii',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:14:59.333Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: 'he he',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:27:23.604Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: 'ho ho',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:27:27.340Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: 'he he',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:27:32.204Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            }
          ]
        },
        {
          _id: '61a740fc924671bf6cc0644c',
          userID: '9d65bbb3caa010f198ba77321b21a87a',
          UserName: 'nam',
          connected: true,
          message: []
        },
        {
          _id: '61a7480913d317dafdfb833f',
          userID: '53d059103929a5211ffb0ca6afa007a5',
          UserName: 'dsa',
          connected: true,
          message: []
        },
        {
          _id: '61a74f29dcc8f2db3ae6dfb9',
          userID: '283f8b366b0d7a4a227ab8b90617df70',
          UserName: 'dsasd',
          connected: true,
          message: []
        },
        {
          _id: '61a82c38dcc8f2db3ae6dfba',
          userID: '101ddbabf295efa23120beea196a7d35',
          UserName: 'UserName',
          Name: 'Khách',
          connected: true,
          message: []
        },
        {
          _id: '61a87f0845eac1953917f809',
          userID: '2a069dfdfed3c8ded2035f1e26ced812',
          UserName: '0987654325',
          connected: true,
          message: [
            {
              _id: '620afe8341e0cb4dd6dde50b',
              channelId: '61a9c2ab94281cb25174f3da',
              messages: {
                content: 'iii',
                from: '0987654325',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-15T01:14:43.297Z'
              },
              createdDate: '2022-02-15T01:14:43.297Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '620afe8341e0cb4dd6dde50b',
              channelId: '61a9c2ab94281cb25174f3da',
              messages: {
                content: 'by',
                from: '0987654325',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-15T01:15:16.705Z'
              },
              createdDate: '2022-02-15T01:14:43.297Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '620afe8341e0cb4dd6dde50b',
              channelId: '61a9c2ab94281cb25174f3da',
              messages: {
                content: 'test tin nhan 1',
                from: '0987654325',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-23T15:51:09.997Z'
              },
              createdDate: '2022-02-15T01:14:43.297Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '620afe8341e0cb4dd6dde50b',
              channelId: '61a9c2ab94281cb25174f3da',
              messages: {
                content: '',
                from: '0987654325',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637812536126465785.jpg'],
                createdDate: '2022-02-23T15:53:32.987Z'
              },
              createdDate: '2022-02-15T01:14:43.297Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '620afe8341e0cb4dd6dde50b',
              channelId: '61a9c2ab94281cb25174f3da',
              messages: {
                content: 'no more',
                from: 'admin',
                to: '0987654325',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:15:04.650Z'
              },
              createdDate: '2022-02-15T01:14:43.297Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '620afe8341e0cb4dd6dde50b',
              channelId: '61a9c2ab94281cb25174f3da',
              messages: {
                content: 'baby',
                from: 'admin',
                to: '0987654325',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:15:10.575Z'
              },
              createdDate: '2022-02-15T01:14:43.297Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '620afe8341e0cb4dd6dde50b',
              channelId: '61a9c2ab94281cb25174f3da',
              messages: {
                content: 'one more time',
                from: 'admin',
                to: '0987654325',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:15:16.990Z'
              },
              createdDate: '2022-02-15T01:14:43.297Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61a9985291a951fbbc289b0d',
          userID: 'beef8ed523d441ca969a3249befa8254',
          UserName: 'aaaa',
          connected: true,
          message: []
        },
        {
          _id: '61ae1f6d2e7a52c14dfe3f52',
          userID: '75e4d02c14c9c73f839803b7c4fc5977',
          UserName: 'null',
          connected: true,
          message: [
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'DDA xin chào quý khách',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-21T10:02:30.060Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'bbgb',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-24T09:23:32.920Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'aaa',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-24T09:24:17.939Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'DDA xin chào quý khách',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-24T09:36:08.769Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'hello',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-28T03:13:06.513Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'Mình có thể giúp gì cho bạn ??',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-28T04:47:04.452Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'hoah',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:02:45.105Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'hehe',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:02:50.875Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'hi hi',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:03:02.405Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'abc',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:28:44.894Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61b7150e1b47a3f0d36d298d',
          userID: 'f461137c119f442b64ff6fd2b64351cf',
          UserName: '0968831712',
          connected: true,
          message: [
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: 'Bạn cần tư vấn về sản phẩm nào ạ',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-28T04:47:14.639Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: 'chao ban',
                from: '0968831712',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-01-05T03:07:07.644Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '',
                from: '0968831712',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637769741067046986.jpg'],
                createdDate: '2022-01-05T03:08:27.123Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '3213213',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T07:39:37.991Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '213',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T07:39:40.253Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '321',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T07:39:40.826Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '3',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T07:39:40.939Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '213',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T07:39:41.891Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '21321',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T07:39:47.524Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '21321',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T07:39:54.448Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            }
          ]
        },
        {
          _id: '61b9a5d0d6293fea415c72c9',
          userID: '1b335cc05c204a88cb0f275026bf46a6',
          UserName: '0971425768',
          connected: true,
          message: [
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: 'hi',
                from: '0971425768',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-04-06T06:40:33.237Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: 'ffdxoo',
                from: '0971425768',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-04-06T06:41:00.117Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: 'LO',
                from: 'admin',
                to: '0971425768',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T06:41:09.413Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: 'KP',
                from: 'admin',
                to: '0971425768',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T06:41:18.909Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: '3',
                from: 'admin',
                to: '0971425768',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T06:41:23.508Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: '1',
                from: 'admin',
                to: '0971425768',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T06:45:54.722Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: 'akjhd',
                from: 'admin',
                to: '0971425768',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T11:28:21.737Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: ';lk',
                from: 'admin',
                to: '0971425768',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T11:28:24.829Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: 'noah',
                from: 'admin',
                to: '0971425768',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T11:28:29.164Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: '',
                from: '0971425768',
                to: 'admin',
                idProduct: 10,
                idDeal: 108,
                idContract: null,
                images: null,
                createdDate: '2022-04-07T05:01:21.802Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61b9b177d6293fea415c72d0',
          userID: 'b7154098992378a3448f625dfe40e934',
          UserName: '0948033777',
          connected: true,
          message: [
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'chạd',
                from: '0948033777',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2021-12-15T09:12:28.445Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'jdjđ',
                from: '0948033777',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2021-12-15T09:12:53.707Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'hmm',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-15T09:58:10.528Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: '1234',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-15T10:01:48.550Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'alo',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-15T10:14:41.985Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'Bạn cần được tư vấn về sản phẩm nào ạ',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-15T10:42:27.816Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'hello',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-16T01:52:05.993Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'Chào bạn !!',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-21T10:02:49.183Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'hi',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:04:44.722Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'hi',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:04:51.681Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            }
          ]
        },
        {
          _id: '61c548e9a0df25ba8257ee9a',
          userID: 'b62e2e463551d092286b1a5670f6b4f7',
          UserName: '0971097569',
          connected: true,
          message: [
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'ko giúp đc gì đâu',
                from: '0971097569',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-01-20T10:30:25.837Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'tại sao',
                from: 'admin',
                to: '0971097569',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-01-20T10:31:09.109Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: '',
                from: '0971097569',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637782967300447356.jpg'],
                createdDate: '2022-01-20T10:32:10.559Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'alo',
                from: 'admin',
                to: '0971097569',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-10T07:13:14.740Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'mua ko bạn ề ',
                from: 'admin',
                to: '0971097569',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-10T07:13:31.066Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'alo',
                from: '0971097569',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-10T07:14:26.460Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'mua thì mua ko mua thì mua ',
                from: 'admin',
                to: '0971097569',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-10T07:15:06.303Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'ok',
                from: '0971097569',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-10T07:15:16.889Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'ok',
                from: '0971097569',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-10T07:15:38.725Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'vâng ',
                from: 'admin',
                to: '0971097569',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-10T07:18:02.963Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61ceda1b05fa2bfd3f63fa79',
          userID: '65014f73eeda5a64fd83ecc85759a288',
          UserName: '0986868686',
          connected: true,
          message: [
            {
              _id: '61ceda2205fa2bfd3f63fa7b',
              channelId: '61ceda1b05fa2bfd3f63fa7a',
              messages: {
                content: '',
                from: '0986868686',
                to: 'admin',
                idProduct: 1,
                idDeal: 95,
                idContract: null,
                images: null,
                createdDate: '2021-12-31T10:23:30.024Z'
              },
              createdDate: '2021-12-31T10:23:30.024Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61ceda2205fa2bfd3f63fa7b',
              channelId: '61ceda1b05fa2bfd3f63fa7a',
              messages: {
                content: '',
                from: '0986868686',
                to: 'admin',
                idProduct: 33,
                idDeal: 96,
                idContract: null,
                images: null,
                createdDate: '2021-12-31T10:24:19.202Z'
              },
              createdDate: '2021-12-31T10:23:30.024Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61d54a11b9b3f27f0fc27ae5',
          userID: '2e3af69aea47b2486fc441aa41f0cff7',
          UserName: '0948033770',
          connected: true,
          message: [
            {
              _id: '61dea62934451b4abf436978',
              channelId: '61cc01a442f69d4a1de474aa',
              messages: {
                content: 'qksss',
                from: '0948033770',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-01-12T09:58:01.747Z'
              },
              createdDate: '2022-01-12T09:58:01.747Z',
              type: 'TuVanMuaHang'
            }
          ]
        },
        {
          _id: '61dbe64fa5d42602d6cba1cd',
          userID: 'e827cbc74c33c0e43a97c5d76f75e4e6',
          UserName: '0974268395',
          connected: true,
          message: []
        },
        {
          _id: '61de7a00c8bf742624217844',
          userID: 'e1c30b18a06e231ac118c3e215a70947',
          UserName: '0866936832',
          connected: true,
          message: []
        },
        {
          _id: '61dfd778175ea78996a895be',
          userID: 'ca01bf5e1e1c7f429a0af9c1faf1dc27',
          UserName: '0343402954',
          connected: true,
          message: [
            {
              _id: '61e15a7d9380fc33510c0cfc',
              channelId: '61dfd778175ea78996a895bf',
              messages: {
                content: 'chào bạn. mình muôn mua túi xách',
                from: '0343402954',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-01-14T11:11:57.604Z'
              },
              createdDate: '2022-01-14T11:11:57.604Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e15a7d9380fc33510c0cfc',
              channelId: '61dfd778175ea78996a895bf',
              messages: {
                content: 'sách gì',
                from: 'admin',
                to: '0343402954',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-01-14T11:12:16.778Z'
              },
              createdDate: '2022-01-14T11:11:57.604Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e15a7d9380fc33510c0cfc',
              channelId: '61dfd778175ea78996a895bf',
              messages: {
                content: 'xách gì',
                from: 'admin',
                to: '0343402954',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-01-14T11:12:26.090Z'
              },
              createdDate: '2022-01-14T11:11:57.604Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e15a7d9380fc33510c0cfc',
              channelId: '61dfd778175ea78996a895bf',
              messages: {
                content: '',
                from: '0343402954',
                to: 'admin',
                idProduct: 37,
                idDeal: 103,
                idContract: null,
                images: null,
                createdDate: '2022-01-14T11:12:46.483Z'
              },
              createdDate: '2022-01-14T11:11:57.604Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e15a7d9380fc33510c0cfc',
              channelId: '61dfd778175ea78996a895bf',
              messages: {
                content: 'scsvsfnng',
                from: '0343402954',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-01-24T04:56:20.754Z'
              },
              createdDate: '2022-01-14T11:11:57.604Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61e459e028bf5e82d134815a',
          userID: '1342749b68257284073ab7f76c3ae97a',
          UserName: '0972482955',
          connected: true,
          message: [
            {
              _id: '61e459e328bf5e82d134815c',
              channelId: '61e459e028bf5e82d134815b',
              messages: {
                content: 'alo',
                from: '0972482955',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-01-16T17:46:11.744Z'
              },
              createdDate: '2022-01-16T17:46:11.744Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e459e328bf5e82d134815c',
              channelId: '61e459e028bf5e82d134815b',
              messages: {
                content: '',
                from: '0972482955',
                to: 'admin',
                idProduct: 72,
                idDeal: 104,
                idContract: null,
                images: null,
                createdDate: '2022-01-16T17:46:19.878Z'
              },
              createdDate: '2022-01-16T17:46:11.744Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e459e328bf5e82d134815c',
              channelId: '61e459e028bf5e82d134815b',
              messages: {
                content: 'sđsf',
                from: 'admin',
                to: '0972482955',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-01-16T17:46:34.425Z'
              },
              createdDate: '2022-01-16T17:46:11.744Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e459e328bf5e82d134815c',
              channelId: '61e459e028bf5e82d134815b',
              messages: {
                content: 'đây',
                from: 'admin',
                to: '0972482955',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-01-16T17:46:58.838Z'
              },
              createdDate: '2022-01-16T17:46:11.744Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e459e328bf5e82d134815c',
              channelId: '61e459e028bf5e82d134815b',
              messages: {
                content: 'okw',
                from: '0972482955',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-01-16T17:47:01.994Z'
              },
              createdDate: '2022-01-16T17:46:11.744Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e459e328bf5e82d134815c',
              channelId: '61e459e028bf5e82d134815b',
              messages: {
                content: 'hello',
                from: 'admin',
                to: '0972482955',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-01-18T02:03:49.188Z'
              },
              createdDate: '2022-01-16T17:46:11.744Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61e7cf1045879f50a4f49adf',
          userID: '511e5a195212a1050e14d24ffbd82ad9',
          UserName: '0987654345',
          connected: true,
          message: []
        },
        {
          _id: '61e8f0fd39b0eafa8efcd961',
          userID: '05058a1aa087973c90e5e9f601e81887',
          UserName: '0911966900',
          connected: true,
          message: []
        },
        {
          _id: '61f246b9f5411b68b3e22521',
          userID: '1d78d4b172b8c19807771283f07a2be0',
          UserName: '0384481639',
          connected: true,
          message: [
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: 'bạn muốn tìm hiểu thông tin sản phẩm gì ạ',
                from: 'admin',
                to: '0384481639',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-10T08:15:13.351Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: '???',
                from: 'admin',
                to: '0384481639',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-10T08:16:47.968Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: '',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637801031763193271.jpg'],
                createdDate: '2022-02-10T08:19:36.658Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: '',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637801032002320288.jpg'],
                createdDate: '2022-02-10T08:20:00.324Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: '',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637801032120282685.png'],
                createdDate: '2022-02-10T08:20:12.136Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: '',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637801032280270893.jpg'],
                createdDate: '2022-02-10T08:20:28.259Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: '',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637801032610714670.jpg'],
                createdDate: '2022-02-10T08:21:01.834Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: 'xin chào mn ngày 11/2',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-11T02:26:16.570Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: 'xin chào shop',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-11T02:33:03.630Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: '',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637801905754720196.jpg'],
                createdDate: '2022-02-11T08:36:16.049Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '620b54b0491a0d83420bd1e7',
          userID: '841bf83d63f60645c0e3a209f82636a2',
          UserName: '0974268356',
          connected: true,
          message: [
            {
              _id: '620cae47e3d431dba12a7baa',
              channelId: '620b54b0491a0d83420bd1e8',
              messages: {
                content: '',
                from: '0974268356',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637806202153966205.webp'],
                createdDate: '2022-02-16T07:56:55.662Z'
              },
              createdDate: '2022-02-16T07:56:55.662Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '620cae47e3d431dba12a7baa',
              channelId: '620b54b0491a0d83420bd1e8',
              messages: {
                content: 'alo',
                from: '0974268356',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-16T07:57:02.498Z'
              },
              createdDate: '2022-02-16T07:56:55.662Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '6219e5dbe9fe3530a7173a1c',
          userID: '9e58ddc9a33182a194e71a5f4ba8ccfa',
          UserName: '0974268396',
          connected: true,
          message: [
            {
              _id: '6219e5dde9fe3530a7173a1e',
              channelId: '6219e5dbe9fe3530a7173a1d',
              messages: {
                content: 'â',
                from: '0974268396',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-26T08:33:33.028Z'
              },
              createdDate: '2022-02-26T08:33:33.028Z',
              type: 'TuVanMuaHang'
            }
          ]
        },
        {
          _id: '622c4a5de64b49c2eb1c2978',
          userID: 'f70ccd3652f79295b1aac31ec4914122',
          UserName: '0977226699',
          connected: true,
          message: [
            {
              _id: '622c4a5fe64b49c2eb1c297a',
              channelId: '622c4a5de64b49c2eb1c2979',
              messages: {
                content: '.',
                from: '0977226699',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-03-12T07:23:11.887Z'
              },
              createdDate: '2022-03-12T07:23:11.887Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '622c4a5fe64b49c2eb1c297a',
              channelId: '622c4a5de64b49c2eb1c2979',
              messages: {
                content: '',
                from: '0977226699',
                to: 'admin',
                idProduct: 129,
                idDeal: 107,
                idContract: null,
                images: null,
                createdDate: '2022-03-12T07:23:23.345Z'
              },
              createdDate: '2022-03-12T07:23:11.887Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '622ecbd4386037b0b67e6ba2',
          userID: '0a26e4495b023bff1cd961461b4c883b',
          UserName: '0352528091',
          connected: true,
          message: [
            {
              _id: '622ecbd9386037b0b67e6ba4',
              channelId: '622ecbd4386037b0b67e6ba3',
              messages: {
                content: 'hello',
                from: '0352528091',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-03-14T05:00:09.177Z'
              },
              createdDate: '2022-03-14T05:00:09.177Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '622ecbd9386037b0b67e6ba4',
              channelId: '622ecbd4386037b0b67e6ba3',
              messages: {
                content: 'xin chào',
                from: '0352528091',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-03-14T05:00:29.504Z'
              },
              createdDate: '2022-03-14T05:00:09.177Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '624e703867e63da46de853ad',
          userID: '6344a3303bba8edc8fe7ac2d7bbc87a8',
          UserName: '0988614190',
          connected: true,
          message: [
            {
              _id: '624e704667e63da46de853b0',
              channelId: '624e703867e63da46de853ae',
              messages: {
                content: 'alo',
                from: '0988614190',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-04-07T05:01:58.406Z'
              },
              createdDate: '2022-04-07T05:01:58.406Z',
              type: 'TuVanMuaHang'
            }
          ]
        }
      ],
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
          type: 'TuVanMuaHang'
        }
      ],
      listTypeMessage: TYPE_OF_MESSAGE,
      currentUsersFollowTab: [
        {
          _id: '619b472a8f0d634cb1dbc90a',
          userID: '3388729826251144eff683e410c6a1cc',
          UserName: 'vinhnt',
          Name: 'Trọng Vinh',
          unreadMessage: true,
          connected: true,
          message: [
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: 'hu hu',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T03:01:58.308Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: 'abc',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:07:57.867Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: 'h i hi',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:08:55.171Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: 'he he',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:08:58.837Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: 'a hi hi',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:17:31.958Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: 'bạn muốn mình tư vấn gì ạ',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-03-14T04:57:09.039Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd4f3e1231231233332',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: 'hello world',
                from: 'vinhnt',
                to: 'admin',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-03-14T04:57:09.039Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e1232132',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: 'yessir',
                from: 'vinhnt',
                to: 'admin',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-03-14T04:57:09.039Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: '3213',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-07T10:24:39.176Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: '12321',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-07T10:24:41.201Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: '123',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-07T10:24:42.519Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            },
            {
              _id: '61a9edd594281cb25174f3e2',
              channelId: '61a9c2ab94281cb25174f3d4',
              type: 'TuVanMuaHang',
              messages: {
                content: '13',
                from: 'admin',
                to: 'vinhnt',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-07T10:24:45.017Z'
              },
              createdDate: '2021-12-03T10:13:41.308Z',
              newMessage: true
            }
          ]
        },
        {
          _id: '619b4e7e8f0d634cb1dbc90c',
          userID: '1118aa62d3b31f7177e878c382c91594',
          UserName: 'aaa',
          connected: true,
          message: [
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'Mình có thể giúp gì cho bạn',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-28T07:02:02.549Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'DDA xin chào quý khách',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-28T07:02:12.149Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'DDA',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-28T07:02:35.516Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'DDA xin chào quý khách',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-29T04:26:02.331Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'alo',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-01-05T08:19:41.124Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'noah 2',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:18:54.307Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'sdkjf ',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:45:18.989Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'glksdfj dfklgj argj',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:45:23.619Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'abc',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:56:50.399Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61b824f19f376c8369c9ca00',
              channelId: '61a9c2ab94281cb25174f3d5',
              messages: {
                content: 'abc',
                from: 'admin',
                to: 'aaa',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:02:36.683Z'
              },
              createdDate: '2021-12-14T05:00:33.945Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61a74033924671bf6cc06449',
          userID: 'f56ea76e4f3035c3720dba43f6279cf2',
          UserName: 'tongphuong',
          connected: true,
          message: [
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: 'Mình có thể giúp gì cho bạn',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-26T04:27:46.450Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: 'noah ',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:19:35.907Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: '',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:19:36.036Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: '',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:19:37.745Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: '',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:19:43.691Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: '',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T02:19:44.643Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: 'ahii',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:14:59.333Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: 'he he',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:27:23.604Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: 'ho ho',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:27:27.340Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            },
            {
              _id: '61aad1d294281cb25174f3e3',
              channelId: '61a9c2ab94281cb25174f3dc',
              type: 'TuVanMuaHang',
              messages: {
                content: 'he he',
                from: 'admin',
                to: 'tongphuong',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:27:32.204Z'
              },
              createdDate: '2021-12-04T02:26:26.668Z',
              newMessage: true
            }
          ]
        },
        {
          _id: '61a87f0845eac1953917f809',
          userID: '2a069dfdfed3c8ded2035f1e26ced812',
          UserName: '0987654325',
          connected: true,
          message: [
            {
              _id: '620afe8341e0cb4dd6dde50b',
              channelId: '61a9c2ab94281cb25174f3da',
              messages: {
                content: 'iii',
                from: '0987654325',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-15T01:14:43.297Z'
              },
              createdDate: '2022-02-15T01:14:43.297Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '620afe8341e0cb4dd6dde50b',
              channelId: '61a9c2ab94281cb25174f3da',
              messages: {
                content: 'by',
                from: '0987654325',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-15T01:15:16.705Z'
              },
              createdDate: '2022-02-15T01:14:43.297Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '620afe8341e0cb4dd6dde50b',
              channelId: '61a9c2ab94281cb25174f3da',
              messages: {
                content: 'test tin nhan 1',
                from: '0987654325',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-23T15:51:09.997Z'
              },
              createdDate: '2022-02-15T01:14:43.297Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '620afe8341e0cb4dd6dde50b',
              channelId: '61a9c2ab94281cb25174f3da',
              messages: {
                content: '',
                from: '0987654325',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637812536126465785.jpg'],
                createdDate: '2022-02-23T15:53:32.987Z'
              },
              createdDate: '2022-02-15T01:14:43.297Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '620afe8341e0cb4dd6dde50b',
              channelId: '61a9c2ab94281cb25174f3da',
              messages: {
                content: 'no more',
                from: 'admin',
                to: '0987654325',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:15:04.650Z'
              },
              createdDate: '2022-02-15T01:14:43.297Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '620afe8341e0cb4dd6dde50b',
              channelId: '61a9c2ab94281cb25174f3da',
              messages: {
                content: 'baby',
                from: 'admin',
                to: '0987654325',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:15:10.575Z'
              },
              createdDate: '2022-02-15T01:14:43.297Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '620afe8341e0cb4dd6dde50b',
              channelId: '61a9c2ab94281cb25174f3da',
              messages: {
                content: 'one more time',
                from: 'admin',
                to: '0987654325',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:15:16.990Z'
              },
              createdDate: '2022-02-15T01:14:43.297Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61ae1f6d2e7a52c14dfe3f52',
          userID: '75e4d02c14c9c73f839803b7c4fc5977',
          UserName: 'null',
          connected: true,
          message: [
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'DDA xin chào quý khách',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-21T10:02:30.060Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'bbgb',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-24T09:23:32.920Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'aaa',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-24T09:24:17.939Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'DDA xin chào quý khách',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-24T09:36:08.769Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'hello',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-28T03:13:06.513Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'Mình có thể giúp gì cho bạn ??',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-28T04:47:04.452Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'hoah',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:02:45.105Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'hehe',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:02:50.875Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'hi hi',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:03:02.405Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61badcedda4a46d0caf89da0',
              channelId: '61b812ff1362707829513e17',
              messages: {
                content: 'abc',
                from: 'admin',
                to: 'null',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:28:44.894Z'
              },
              createdDate: '2021-12-16T06:30:05.644Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61b7150e1b47a3f0d36d298d',
          userID: 'f461137c119f442b64ff6fd2b64351cf',
          UserName: '0968831712',
          connected: true,
          message: [
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: 'Bạn cần tư vấn về sản phẩm nào ạ',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-28T04:47:14.639Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: 'chao ban',
                from: '0968831712',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-01-05T03:07:07.644Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '',
                from: '0968831712',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637769741067046986.jpg'],
                createdDate: '2022-01-05T03:08:27.123Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '3213213',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T07:39:37.991Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '213',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T07:39:40.253Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '321',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T07:39:40.826Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '3',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T07:39:40.939Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '213',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T07:39:41.891Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '21321',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T07:39:47.524Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b840a533689ee8dc6c4983',
              channelId: '61b812ff1362707829513e18',
              messages: {
                content: '21321',
                from: 'admin',
                to: '0968831712',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T07:39:54.448Z'
              },
              createdDate: '2021-12-14T06:58:45.434Z',
              type: null,
              newMessage: true
            }
          ]
        },
        {
          _id: '61b9a5d0d6293fea415c72c9',
          userID: '1b335cc05c204a88cb0f275026bf46a6',
          UserName: '0971425768',
          connected: true,
          message: [
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: 'hi',
                from: '0971425768',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-04-06T06:40:33.237Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: 'ffdxoo',
                from: '0971425768',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-04-06T06:41:00.117Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: 'LO',
                from: 'admin',
                to: '0971425768',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T06:41:09.413Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: 'KP',
                from: 'admin',
                to: '0971425768',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T06:41:18.909Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: '3',
                from: 'admin',
                to: '0971425768',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T06:41:23.508Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: '1',
                from: 'admin',
                to: '0971425768',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T06:45:54.722Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: 'akjhd',
                from: 'admin',
                to: '0971425768',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T11:28:21.737Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: ';lk',
                from: 'admin',
                to: '0971425768',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T11:28:24.829Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: 'noah',
                from: 'admin',
                to: '0971425768',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-04-06T11:28:29.164Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cbfff042f69d4a1de474a9',
              channelId: '61b9a5d0d6293fea415c72ca',
              messages: {
                content: '',
                from: '0971425768',
                to: 'admin',
                idProduct: 10,
                idDeal: 108,
                idContract: null,
                images: null,
                createdDate: '2022-04-07T05:01:21.802Z'
              },
              createdDate: '2021-12-29T06:28:00.847Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61b9b177d6293fea415c72d0',
          userID: 'b7154098992378a3448f625dfe40e934',
          UserName: '0948033777',
          connected: true,
          message: [
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'chạd',
                from: '0948033777',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2021-12-15T09:12:28.445Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'jdjđ',
                from: '0948033777',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2021-12-15T09:12:53.707Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'hmm',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-15T09:58:10.528Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: '1234',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-15T10:01:48.550Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'alo',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-15T10:14:41.985Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'Bạn cần được tư vấn về sản phẩm nào ạ',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-15T10:42:27.816Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'hello',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-16T01:52:05.993Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'Chào bạn !!',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2021-12-21T10:02:49.183Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'hi',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:04:44.722Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            },
            {
              _id: '61b9b17cd6293fea415c72d2',
              channelId: '61b9b177d6293fea415c72d1',
              messages: {
                content: 'hi',
                from: 'admin',
                to: '0948033777',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-25T04:04:51.681Z'
              },
              createdDate: '2021-12-15T09:12:28.445Z',
              type: null,
              newMessage: true
            }
          ]
        },
        {
          _id: '61c548e9a0df25ba8257ee9a',
          userID: 'b62e2e463551d092286b1a5670f6b4f7',
          UserName: '0971097569',
          connected: true,
          message: [
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'ko giúp đc gì đâu',
                from: '0971097569',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-01-20T10:30:25.837Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'tại sao',
                from: 'admin',
                to: '0971097569',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-01-20T10:31:09.109Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: '',
                from: '0971097569',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637782967300447356.jpg'],
                createdDate: '2022-01-20T10:32:10.559Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'alo',
                from: 'admin',
                to: '0971097569',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-10T07:13:14.740Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'mua ko bạn ề ',
                from: 'admin',
                to: '0971097569',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-10T07:13:31.066Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'alo',
                from: '0971097569',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-10T07:14:26.460Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'mua thì mua ko mua thì mua ',
                from: 'admin',
                to: '0971097569',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-10T07:15:06.303Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'ok',
                from: '0971097569',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-10T07:15:16.889Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'ok',
                from: '0971097569',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-10T07:15:38.725Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61cc027842f69d4a1de474af',
              channelId: '61c548e9a0df25ba8257ee9b',
              messages: {
                content: 'vâng ',
                from: 'admin',
                to: '0971097569',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-10T07:18:02.963Z'
              },
              createdDate: '2021-12-29T06:38:48.922Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61ceda1b05fa2bfd3f63fa79',
          userID: '65014f73eeda5a64fd83ecc85759a288',
          UserName: '0986868686',
          connected: true,
          message: [
            {
              _id: '61ceda2205fa2bfd3f63fa7b',
              channelId: '61ceda1b05fa2bfd3f63fa7a',
              messages: {
                content: '',
                from: '0986868686',
                to: 'admin',
                idProduct: 1,
                idDeal: 95,
                idContract: null,
                images: null,
                createdDate: '2021-12-31T10:23:30.024Z'
              },
              createdDate: '2021-12-31T10:23:30.024Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61ceda2205fa2bfd3f63fa7b',
              channelId: '61ceda1b05fa2bfd3f63fa7a',
              messages: {
                content: '',
                from: '0986868686',
                to: 'admin',
                idProduct: 33,
                idDeal: 96,
                idContract: null,
                images: null,
                createdDate: '2021-12-31T10:24:19.202Z'
              },
              createdDate: '2021-12-31T10:23:30.024Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61d54a11b9b3f27f0fc27ae5',
          userID: '2e3af69aea47b2486fc441aa41f0cff7',
          UserName: '0948033770',
          connected: true,
          message: [
            {
              _id: '61dea62934451b4abf436978',
              channelId: '61cc01a442f69d4a1de474aa',
              messages: {
                content: 'qksss',
                from: '0948033770',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-01-12T09:58:01.747Z'
              },
              createdDate: '2022-01-12T09:58:01.747Z',
              type: 'TuVanMuaHang'
            }
          ]
        },
        {
          _id: '61dfd778175ea78996a895be',
          userID: 'ca01bf5e1e1c7f429a0af9c1faf1dc27',
          UserName: '0343402954',
          connected: true,
          message: [
            {
              _id: '61e15a7d9380fc33510c0cfc',
              channelId: '61dfd778175ea78996a895bf',
              messages: {
                content: 'chào bạn. mình muôn mua túi xách',
                from: '0343402954',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-01-14T11:11:57.604Z'
              },
              createdDate: '2022-01-14T11:11:57.604Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e15a7d9380fc33510c0cfc',
              channelId: '61dfd778175ea78996a895bf',
              messages: {
                content: 'sách gì',
                from: 'admin',
                to: '0343402954',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-01-14T11:12:16.778Z'
              },
              createdDate: '2022-01-14T11:11:57.604Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e15a7d9380fc33510c0cfc',
              channelId: '61dfd778175ea78996a895bf',
              messages: {
                content: 'xách gì',
                from: 'admin',
                to: '0343402954',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-01-14T11:12:26.090Z'
              },
              createdDate: '2022-01-14T11:11:57.604Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e15a7d9380fc33510c0cfc',
              channelId: '61dfd778175ea78996a895bf',
              messages: {
                content: '',
                from: '0343402954',
                to: 'admin',
                idProduct: 37,
                idDeal: 103,
                idContract: null,
                images: null,
                createdDate: '2022-01-14T11:12:46.483Z'
              },
              createdDate: '2022-01-14T11:11:57.604Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e15a7d9380fc33510c0cfc',
              channelId: '61dfd778175ea78996a895bf',
              messages: {
                content: 'scsvsfnng',
                from: '0343402954',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-01-24T04:56:20.754Z'
              },
              createdDate: '2022-01-14T11:11:57.604Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61e459e028bf5e82d134815a',
          userID: '1342749b68257284073ab7f76c3ae97a',
          UserName: '0972482955',
          connected: true,
          message: [
            {
              _id: '61e459e328bf5e82d134815c',
              channelId: '61e459e028bf5e82d134815b',
              messages: {
                content: 'alo',
                from: '0972482955',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-01-16T17:46:11.744Z'
              },
              createdDate: '2022-01-16T17:46:11.744Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e459e328bf5e82d134815c',
              channelId: '61e459e028bf5e82d134815b',
              messages: {
                content: '',
                from: '0972482955',
                to: 'admin',
                idProduct: 72,
                idDeal: 104,
                idContract: null,
                images: null,
                createdDate: '2022-01-16T17:46:19.878Z'
              },
              createdDate: '2022-01-16T17:46:11.744Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e459e328bf5e82d134815c',
              channelId: '61e459e028bf5e82d134815b',
              messages: {
                content: 'sđsf',
                from: 'admin',
                to: '0972482955',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-01-16T17:46:34.425Z'
              },
              createdDate: '2022-01-16T17:46:11.744Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e459e328bf5e82d134815c',
              channelId: '61e459e028bf5e82d134815b',
              messages: {
                content: 'đây',
                from: 'admin',
                to: '0972482955',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-01-16T17:46:58.838Z'
              },
              createdDate: '2022-01-16T17:46:11.744Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e459e328bf5e82d134815c',
              channelId: '61e459e028bf5e82d134815b',
              messages: {
                content: 'okw',
                from: '0972482955',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-01-16T17:47:01.994Z'
              },
              createdDate: '2022-01-16T17:46:11.744Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '61e459e328bf5e82d134815c',
              channelId: '61e459e028bf5e82d134815b',
              messages: {
                content: 'hello',
                from: 'admin',
                to: '0972482955',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-01-18T02:03:49.188Z'
              },
              createdDate: '2022-01-16T17:46:11.744Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '61f246b9f5411b68b3e22521',
          userID: '1d78d4b172b8c19807771283f07a2be0',
          UserName: '0384481639',
          connected: true,
          message: [
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: 'bạn muốn tìm hiểu thông tin sản phẩm gì ạ',
                from: 'admin',
                to: '0384481639',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-10T08:15:13.351Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: '???',
                from: 'admin',
                to: '0384481639',
                idProduct: 0,
                idDeal: 0,
                idContract: 0,
                images: null,
                createdDate: '2022-02-10T08:16:47.968Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: '',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637801031763193271.jpg'],
                createdDate: '2022-02-10T08:19:36.658Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: '',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637801032002320288.jpg'],
                createdDate: '2022-02-10T08:20:00.324Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: '',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637801032120282685.png'],
                createdDate: '2022-02-10T08:20:12.136Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: '',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637801032280270893.jpg'],
                createdDate: '2022-02-10T08:20:28.259Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: '',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637801032610714670.jpg'],
                createdDate: '2022-02-10T08:21:01.834Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: 'xin chào mn ngày 11/2',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-11T02:26:16.570Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: 'xin chào shop',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-11T02:33:03.630Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '6204bb0dac1908a899e7ecc3',
              channelId: '61f246b9f5411b68b3e22522',
              messages: {
                content: '',
                from: '0384481639',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637801905754720196.jpg'],
                createdDate: '2022-02-11T08:36:16.049Z'
              },
              createdDate: '2022-02-10T07:13:17.652Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '620b54b0491a0d83420bd1e7',
          userID: '841bf83d63f60645c0e3a209f82636a2',
          UserName: '0974268356',
          connected: true,
          message: [
            {
              _id: '620cae47e3d431dba12a7baa',
              channelId: '620b54b0491a0d83420bd1e8',
              messages: {
                content: '',
                from: '0974268356',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: ['https://api.cooftech.net/General/637806202153966205.webp'],
                createdDate: '2022-02-16T07:56:55.662Z'
              },
              createdDate: '2022-02-16T07:56:55.662Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '620cae47e3d431dba12a7baa',
              channelId: '620b54b0491a0d83420bd1e8',
              messages: {
                content: 'alo',
                from: '0974268356',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-16T07:57:02.498Z'
              },
              createdDate: '2022-02-16T07:56:55.662Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '6219e5dbe9fe3530a7173a1c',
          userID: '9e58ddc9a33182a194e71a5f4ba8ccfa',
          UserName: '0974268396',
          connected: true,
          message: [
            {
              _id: '6219e5dde9fe3530a7173a1e',
              channelId: '6219e5dbe9fe3530a7173a1d',
              messages: {
                content: 'â',
                from: '0974268396',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-02-26T08:33:33.028Z'
              },
              createdDate: '2022-02-26T08:33:33.028Z',
              type: 'TuVanMuaHang'
            }
          ]
        },
        {
          _id: '622c4a5de64b49c2eb1c2978',
          userID: 'f70ccd3652f79295b1aac31ec4914122',
          UserName: '0977226699',
          connected: true,
          message: [
            {
              _id: '622c4a5fe64b49c2eb1c297a',
              channelId: '622c4a5de64b49c2eb1c2979',
              messages: {
                content: '.',
                from: '0977226699',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-03-12T07:23:11.887Z'
              },
              createdDate: '2022-03-12T07:23:11.887Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '622c4a5fe64b49c2eb1c297a',
              channelId: '622c4a5de64b49c2eb1c2979',
              messages: {
                content: '',
                from: '0977226699',
                to: 'admin',
                idProduct: 129,
                idDeal: 107,
                idContract: null,
                images: null,
                createdDate: '2022-03-12T07:23:23.345Z'
              },
              createdDate: '2022-03-12T07:23:11.887Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '622ecbd4386037b0b67e6ba2',
          userID: '0a26e4495b023bff1cd961461b4c883b',
          UserName: '0352528091',
          connected: true,
          message: [
            {
              _id: '622ecbd9386037b0b67e6ba4',
              channelId: '622ecbd4386037b0b67e6ba3',
              messages: {
                content: 'hello',
                from: '0352528091',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-03-14T05:00:09.177Z'
              },
              createdDate: '2022-03-14T05:00:09.177Z',
              type: 'TuVanMuaHang',
              newMessage: true
            },
            {
              _id: '622ecbd9386037b0b67e6ba4',
              channelId: '622ecbd4386037b0b67e6ba3',
              messages: {
                content: 'xin chào',
                from: '0352528091',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-03-14T05:00:29.504Z'
              },
              createdDate: '2022-03-14T05:00:09.177Z',
              type: 'TuVanMuaHang',
              newMessage: true
            }
          ]
        },
        {
          _id: '624e703867e63da46de853ad',
          userID: '6344a3303bba8edc8fe7ac2d7bbc87a8',
          UserName: '0988614190',
          connected: true,
          message: [
            {
              _id: '624e704667e63da46de853b0',
              channelId: '624e703867e63da46de853ae',
              messages: {
                content: 'alo',
                from: '0988614190',
                to: 'admin',
                idProduct: null,
                idDeal: null,
                idContract: null,
                images: null,
                createdDate: '2022-04-07T05:01:58.406Z'
              },
              createdDate: '2022-04-07T05:01:58.406Z',
              type: 'TuVanMuaHang'
            }
          ]
        }
      ]
    }
  },
  watch: {
    selectedUser: {
      handler() {
        //this.documentList = []
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
    }
  },
  methods: {
    onSelectUser(user) {
      this.selectedUser = user
      user.hasNewMessages = false
    },
    onMessage(content) {
      console.log('content', content)
    },
    hideDocumentList() {
      document.getElementById('hideDocument').style.display = 'none'
      document.getElementById('showDocument').style.display = 'block'
    },
    getDocument() {
      console.log('getDocument')
    },
    getTypeMessage(val) {
      console.log('filter this', val)
      this.selectedUser = this.currentUsersFollowTab[0]
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/chat.scss';
</style>
