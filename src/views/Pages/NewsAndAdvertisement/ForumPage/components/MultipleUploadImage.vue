<!-- eslint-disable vue/no-deprecated-slot-scope-attribute -->
<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <section>
    <el-upload
      action="#"
      ref="multipleUploadImages"
      id="multipleUploadImages"
      list-type="picture-card"
      :auto-upload="false"
      :multiple="true"
      :drag="true"
      :file-list="existedImageList"
      :before-upload="checkImageValidate"
      :on-change="uploadSlideImage"
      v-loading.fullscreen.lock="fullscreenLoading"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="slideImageRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog top="1vh" v-model:visible="detailImageVisible" append-to-body>
      <img width="100%" style="z-index: 2007" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'MultipleUploadImage',
  props: {
    existedImageList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      IMG_TYPE: ['image/jpeg', 'image/png', 'image/pjpeg', 'image/x-png'],
      imageList: [],
      fullscreenLoading: false,
      detailImageVisible: false,
      dialogImageUrl: null
    }
  },

  methods: {
    checkImageValidate(file) {
      const isJPG = file.type
      const isLt4M = file.size / 1024 / 1024 < 4
      if (this.IMG_TYPE.indexOf(isJPG) === -1) {
        this.$message.error('error', 'Không đúng định dạng ảnh.')
      }
      if (!isLt4M) {
        this.$message.error('Ảnh vừa nhập lớn hơn 4MB!')
      }
      return isLt4M && this.IMG_TYPE.indexOf(isJPG) === -1
    },
    uploadSlideImage(file, fileList) {
      if (this.checkImageValidate) {
        this.imageList.push(file.raw)
        this.$emit('updateImageList', this.imageList)
      }
    },
    slideImageRemove(file) {
      if (this.$refs.multipleUploadImages.uploadFiles.length > 0 && file) {
        const index = this.$refs.multipleUploadImages.uploadFiles.findIndex(
          (el) => el.uid === file.uid
        )
        if (index > -1) {
          this.$refs.multipleUploadImages.uploadFiles.splice(index, 1)
          this.imageList.splice(index, 1)
          this.$emit('updateImageList', this.imageList)
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.detailImageVisible = true
    },
    cleanImages() {
      this.$refs.multipleUploadImages.clearFiles()
    }
  }
}
</script>
