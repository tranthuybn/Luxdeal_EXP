<script setup lang="ts">
import { ref } from 'vue'
import { ElRow, ElCol, ElCard } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const lightSwitch = ref('turnOn')
</script>
<template>
  <div>
    <el-row :gutter="20" class="m-0">
      <el-col :offset="6" :span="12">
        <el-card class="p-3 mb-3">
          <p class="font-bold pe-2 fs-5">{{ t('reuse.automaticApprove') }}</p>
          <h5>{{ t('reuse.approveAllPostsOfMember') }}</h5>
          <label
            class="flex bg-green-500 bg-gradient my-3 p-3 justify-between bg-opacity-10"
            for="turnOn"
          >
            <div>
              <div class="font-bold">{{ t('reuse.turnOn') }}</div>
              <small class="text-secondary">{{ t('reuse.memberPostDirectly') }}</small>
            </div>
            <div style="align-self: center">
              <input type="radio" v-model="lightSwitch" name="turnOn" id="turnOn" value="turnOn" />
            </div>
          </label>
          <label
            class="flex bg-red-500 bg-gradient my-3 p-3 justify-between bg-opacity-10"
            for="turnOff"
          >
            <div>
              <div class="font-bold">{{ t('reuse.turnOff') }}</div>
              <small class="text-secondary">{{
                t('reuse.memberPostsMustBeApprovedByAdmin')
              }}</small>
            </div>
            <div style="align-self: center">
              <input
                type="radio"
                v-model="lightSwitch"
                name="turnOff"
                id="turnOff"
                value="turnOff"
              />
            </div>
          </label>
        </el-card>
        <el-card class="bg-white p-3 mb-3">
          <p class="my-3 font-bold pe-3 fs-5">{{ t('reuse.settingTags') }}</p>
          <div class="my-3 p-3">
            <div class="flex justify-between border-bottom">
              <div class="text-secondary">{{ t('reuse.addTag') }}</div>
              <div><img src="@/assets/svgs/plus-icon.svg" width="16" /></div>
            </div>
            <div class="flex justify-between border-bottom mt-3">
              <div class="text-secondary">{{ t('reuse.tagList') }}</div>
              <div><img src="@/assets/svgs/edit-icon.svg" width="16" /></div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
