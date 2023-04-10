<template>
  <div class="modal">
    <div class="modal-header">
      <h2><b>Chọn sản phẩm bản muốn mua và trả giá</b></h2>
      <button @click="$emit('close')">X</button>
    </div>
    <div class="modal-body">
      <div v-for="index in dataProducts" :key="index.id">
        <div class="flex border-bottom-1" @click="clickProduct(index)">
          <div><img src="@/assets/imgs/avatar.jpg" class="w-full" />
          </div>
          <div class="pl-4">
            <div class="font-bold">{{ index.name }}</div>
            <div>Túi </div>
            <div>{{ index.price }} đ</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBusinessProductLibrary, deleteProduct } from '@/api/LibraryAndSetting'
export default {
  props: {
    title: {
      type: String,
      default: 'Modal Title',
    },
  },
  data() {
    return {
       dataProducts: null
    }
  },
  mounted(){
    this.getProductList()
  },
  methods: {
    getProductList() {
      getBusinessProductLibrary().then((res) => {
        this.dataProducts = res.data
      })
    },
    clickProduct(data) {
      this.$emit('dataProductClick', data)
      this.$emit('close')
    }
  }
};
</script>

<style scoped>
.modal {
  z-index: 99;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 1rem;
  width: 60%;
  margin-left: 20%;
  margin-top: 5%;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

}

.modal-header button {
  display: flex;
  float: right;
}

.modal-body {
  display: block;
  background-color: #fff;
  width: 60%;
  margin-left: 20%;
  padding: 10px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow-y: auto;
  height: 600px;
  margin-bottom: 20px;
}

img {
  height: 120px;
  width: 120px;
}

.border-bottom-1:hover {
  background-color: #d8d5ab;
}</style>
