<script setup lang="ts">
import { onBeforeUnmount, computed, PropType, unref, nextTick, ref, watch, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IEditorConfig, i18nChangeLanguage, i18nAddResources, IDomEditor } from '@wangeditor/editor'
import { propTypes } from '@/utils/propTypes'
import { isNumber } from '@/utils/is'
import { ElMessage } from 'element-plus'
import { useLocaleStore } from '@/store/modules/locale'

const editorRef = shallowRef<IDomEditor>()

const localeStore = useLocaleStore()

const currentLocale = computed(() => localeStore.getCurrentLocale)
const toolbarConfig: any = {}
toolbarConfig.excludeKeys = [
  'insertLink',
  'uploadVideo',
  'uploadImage',
  'InsertImg',
  'insert Image',
  'insertImage',
  'insertVideo'
]

i18nChangeLanguage(unref(currentLocale).lang)
i18nAddResources('vi', {
  // title
  header: {
    title: 'Text',
    text: 'Text'
  },
  blockQuote: {
    title: 'Đoạn trích dẫn'
  },
  textStyle: {
    bold: 'In đậm',
    underline: 'Gạch chân',
    italic: 'In nghiêng',
    through: 'Gạch ngang ở giữa',
    code: 'Mã',
    sup: 'Chỉ số trên',
    sub: 'Chỉ số dưới',
    clear: 'Tẩy'
  },
  color: {
    color: 'Màu chữ',
    default: 'Mặc định',
    bgColor: 'Màu nền',
    clear: 'Không màu'
  },
  fontSize: {
    default: 'Mặc định',
    title: 'Kích cỡ chữ'
  },
  fontFamily: {
    title: 'Kiểu chữ',
    default: 'Mặc định'
  },
  lineHeight: {
    title: 'Chiều cao dòng',
    default: 'Mặc định'
  },
  listModule: {
    unOrderedList: 'Danh sách không thứ tự',
    orderedList: 'Danh sách có thứ tự'
  },
  todo: {
    todo: 'Việc cần làm'
  },
  justify: {
    left: 'Căn trái lề',
    right: 'Căn phải lề',
    center: 'Căn giữa lề',
    justify: 'Văn bản đồng đều giữa các lề'
  },
  indent: {
    increase: 'Tăng thụt lề',
    decrease: 'Giảm thụt lề'
  },
  emotion: {
    title: 'Biểu tượng cảm xúc'
  },
  link: {
    insert: 'Liên kết'
  },
  image: {
    netImage: 'Thêm ảnh'
  },
  uploadImgModule: {
    uploadImage: 'Tải ảnh từ máy'
  },
  videoModule: {
    insertVideo: 'Thêm video',
    uploadVideo: 'Tải video từ máy'
  },
  tableModule: {
    insertTable: 'Thêm bảng'
  },
  codeBlock: {
    title: 'Khối mã'
  },
  divider: {
    title: 'Dải phân cách'
  },
  undo: {
    undo: 'Hoàn tác',
    redo: 'Làm lại'
  },
  fullScreen: {
    title: 'Toàn màn hình'
  }
  // ... Other language vocabulary, below...
})
const props = defineProps({
  editorId: propTypes.string.def('wangeEditor-1'),
  height: propTypes.oneOfType([Number, String]).def('500px'),
  editorConfig: {
    type: Object as PropType<IEditorConfig>,
    default: () => undefined
  },
  modelValue: propTypes.string.def('')
})

const emit = defineEmits(['change', 'update:modelValue'])

// editorInstance,Must Be Used With Shallow ref

const valueHtml = ref('')

watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(valueHtml)) return
    valueHtml.value = val
  },
  {
    immediate: true
  }
)

// monitor
watch(
  () => valueHtml.value,
  (val: string) => {
    emit('update:modelValue', val)
  }
)

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

// Editor configuration
const editorConfig = computed((): IEditorConfig => {
  return Object.assign(
    {
      readOnly: false,
      customAlert: (s: string, t: string) => {
        switch (t) {
          case 'success':
            ElMessage.success(s)
            break
          case 'info':
            ElMessage.info(s)
            break
          case 'warning':
            ElMessage.warning(s)
            break
          case 'error':
            ElMessage.error(s)
            break
          default:
            ElMessage.info(s)
            break
        }
      },
      autoFocus: false,
      scroll: true,
      uploadImgShowBase64: true
    },
    props.editorConfig || {}
  )
})

const editorStyle = computed(() => {
  return {
    height: isNumber(props.height) ? `${props.height}px` : props.height
  }
})

// Callback
const handleChange = (editor: IDomEditor) => {
  emit('change', editor)
}

// When the component is destroyed, destroy the editor in time
onBeforeUnmount(() => {
  const editor = unref(editorRef.value)
  if (editor === null) return

  // Destroy and remove Editor
  editor?.destroy()
})

const getEditorRef = async (): Promise<IDomEditor> => {
  await nextTick()
  return unref(editorRef.value) as IDomEditor
}

defineExpose({
  getEditorRef
})
</script>

<template>
  <div class="border-1 border-solid border-[var(--tags-view-border-color)]">
    <!-- toolbar-->
    <Toolbar
      :editor="editorRef"
      :editorId="editorId"
      :defaultConfig="toolbarConfig"
      class="border-bottom-1 border-solid border-[var(--tags-view-border-color)]"
    />
    <!-- editor -->
    <Editor
      v-model="valueHtml"
      :editorId="editorId"
      :defaultConfig="editorConfig"
      :style="editorStyle"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>
