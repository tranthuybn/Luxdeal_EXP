<template>
  <div>
    <div id="html" v-html="htmlContent"></div>
    <div @click="myFunction">
      <div title="Về đầu trang" id="top-up"> &#8657; <i class="fas fa-arrow-circle-up"></i></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      htmlContent: ''
    }
  },
  computed: {},
  methods: {
    async loadHTML() {
      const response = await fetch('./userGuides.html')
      const html = await response.text()
      this.htmlContent = html
    },
    myFunction() {
      document.getElementById('page-container').scrollTop = 0
    }
  },

  mounted() {
    this.loadHTML()
    document.getElementById('html').style.zoom = '150%'
  }
}
</script>
<style scoped>
#top-up {
  font-size: 2rem;
  cursor: pointer;
  position: fixed;
  z-index: 9999;
  color: #0281ff;
  background-color: #edf4fa;
  bottom: 30px;
  right: 35px;
  border: 1px solid black;
  padding: 10px;
  border-radius: 50%;
  /* display: none; */
}
#top-up:hover {
  color: #333;
}
</style>