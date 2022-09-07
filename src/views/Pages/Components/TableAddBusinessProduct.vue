<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref, onMounted } from 'vue'
import { TableData } from '@/api/table/types'
import { useValidator } from '@/hooks/web/useValidator'
import { ElRow, ElCol, ElUpload, ElButton, ElDialog, UploadUserFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { saveTableApi } from '@/api/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import type { UploadFile } from 'element-plus'
import { Editor, EditorExpose } from '@/components/Editor'
import tableDatetimeFilterBasicVue from '@/views/Pages/Components/TableManageRoom1.vue'
import { TableResponse, apiType } from './Type'

const { t } = useI18n()
const { emitter } = useEmitt()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })

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
  backButton: {
    type: Boolean,
    default: true
  },
  buttons: {
    type: Number,
    default: 0
  },
  titleButtons: {
    type: String,
    default: ''
  },
  api: {
    type: Function as PropType<apiType>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: () => []
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
props.buttons == 1 ? (fullSpan.value = 16) : (fullSpan.value = 24)

//set Title
let title = ref(props.title)
if (props.title == 'undefined') {
  title.value = 'Category'
}

let fileList = ref<UploadUserFile[]>([])
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

const editorRef = ref<typeof Editor & EditorExpose>()

const defaultHtml = ref('')

onMounted(async () => {
  const editor = await unref(editorRef)?.getEditorRef()
  console.log(editor)
})

setTimeout(() => {
  defaultHtml.value = '<p>hello <strong>world</strong></p>'
}, 3000)
//props.buttons == 1 ? (fullSpan.value = 16) : (fullSpan.value = 24)
</script>

<template>
  <tableDatetimeFilterBasicVue v-if="buttons == 2" :columns="columns" :api="api" :key="buttons" />
  <ContentDetailWrap v-else :backButton="backButton">
    <ElRow :gutter="20" justify="space-between">
      <ElCol :span="fullSpan">
        <Form :rules="rules" @register="register" :schema="schema" />
      </ElCol>
      <ElCol :span="8" v-if="buttons == 1">
        <div>{{ t('reuse.addImage') }}</div>
        <el-upload
          action="#"
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
                  <el-button :icon="deleteIcon" />
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
    <ElButton type="primary" :loading="loading" v-if="buttons == 1" @click="save">
      {{ t('reuse.save') }}
    </ElButton>
    <ElButton type="primary" :loading="loading" v-if="buttons == 1" @click="save">
      {{ t('reuse.addNew') }}
    </ElButton>
    <ElButton type="primary" plain :loading="loading" v-if="buttons == 3" @click="save">
      {{ t('reuse.fix') }}
    </ElButton>
    <el-button :icon="plusIcon" v-if="buttons == 2">
      {{ titleButtons }}
    </el-button>
  </ContentDetailWrap>
</template>
