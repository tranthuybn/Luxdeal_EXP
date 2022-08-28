<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref } from 'vue'
import type { UploadFile } from 'element-plus'
import { TableData } from '@/api/table/types'
import { useValidator } from '@/hooks/web/useValidator'
import { ElRow, ElCol, ElUpload, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { saveTableApi } from '@/api/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useRouter } from 'vue-router'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'

const { t } = useI18n()
const { emitter } = useEmitt()

const { required } = useValidator()
const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<TableData>>,
    default: () => null
  },
  schema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  fullScreen: {
    type: Boolean,
    default: true
  }
})

const rules = reactive({
  title: [required()],
  author: [required()],
  importance: [required()],
  pageviews: [required()],
  display_time: [required()],
  content: [required()]
})

// eslint-disable-next-line vue/no-setup-props-destructure
const schema = props.schema
const { register, methods, elFormRef } = useForm({
  schema
})

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    const { setValues, setSchema } = methods
    setValues(currentRow)
    setSchema([
      {
        field: 'content',
        path: 'componentProps.defaultHtml',
        value: currentRow.content
      }
    ])
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})

const loading = ref(false)
const { push } = useRouter()

const save = async () => {
  await unref(elFormRef)!.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const { getFormData } = methods
      const data = (await getFormData()) as TableData
      const res = await saveTableApi(data)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        console.log('add', data)
        emitter.emit('getList', 'add')
      }
    }
  })
}
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
const addIcon = useIcon({ icon: 'uil:plus' })
const downloadIcon = useIcon({ icon: 'uil:download-alt' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })

let fullSpan = ref<number>()
props.fullScreen ? (fullSpan.value = 16) : (fullSpan.value = 24)
</script>

<template>
  <ContentDetailWrap
    :title="t('reuse.addCategory')"
    @back="push({ name: 'Inventorymanagement.CreateStorageCategory.ProductStorage' })"
  >
    <ElRow :gutter="20" justify="space-between">
      <ElCol :span="fullSpan">
        <Form :rules="rules" @register="register" :schema="schema" />
      </ElCol>
      <ElCol :span="8" v-if="fullScreen">
        <div>{{ t('reuse.addImage') }}</div>
        <el-upload action="#" list-type="picture-card" :auto-upload="false">
          <el-button :icon="addIcon" />
          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <el-button :icon="viewIcon" />
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <el-button :icon="downloadIcon" />
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <el-button :icon="deleteIcon" />
                </span>
              </span>
            </div>
          </template>
        </el-upload>
      </ElCol>
    </ElRow>

    <template #under>
      <ElButton type="primary" :loading="loading" @click="save">
        {{ t('reuse.save') }}
      </ElButton>
      <ElButton type="primary" :loading="loading" @click="save">
        {{ t('reuse.saveAndAdd') }}
      </ElButton>
    </template>
  </ContentDetailWrap>
</template>
