<template>
  <div>
    <el-card class="p-3">
      <div class="pb-4 border-bottom">
        <div class="fs-4 pt-3 fw-bold"> Mọi người</div>
        <div class="pt-3">
          <el-select v-model="memberType" @change="memberSelectChange">
            <el-option
              v-for="(item, index) in memberTypes"
              :key="index"
              :value="item.value"
              :label="item.name"
            >
              <div class="d-flex justify-content-between align-items-center">
                <span>{{ item.name }}</span>
                <i class="el-icon-arrow-right"></i>
              </div>
            </el-option>
          </el-select>
        </div>
        <div class="input-group input-group-lg mt-3">
          <input
            type="text"
            class="form-control rounded-20 bg-primary bg-opacity-10 fs-6"
            placeholder="Tìm kiếm ..."
            style="height: 40px"
            v-model="keyword"
            @change="searchingMember"
          />
        </div>
      </div>
      <div class="my-3">
        <div
          ><span class="fw-bold dot pe-2">Thành viên</span
          ><span class="fw-bold ps-3">{{ totalMember }}</span></div
        >
        <small>Đây là những thành viên đã có trong forum</small>
      </div>
      <div class="my-3">
        <div
          class="menu-list-item d-flex justify-content-between align-items-stretch p-3"
          v-for="(item, index) in memberListShowUp"
          :class="item.isPostProhibit ? 'bg-danger bg-opacity-10' : ''"
          :key="index + '-members'"
        >
          <div class="d-flex justify-content-start">
            <el-avatar :src="item.avatar" v-if="item.avatar" alt="" :size="47" />
            <el-avatar v-else icon="el-icon-user-solid" :size="47" />
            <div class="ps-3 w-75">
              <div class="fullName fw-bold fs-6">{{ item.fullName }}</div>
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
                    class="pb-2 d-flex justify-content-between"
                    :class="item.isPostProhibit ? 'text-success' : 'text-danger'"
                    @click="prohibitToPost(item.id, item)"
                  >
                    {{ item.isPostProhibit ? 'Cho phép đăng' : 'Cấm đăng' }}
                    <i class="el-icon-arrow-right"></i>
                  </div>
                  <div class="d-flex justify-content-between cursor"
                    ><span class="text-danger" @click="removeUserForum(item)">Xóa khỏi nhóm</span>
                    <i class="el-icon-arrow-right"></i
                  ></div>
                </div>
              </template>
              <template #reference>
                <div class="d-flex justify-content-center align-item-center user-info-bar__utility">
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
      ><el-button class="base__btn-primary-outline" @click="loadMoreMember"
        >Xem thêm</el-button
      ></div
    >
  </div>
</template>
<script>
import imageIcon from '@/assets/images/image-icon.svg'
import { RemoveUserInGroup } from '@/services/api/appManager'
import forumMixins from '../mixins'
export default {
  name: 'ComponentMember',
  mixins: [forumMixins],
  props: {
    search: { type: Object },
    members: { type: Array },
    isHomePage: { type: Boolean },
    totalMember: { type: String }
  },
  data() {
    return {
      imageIcon: imageIcon,
      keyword: '',
      memberListShowUp: [],
      memberType: -1,
      memberTypes: [
        {
          value: -1,
          name: 'Tất cả'
        },
        {
          value: 1,
          name: 'Khách hàng'
        },
        {
          value: 2,
          name: 'Nhân viên'
        }
      ]
    }
  },
  watch: {
    members: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.length === 0) {
          if (this.memberListShowUp.length > 0) {
            this.memberListShowUp.splice(0, this.memberListShowUp.length)
          }
        } else if (newVal.length !== oldVal.length || this.memberListShowUp.length === 0) {
          this.loadMoreMember()
        }
      }
    }
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name
    },
    removeUserForum(obj) {
      this.$prompt("Vui lòng nhập 'Xóa' để xóa người dùng ", 'Xóa người dùng', {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Đóng',
        inputValidator: (value) => {
          if (value !== 'Xóa') {
            return 'Không hợp lệ'
          }
        },
        inputErrorMessage: 'Không hợp lệ'
      })
        .then(({ value }) => {
          RemoveUserInGroup({ Id: obj.id, Email: obj.email, Phone: obj.phone }).then((res) => {
            const { data } = res.data
            if (res.status === 200 && res.data.statusCode === 200 && data) {
              this.$base_notify('success', data.message ?? 'Xóa thành công')
              this.memberListShowUp.splice(
                this.memberListShowUp.findIndex((el) => el.id === obj.id),
                1
              )
            } else {
              this.$base_notify('error', data.message ?? 'Xóa thất bại')
            }
          })
        })
        .catch(() => {
          this.$base_notify('error', 'Xóa thất bại')
        })
    },
    loadMoreMember() {
      if (this.members.length > 0) {
        if (this.memberListShowUp.length === this.members.length) {
          this.$base_notify('warning', 'Đã hiển thị tất cả thành viên')
        } else {
          if (this.members.length > this.memberListShowUp.length + 5) {
            this.memberListShowUp = this.members.slice(0, this.memberListShowUp.length + 5)
          } else {
            this.memberListShowUp = this.members
          }
        }
      } else this.memberListShowUp = []
    },
    memberSelectChange() {
      this.keyword = ''
      this.getMemberEvent()
    },
    searchingMember() {
      // searching in all members
      this.memberType = -1
      this.getMemberEvent()
    },
    getMemberEvent() {
      this.$emit('getMember', { Keyword: this.keyword, UserType: this.memberType })
    }
  }
}
</script>
<style lang="scss" scoped>
.menu-list-item {
  box-shadow: inset 0 11px 10px -12px #6596f3;
  &:hover {
    .fullName {
      text-decoration: underline;
      color: $main-color;
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
    box-shadow: $card-shadow;
  }
}
.h-67-px {
  height: 67px;
}

::v-deep .el-tabs__nav-scroll {
  border-bottom: 0;
}

::v-deep .el-tabs__nav-wrap::after {
  background: none;
  height: 0;
}

::v-deep .el-tabs__nav-scroll {
  min-height: 3rem;
}

::v-deep .el-tabs__header {
  margin: 0;
}

::v-deep .el-tabs__active-bar {
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

::v-deep .el-textarea__inner {
  border: none;
  padding-left: 2px;
}

::v-deep .el-textarea__inner::placeholder {
  font-style: italic;
}

::v-deep .el-dialog--center .el-dialog__body {
  padding-top: 0;
}

.fs-7 {
  font-size: 80%;
}

::v-deep .el-popover {
  padding: 0;
}

::v-deep .el-popover--plain {
  padding: 0 !important;
}
</style>
