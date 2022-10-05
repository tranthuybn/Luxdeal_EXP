<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElButton,
  ElDivider,
  ElInput,
  ElRadio,
  ElRadioGroup,
  ElSelect,
  ElOption,
  ElUpload,
  ElDialog
} from 'element-plus'
import { useRouter } from 'vue-router'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file: UploadFile) => {
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = (file: UploadFile) => {
  console.log(file)
}

const { t } = useI18n()

const { back } = useRouter()
const router = useRouter()
const Back = () => {
  console.log('router: ', `${String(router.currentRoute.value.name)}`)

  back()
}

const inputRankName = ref('')
const isActive = ref(true)

// check button
const checkButton = ref(false)
let count = 0

// Xếp hạng
const optionsRating = [
  {
    value: 'Option1',
    label: 'Theo tháng'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  }
]

const ratings = optionsRating[0].label

const inputSales = ref('')

const addIcon = useIcon({ icon: 'uil:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })
</script>

<template>
  <div class="bg-[#FFFFFF] dark:bg-transparent">
    <div class="flex justify-between items-center pl-4 pt-4 pb-4">
      <div class="text-xl font-bold">{{ t('customerList.addNewRatings') }}</div>
      <el-button text @click="Back">
        <div class="text-xl">{{ t('reuse.exit') }}</div>
      </el-button>
    </div>
    <span class="block w-[100%] border-t-1 pt-2"></span>
    <div class="flex pl-4 gap-4">
      <div class="flex-1">
        <el-divider content-position="left">{{ t('customerList.ratingInformation') }}</el-divider>
        <div class="flex gap-2">
          <label class="w-[20%] text-right">{{ t('customerList.rankName') }}</label>
          <el-input class="w-[80%]" v-model="inputRankName" />
        </div>
        <div class="flex pt-4 items-center">
          <label class="w-[20%] max-w-[146.83px] text-right">{{ t('customerList.ratings') }}</label>
          <div class="flex items-center w-[84%]">
            <el-select v-model="ratings" class="m-2 flex-1" placeholder="Select">
              <el-option
                v-for="item in optionsRating"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div class="flex items-center flex-1 border-1 dark:border-[#4e4e4e] rounded">
              <input
                v-model="inputSales"
                class="border-none outline-none bg-transparent pl-2 w-[100%] min-h-[30px]"
                :placeholder="t('customerList.enterSales')"
                clearable
              />
              <span class="pr-2">đ</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <el-divider content-position="left">{{ t('reuse.addImage') }}</el-divider>
        <el-upload action="#" list-type="picture-card" :auto-upload="false">
          <ElButton :icon="addIcon" class="avatar-uploader-icon border-none" />
          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <ElButton :icon="viewIcon" class="avatar-uploader-icon border-none" />
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <el-icon><Download /></el-icon>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <ElButton :icon="deleteIcon" class="avatar-uploader-icon border-none" />
                </span>
              </span>
            </div>
          </template>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </div>
    </div>
    <div class="pl-4">
      <el-divider content-position="left">{{ t('reuse.status') }}</el-divider>
      <div class="flex gap-4">
        <div class="flex-1 flex gap-2 items-center pb-4">
          <label class="w-[20%] max-w-[146.83px] text-right">{{ t('reuse.status') }}</label>
          <el-radio-group v-model="isActive" class="ml-4">
            <el-radio label="2" size="large">{{ t('formDemo.isActive') }}</el-radio>
          </el-radio-group>
        </div>
        <div class="flex-1"></div>
      </div>
      <div class="flex gap-4">
        <div class="flex-1 flex gap-2 items-center pb-4">
          <div class="w-[20%] max-w-[146.83px]"></div>
          <div class="flex gap-4" v-if="!checkButton">
            <el-button
              @click.prevent="
                () => {
                  checkButton = !checkButton
                  count++
                }
              "
              type="primary"
              class="min-w-[150px] min-h-[40px]"
              >{{ t('reuse.save') }}</el-button
            >
            <el-button v-if="count == 0" type="primary" class="min-w-[150px] min-h-[40px]">{{
              t('reuse.saveAndAdd')
            }}</el-button>
            <el-button v-else class="min-w-[150px] min-h-[40px]">{{
              t('button.cancel')
            }}</el-button>
          </div>
          <div class="flex gap-4" v-else>
            <el-button
              @click.prevent="checkButton = !checkButton"
              class="min-w-[150px] min-h-[40px]"
              >{{ t('reuse.fix') }}</el-button
            >
            <el-button type="danger" class="min-w-[150px] min-h-[40px]">{{
              t('reuse.delete')
            }}</el-button>
          </div>
        </div>
        <div class="flex-1"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
::v-deep(.el-select) {
  width: 100%;
}

::v-deep(.el-textarea__inner) {
  box-shadow: none;
  padding: 5px 0;
}

::v-deep(.el-form-item) {
  display: flex;
  align-items: center;
}

::v-deep(.el-upload--picture-card) {
  width: 160px;
  height: 40px;
  border: 1px solid #409eff;
}

::v-deep(.d-block > .el-row) {
  display: block;
}

::v-deep(.el-form-item__content) {
  display: block;
}

@media only screen and (min-width: 1920px) {
  ::v-deep(.el-col-xl-12) {
    max-width: 100%;
  }
}

::v-deep(label) {
  color: #828387;
}

::v-deep(.cell) {
  color: #303133;
}

::v-deep(.el-divider__text) {
  font-size: 16px;
}

.el-button--text {
  margin-right: 15px;
}

::v-deep(.el-input) {
  width: 100%;
}

::v-deep(.el-button--large) {
  padding: 12px 18px;
}

.fix-label-color > .el-radio {
  color: transparent;
}
::v-deep(.el-upload--picture-card) {
  height: 160px;
}
</style>
