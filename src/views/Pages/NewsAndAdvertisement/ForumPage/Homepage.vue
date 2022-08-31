<script setup lang="ts">
import { ref } from 'vue'
import { ElRow, ElCol, ElCard, ElTabPane, ElTabs, ElAvatar, ElCheckbox } from 'element-plus'
const sliders = [
  'https://api.cooftech.net/PostsImages\\637829583833908676_fpLD6o.jpg',
  'https://api.cooftech.net/PostsImages\\637829583834658748_4665561.jpg',
  'https://api.cooftech.net/PostsImages\\637829583835486538_car_2.jpg'
]
const formInfo = ref({
  name: 'Forum Khách Hàng',
  description: 'Nơi giao lưu kết nối của các tín đồ hàng hiệu',
  id: 1
})
const activeName = ref('first')
</script>
<template>
  <div>
    <div class="ps-4 pb-1 base__main-background">
      <el-card>
        <div class="mt-3 pb-4">
          <div class="fs-4 fw-bold pt-2">{{ formInfo.name }}</div>
          <small class="ms-1"> {{ formInfo.description }}</small>
        </div>
        <div class="directory-bar">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="Bài viết" name="first" />
            <el-tab-pane label="Chờ duyệt" name="second" />
          </el-tabs>
        </div>
      </el-card>
    </div>
    <div class="ps-3 py-4 base__main-background">
      <el-row :gutter="20" class="m-0">
        <el-col :span="13" v-if="listActive">
          <el-card class="p-3">
            <div class="d-flex">
              <div class="">
                <el-avatar v-if="userInfo.avatar" :src="baseUrl + userInfo.avatar" :size="47" />
                <el-avatar v-else icon="el-icon-user-solid" :size="47" />
              </div>
              <div class="input-group input-group-lg ps-4">
                <input
                  type="text"
                  class="form-control rounded-20 bg-primary bg-opacity-10 fs-6"
                  placeholder="Nhập nội dung..."
                />
              </div>
            </div>
            <div class="menu-list-item ps-3 mt-3" @click="openPostNewsDialog" role="button">
              <el-avatar v-if="userInfo.avatar" :src="baseUrl + userInfo.avatar" :size="47" />
              <el-avatar v-else icon="el-icon-user-solid" :size="47" />
              <span class="ps-2" name="text">Chọn ảnh</span>
            </div>
          </el-card>

          <div class="fw-bold p-3">Gần đây <i class="el-icon-caret-bottom" role="button"></i></div>
          <approved-posting v-for="(item, index) in posts" :key="index" :content="item" />
        </el-col>
        <el-col :span="13" v-else>
          <el-card class="p-3">
            <div class="d-flex justify-content-between">
              <div class="pt-3">
                <span class="fw-bold pe-3 dot">Bài viết chờ duyệt</span>
                <span class="fw-bold ps-2">{{ posts.length }}</span>
              </div>
              <div>
                <button
                  :class="[
                    allPick ? 'bg-success bg-gradient text-dark' : 'bg-secondary',
                    'btn bg-opacity-50 me-4'
                  ]"
                  @click="actionAllPost('approve')"
                  >Phê duyệt</button
                >
                <button
                  :class="[
                    allPick ? 'bg-danger bg-gradient text-light' : 'bg-secondary',
                    'btn bg-opacity-50'
                  ]"
                  @click="actionAllPost('cancel')"
                  >Từ chối</button
                >
              </div>
            </div>
            <div class="d-flex justify-content-between pt-3">
              <div class="pt-3">
                <el-checkbox v-model="allPick" :value="true"> Chọn tất cả</el-checkbox>
              </div>
              <div style="align-self: center">
                <el-popover
                  placement="bottom"
                  width="200"
                  trigger="click"
                  content="this is content, this is content, this is content"
                >
                  <template #default>
                    <div class="w-100 p-3">
                      <div class="pb-2 d-flex justify-content-between"
                        ><span class="fw-bold">Mới nhất trước</span>
                        <i class="el-icon-arrow-right"></i
                      ></div>
                      <div class="d-flex justify-content-between"
                        ><span class="text-secondary">Cũ nhất trước</span>
                        <i class="el-icon-arrow-right"></i
                      ></div>
                    </div>
                  </template>
                  <div slot="reference" class="d-flex">
                    <span class="fw-bold"> Mới nhất trước</span>
                  </div>
                </el-popover>
              </div>
            </div>
          </el-card>
          <!-- pending -->
          <pending-posting
            v-for="(item, index) in posts"
            :key="index + '-' + item.id"
            :content="item"
          />
        </el-col>
        <el-col :span="11">
          <el-card class="p-3 mb-3">
            <div class="input-group input-group-lg">
              <input
                type="text"
                class="form-control rounded-20 bg-primary bg-opacity-10 fs-6"
                placeholder="Tìm kiếm trong nhóm này ..."
                v-model="keyword"
                @change="search()"
                style="height: 50px"
              />
            </div>
            <div class="fs-6 pt-3 fw-bold" v-if="dataSearch.length > 0"> Tìm kiếm gần đây</div>
            <div class="pt-3" v-for="item in dataSearch" :key="item.id">
              <span class="fw-bold" style="cursor: pointer" @click="removeSearch(item.id)">x</span>
              <span class="ps-4">{{ item.keyword }}</span>
            </div>
          </el-card>
          <componentMember
            :members="members"
            :is-home-page="true"
            @getMember="getMember"
            :total-member="totalMember"
          />
        </el-col>
      </el-row>
      <post-news-dialog
        ref="postNewsDialog"
        :userInfo="userInfo"
        @updateNewPosting="getPostForum"
      />
    </div>
  </div>
</template>
