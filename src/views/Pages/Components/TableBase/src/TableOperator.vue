<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref } from 'vue'
import { TableData } from '@/api/table/types'
import { useValidator } from '@/hooks/web/useValidator'
import { ElRow, ElCol, ElUpload, ElButton, ElDialog, UploadUserFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { saveTableApi } from '@/api/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useRouter } from 'vue-router'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import type { UploadFile } from 'element-plus'

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
  hasImage: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: 'Category'
  },
  nameBack: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  typeForm: {
    type: String,
    default: ''
  },
  typeButton: {
    type: String,
    default: ''
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
let fileList = ref<UploadUserFile[]>([])
// luu du lieu vao form
watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) {
      return
    }
    if (currentRow.list.length !== 0) {
      const { setValues } = methods
      setValues(currentRow?.list[0])
      fileList.value.push({
        url: currentRow.list[0].image,
        name: currentRow.list[0].title
      })
    }
  },
  {
    deep: true,
    immediate: true
  }
)
watch(
  () => props.type,
  () => {
    if (props.type === 'detail') {
      const { setProps } = methods
      setProps({
        disabled: true
      })
    }
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
        emitter.emit('getList', 'add')
      }
    }
  })
}
const addIcon = useIcon({ icon: 'uil:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })

//if schema has image then split screen
let fullSpan = ref<number>()
props.hasImage ? (fullSpan.value = 16) : (fullSpan.value = 24)

//set Title
let title = ref(props.title)
if (props.title == 'undefined') {
  title.value = 'Category'
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file: UploadFile) => {
  fileList.value = fileList.value.filter((image) => image.url !== file.url)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
const saveAndAdd = () => {
  console.log('saveAndAdd')
}
const edit = () => {
  console.log('edit')
}
const delAction = () => {
  console.log('del')
}
const cancel = () => {
  console.log('cancel')
}
</script>

<template>
  <ContentDetailWrap :title="t(title)" @back="push({ name: nameBack })">
    <ElRow :gutter="20" justify="space-between">
      <ElCol :span="fullSpan">
        <Form :rules="rules" @register="register" />
      </ElCol>
      <ElCol :span="hasImage ? 8 : 0" v-if="hasImage">
        <div>{{ t('reuse.addImage') }}</div>
        <el-upload
          action="#"
          :disabled="props.type === 'detail'"
          list-type="picture-card"
          :auto-upload="false"
          v-model:file-list="fileList"
        >
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
                  @click="handleRemove(file)"
                >
                  <el-button :icon="deleteIcon" :disabled="props.type === 'detail'" />
                </span>
              </span>
            </div>
          </template>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </ElCol>
    </ElRow>

    <template #under>
      <div v-if="props.typeButton === 'form01'">
        <ElButton type="primary" :loading="loading" @click="save">
          {{ t('reuse.save') }}
        </ElButton>
        <ElButton type="primary" :loading="loading" @click="saveAndAdd">
          {{ t('reuse.addNew') }}
        </ElButton>
      </div>
      <div v-if="props.typeButton === 'form02'">
        <ElButton type="primary" :loading="loading" @click="save">
          {{ t('reuse.fix') }}
        </ElButton>
      </div>
      <div v-if="props.type === 'add'">
        <ElButton type="primary" :loading="loading" @click="save">
          {{ t('reuse.save') }}
        </ElButton>
        <ElButton type="primary" :loading="loading" @click="saveAndAdd">
          {{ t('reuse.saveAndAdd') }}
        </ElButton>
      </div>
      <div v-if="props.type === 'detail'">
        <ElButton :loading="loading" @click="edit">
          {{ t('reuse.edit') }}
        </ElButton>
        <ElButton type="danger" :loading="loading" @click="delAction">
          {{ t('reuse.delete') }}
        </ElButton>
      </div>
      <div v-if="props.type === 'edit'">
        <ElButton type="primary" :loading="loading" @click="save">
          {{ t('reuse.save') }}
        </ElButton>
        <ElButton :loading="loading" @click="cancel">
          {{ t('reuse.cancel') }}
        </ElButton>
        <ElButton type="danger" :loading="loading" @click="delAction">
          {{ t('reuse.delete') }}
        </ElButton>
      </div>
    </template>
  </ContentDetailWrap>
</template>
