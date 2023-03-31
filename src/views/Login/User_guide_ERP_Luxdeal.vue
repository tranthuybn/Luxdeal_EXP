<template>
  <div>
    <div id="sidebar">
      <div id="outline"></div>
    </div>
    <div id="page-container">
      <!-- <button onclick="myFunction()">Lên đầu trang</button> -->
      <iframe src="./UserGuide.html" frameborder="0"></iframe>
    </div>
    <div class="loading-indicator">
    <img alt="" src="@/assets/imgs/imgGuide/pull.png" />
  </div>
  </div>
</template>
<script>
export default {

  data() {
    return {
 
    };
  },
  computed: {
   
  },
  methods: {
    myFunction() {
        console.log("huy")
        window.scrollTo({
          top: 0,
          behavior: `smooth`
        })
      }
  },

  mounted() {
    let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', './component/guide/guide.js')
      document.head.appendChild(recaptchaScript)
  },
};
</script>
<style lang="css" scoped>
@import '@/styles/guide.css';
button {
        padding: 10px;
        color: white;
        background-color: rgb(174, 129, 224);
        position: sticky;
        border-radius: 5px;
        border: 0.5px solid rgb(87, 85, 85);
        top: 10%;
        left: 5%;
        z-index: 10;
      }
      iframe{
        height: 100%;
        width: 100%;
      }
</style>