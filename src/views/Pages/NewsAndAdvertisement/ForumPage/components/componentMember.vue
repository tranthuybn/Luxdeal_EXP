<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { ElCard, ElPopover, ElAvatar, ElButton, ElSelect, ElOption, ElInput } from 'element-plus'
import { ref, watch } from 'vue'
const { t } = useI18n()
const circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const memberType = ref(-1)
const memberTypes = ref([
  {
    value: -1,
    name: t('reuse.all')
  },
  {
    value: 1,
    name: t('reuse.customer')
  },
  {
    value: 2,
    name: t('reuse.employee')
  }
])
const emit = defineEmits(['get-member'])
let keyword = ref('')

const memberSelectChange = () => {
  keyword.value = ''
  getMemberEvent()
}
const getMemberEvent = () => {
  emit('get-member', { Keyword: keyword.value, UserType: memberType.value })
}
const searchingMember = () => {
  // searching in all members
  memberType.value = -1
  getMemberEvent()
}
const props = defineProps({
  search: { type: Object },
  members: { type: Array },
  isHomePage: { type: Boolean },
  totalMember: { type: Number }
})
type Member = {
  [key: string]: any
}
let memberListShowUp = ref<Member>()

if (Array.isArray(props.members)) {
  memberListShowUp.value = props.members.slice(0, 5)
  console.log('memberList', memberListShowUp.value)
}

watch(
  () => props.members,
  () => {
    if (Array.isArray(props.members)) {
      memberListShowUp.value = props.members.slice(0, 5)
      console.log('memberList', memberListShowUp.value)
    }
  }
)
const prohibitToPost = (id, item) => {
  console.log(id, item)
}
const removeUserForum = (obj) => {
  console.log(obj)
}
const loadMoreMember = () => {
  if (Array.isArray(props.members) && props.members.length > 0) {
    if (
      memberListShowUp.value != undefined &&
      memberListShowUp.value.length === props.members.length
    ) {
      //base_notify('warning', 'Đã hiển thị tất cả thành viên')
    } else {
      if (
        memberListShowUp.value != undefined &&
        props.members.length > memberListShowUp.value.length + 5
      ) {
        memberListShowUp.value = props.members.slice(0, memberListShowUp.value.length + 5)
      } else {
        memberListShowUp.value = props.members
      }
    }
  } else memberListShowUp.value = []
}
</script>
<template>
  <div>
    <el-card class="p-3">
      <div class="pb-4 border-bottom">
        <div class="fs-4 pt-3 font-bold">{{ t('reuse.people') }}</div>
        <div class="pt-3">
          <el-select v-model="memberType" @change="memberSelectChange">
            <el-option
              v-for="(item, index) in memberTypes"
              :key="index"
              :value="item.value"
              :label="item.name"
            >
              <div class="flex justify-between align-items-center">
                <span>{{ item.name }}</span>
                <i class="el-icon-arrow-right"></i>
              </div>
            </el-option>
          </el-select>
        </div>
        <div class="input-group mt-3">
          <el-input
            :placeholder="`${t('reuse.search')}...`"
            style="height: 40px"
            v-model="keyword"
            @change="searchingMember"
          />
        </div>
      </div>
      <div class="my-3">
        <div
          ><span class="font-bold dot pr-2">{{ t('reuse.member') }}</span
          ><span class="font-bold pl-2">{{ totalMember }}</span></div
        >
        <small>{{ t('reuse.thisIsAllTheMemberInTheForum') }}</small>
      </div>
      <div class="my-3">
        <div
          class="menu-list-item flex justify-between align-items-stretch p-3"
          v-for="(item, index) in memberListShowUp"
          :class="item.isPostProhibit ? 'bg-red-500 bg-opacity-10' : ''"
          :key="index + '-members'"
        >
          <div class="flex justify-content-start">
            <el-avatar :src="circleUrl" v-if="item.avatar" alt="" :size="47" />
            <el-avatar v-else icon="el-icon-user-solid" :size="47" />
            <div class="ps-3 w-75 pl-4">
              <div class="fullName font-bold">{{ item.fullName }}</div>
              <small>salon</small>
            </div>
          </div>
          <div class="fs-4 justify-content-end p-2 cursor">
            <el-popover
              placement="left"
              width="200"
              trigger="click"
              content="this is content, this is content, this is content"
            >
              <template #default>
                <div class="w-100 p-3">
                  <div
                    style="cursor: pointer"
                    class="pb-2 flex justify-between"
                    :class="item.isPostProhibit ? 'text-success' : 'text-danger'"
                    @click="prohibitToPost(item.id, item)"
                  >
                    {{ item.isPostProhibit ? t('reuse.allowPosting') : t('reuse.prohibitPosting') }}
                    <i class="el-icon-arrow-right"></i>
                  </div>
                  <div class="flex justify-between cursor"
                    ><span class="text-danger" @click="removeUserForum(item)">
                      {{ t('reuse.removeFromGroup') }}
                    </span>
                    <i class="el-icon-arrow-right"></i
                  ></div>
                </div>
              </template>
              <template #reference>
                <div class="flex justify-content-center align-item-center user-info-bar__utility">
                  <div class="dots"></div>
                  <div class="dots"></div>
                  <div class="dots"></div>
                </div>
              </template>
            </el-popover>
          </div>
        </div>
      </div>
    </el-card>
    <div class="mt-3 text-center"
      ><el-button class="base__btn-primary-outline" @click="loadMoreMember">{{
        t('reuse.loadMore')
      }}</el-button></div
    >
  </div>
</template>
<style lang="scss" scoped>
@import '@/styles/function.scss';
.menu-list-item {
  box-shadow: inset 0 11px 10px -12px #6596f3;
  &:hover {
    .fullName {
      text-decoration: underline;
      color: black;
    }
  }
}
.user-info-bar__utility {
  min-width: get-vw(30px);
  height: get-vh(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  &:hover {
    box-shadow: inset 0 11px 10px -12px #6596f3;
  }
}
.h-67-px {
  height: 67px;
}

:deep(.el-tabs__nav-scroll) {
  border-bottom: 0;
}

:deep(.el-tabs__nav-wrap::after) {
  background: none;
  height: 0;
}

:deep(.el-tabs__nav-scroll) {
  min-height: 3rem;
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__active-bar) {
  top: 100%;
}

.circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.rounded-20 {
  border-radius: 2rem;
}

.dot {
  position: relative;
}

.dot::after {
  content: ' ';
  position: absolute;
  left: 100%;
  width: 5px;
  height: 5px;
  bottom: 5px;
  border-radius: 50%;
  background: #0d0d0d;
}

.dots {
  margin-right: 3px;
  content: ' ';
  width: 5px;
  height: 5px;
  bottom: 5px;
  border-radius: 50%;
  background: #0d0d0d;
}

.image-map {
  height: 190px;
}

.image-new {
  height: 140px;
}

@media only screen and (max-width: 1400px) {
  .image-map {
    height: 133px;
  }
  .image-new {
    height: 94px;
  }
}

:deep(.el-textarea__inner) {
  border: none;
  padding-left: 2px;
}

:deep(.el-textarea__inner::placeholder) {
  font-style: italic;
}

:deep(.el-dialog--center .el-dialog__body) {
  padding-top: 0;
}

.fs-7 {
  font-size: 80%;
}

:deep(.el-popover) {
  padding: 0;
}

:deep(.el-popover--plain) {
  padding: 0 !important;
}
.input-group :deep(.el-input__wrapper) {
  border-radius: 50px;
}
</style>
