<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'

import {
    ElRow,
    ElCol,
    ElUpload,
    ElButton,
    ElDialog,
    UploadProps,
    ElMessage,
    UploadFile,
    ElMessageBox,
    UploadUserFile
} from 'element-plus'
import { API_URL } from '@/utils/API_URL'
import { useIcon } from '@/hooks/web/useIcon'
import { watch } from 'vue'

const props = defineProps({
  imageRequired: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: ''
  },
  formValue: {
    type: Object,
    default: () => {}
  },
})
const { t } = useI18n()
const FileDeleteIds :Array<number> = []
const listFileUpload = ref<UploadUserFile[]>([])
const validImageType = ['jpeg', 'png', 'pdf']
const rawUploadFile = ref<UploadFile>()
const imageUrl = ref()
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const deleteFileIds =  ref()
const addIcon = useIcon({ icon: 'uil:plus' })
const emit = defineEmits(['updateValue'])

const handleChangeUpload: UploadProps['onChange'] = async (_uploadFile, uploadFiles) => {
    listFileUpload.value = uploadFiles
    const lastItem = uploadFiles.at(-1)
    if(lastItem) {
        ;(await beforeAvatarUpload(lastItem, 'list')) ? '' : lastItem.raw ? handleRemove(lastItem) : ''
        emit('updateValue', listFileUpload.value, deleteFileIds.value)
    }
}
const beforeRemove: any = (uploadFile) => {
    return ElMessageBox.confirm(`${t('reuse.confirmDeleteFile')} ${uploadFile.name} ?`, {
        confirmButtonText: 'OK',
        cancelButtonText: 'Hủy',
        type: 'warning',
        draggable: true
    })
        .then(() => {
            ElMessage({
                type: 'success',
                message: t('common.delSuccess')
            })
            const idImageRemove = Number(uploadFile.id)
            FileDeleteIds.push(idImageRemove)
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('reuse.deleteFail')
            })
        })
}

const beforeAvatarUpload = async (rawFile, type: string) => {
if (rawFile) {
    if (rawFile.raw && !validImageType.includes(rawFile.raw['type'].split('/')[1])) {
        ElMessage.error(t('reuse.onlyAcceptValidImageType'))
        return false
    } else if (rawFile.raw?.size / 1024 / 1024 > 4) {
        ElMessage.error(t('reuse.imageOver4MB'))
        return false
    } else if (rawFile.name?.split('.')[0].length > 100) {
        ElMessage.error(t('reuse.checkNameImageLength'))
        return false
    }
    return true
} else {
    if (props.imageRequired) {
    //báo lỗi nếu ko có ảnh
    if (type === 'list' && listFileUpload.value.length > 0) {
        return true
    }
    if (type === 'single' && (rawUploadFile.value != undefined || imageUrl.value != undefined)) {
        return true
    } else {
        ElMessage.warning(t('reuse.notHaveImage'))
        return false
    }
    }
    return true
}
}

const handleRemove = (file: UploadFile) => {
    listFileUpload.value = listFileUpload.value?.filter((image) => image.url !== file.url)
    // remove image when edit data
    if (props.formValue?.Images.length > 0 && props.type === 'edit') {
        let imageRemove = props.formValue?.Images.find(
        (image) => `${API_URL}${image.path}` === file.url
        )
        if (imageRemove) {
        deleteFileIds.value.push(imageRemove.id)
        }
    }
}

const handlePictureCardPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url!
    dialogVisible.value = true
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `${t('reuse.limitUploadImages')}. ${t('reuse.imagesYouChoose')}: ${files.length}. ${t(
      'reuse.total'
    )} ${files.length + uploadFiles.length}`
  )
}
watch(() => props.formValue, (newVal) => {
    newVal.documents?.map((image) =>
    listFileUpload.value.push({ url: `${API_URL}${image.path}`, name: image.fileName }))
})

</script>

<template>
    <div class="max-h-400px overflow-y-auto">
        <ElRow>
            <ElCol :span=12>
            <div class="flex">
                <div class="pr-4">
                <div class="text-right">{{ t('formDemo.addPhotosOrFiles') }}</div>
                <div class="text-right text-[#FECB80] italic">{{ t('formDemo.lessThanTenProfiles') }}</div>
                </div>
                <div>
                <el-upload
                    ref="upload"
                    :on-exceed="handleExceed"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :auto-upload="false"
                    list-type="picture"
                    v-model:file-list="listFileUpload"
                    :limit="10"
                    :on-change="handleChangeUpload"
                    :multiple="true"
                    :disabled="props.type === 'detail'"
                    :before-remove="beforeRemove"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                >
                    <ElButton :disabled="props.type === 'detail'" :icon="addIcon">{{ t('formDemo.addPhotosOrFiles') }}</ElButton>
                    <el-dialog v-model="dialogVisible">
                    <img h-full :src="dialogImageUrl" alt="Preview Image" />
                    </el-dialog>
                </el-upload>
                </div>
            </div>
            </ElCol>
            <ElCol :span=12>
                <div v-if="formValue?.orderCode">
                    <span>{{ `${t('reuse.orderCode')}: ` }}</span>
                    <span class="font-bold">{{formValue.orderCode}}</span>
                </div>
            </ElCol>
        </ElRow>
    </div>
</template>

<style lang="scss" scoped>

</style>