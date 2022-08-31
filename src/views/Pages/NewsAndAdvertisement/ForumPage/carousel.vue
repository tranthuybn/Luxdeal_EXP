<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<!-- eslint-disable vue/no-deprecated-slot-scope-attribute -->
<template>
  <div>
    <el-carousel
      :height="carouselHeight.toString() + 'px'"
      :interval="5000"
      arrow="hover"
      @prev="previousClick"
      @next="nextClick"
      ref="carousel"
      id="carousel"
    >
      <el-carousel-item v-for="(item, index) in items" :key="index">
        <img
          v-if="item"
          class="base__right-detail__img-banner"
          :src="item"
          :alt="item.toString()"
        />
        <el-empty v-else :image-size="carouselHeight / 2" description="Không có ảnh" />
      </el-carousel-item>
    </el-carousel>
    <el-button
      id="edit-button"
      icon="el-icon-edit"
      circle
      @click="editImageDialog = !editImageDialog"
    />
    <el-dialog
      v-model:visible="editImageDialog"
      :close-on-click-modal="false"
      width="53%"
      center
      @opened="dialogOpenEvent"
    >
      <template #title>
        <i>Giữ ctrl để chọn nhiều</i>
      </template>
      <el-upload
        action="#"
        ref="carouselImage"
        id="carouselImage"
        list-type="picture-card"
        :auto-upload="false"
        :multiple="true"
        :drag="true"
        :file-list="imageList"
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
      <el-row type="flex" justify="end" slot="footer" class="dialog-footer">
        <el-col :span="3">
          <el-button type="primary" @click="saveImage"> Lưu </el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="danger" @click="closeDialog"> Thoát </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { IMG_TYPE } from '@/utils/constants'
export default {
  name: 'CarouselComponent',
  props: {
    items: {
      type: Array,
      default: () => [],
      require: true
    }
  },
  data() {
    return {
      carouselHeight: '350px',
      dialogImageUrl: '',
      detailImageVisible: false,
      editImageDialog: false,
      fullscreenLoading: false,
      imageList: []
    }
  },

  mounted() {
    const carouselWidth = document.getElementsByClassName('el-carousel__container')[0].clientWidth
    this.carouselHeight = (carouselWidth * 9) / 16
  },
  methods: {
    previousClick(event) {
      this.$emit('prev', event)
    },
    nextClick(event) {
      this.$emit('next', event)
    },
    checkImageValidate(file) {
      const isJPG = file.type
      const isLt4M = file.size / 1024 / 1024 < 4
      if (IMG_TYPE.indexOf(isJPG) === -1) {
        this.$message.error('error', 'Không đúng định dạng ảnh.')
      }
      if (!isLt4M) {
        this.$message.error('Ảnh vừa nhập lớn hơn 4MB!')
      }
      return isLt4M && IMG_TYPE.indexOf(isJPG) === -1
    },
    uploadSlideImage(file, fileList) {
      // if (this.checkImageValidate) { this.imageList.push(file.raw) }
    },
    slideImageRemove(file) {
      if (this.$refs.carouselImage.uploadFiles.length > 0 && file) {
        const index = this.$refs.carouselImage.uploadFiles.findIndex((el) => el.uid === file.uid)
        if (index > -1) {
          this.$refs.carouselImage.uploadFiles.splice(index, 1)
          this.imageList.splice(index, 1)
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.detailImageVisible = true
    },
    dialogOpenEvent() {
      this.imageList =
        this.items.length > 0
          ? this.items.map((el, index) => ({
              id: index,
              url: el
            }))
          : []
    },
    saveImage() {
      this.closeDialog()
    },
    closeDialog() {
      this.imageList.splice(0, this.imageList.length)
      this.editImageDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-carousel__container {
  width: 100%;
}
::v-deep .el-carousel--horizontal {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
#carouselImage {
  display: flex;
  justify-content: flex-start;
}
#carousel {
  position: relative;
}
#edit-button {
  position: absolute;
  bottom: 2vh;
  right: 3vh;
  z-index: 13;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  color: white;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  &:hover {
    box-shadow: 0 1px 9px 1px #6596f3;
  }
}
::v-deep .el-dialog {
  background: rgba(23, 125, 201, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  i {
    color: #d5d7dc;
  }
  .el-upload--picture-card {
    background: none;
    border: none;
  }
  .el-upload-dragger {
    background: rgba(255, 255, 255, 0.55);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }
}
</style>
