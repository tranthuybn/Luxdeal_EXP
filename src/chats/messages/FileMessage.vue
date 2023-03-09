<template>
  <div class="sc-message--file" :style="messageColors">
    <div class="sc-message--file-icon">
      <img :src="data.file.url" class="sc-image" />
    </div>
    <div class="sc-message--file-name" :style="messageColors">
      <a :href="data.file.url ? data.file.url : '#'" target="_blank">{{ data.file.name || '' }}</a>
    </div>
    <div class="sc-message--file-text" :style="messageColors">
      {{ data.text }}
      <p v-if="data.meta" class="sc-message--meta" :style="messageColors">
        {{ data.meta }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.sc-message--file {
  font-size: 14px;

  /* white-space: pre-wrap; */
  -webkit-font-smoothing: subpixel-antialiased;
  font-weight: 300;
  line-height: 1.4;
  border-radius: 6px;
}

.sc-message--content.sent .sc-message--file {
  word-wrap: break-word;
}

.sc-message--file-icon {
  margin: 15px auto 0;
  text-align: center;
}

.sc-image {
  max-width: 100%;
  min-width: 100%;
}

.sc-message--file-text {
  padding: 17px 20px;
  font-size: 14px;
  -webkit-font-smoothing: subpixel-antialiased;
  font-weight: 300;
  line-height: 1.4;
  white-space: pre-wrap;
  border-radius: 6px;
}

.sc-message--file-name {
  padding-top: 0;
  padding-right: 15px;
  padding-left: 15px;
  font-size: x-small;
  color: white;
  text-align: center;
}

.sc-message--file-name a {
  color: #ece7e7;
  text-decoration: none;
}

.sc-message--file-name a:hover {
  color: white;
}

.sc-message--content.sent .sc-message--file-text {
  color: white;
  word-wrap: break-word;
  background-color: #4e8cff;
}

.sc-message--content.received .sc-message--file {
  margin-right: 40px;
  color: #263238;
  background-color: #f4f7f9;
}

.sc-message--content.received .sc-message--file-name {
  color: #000;
}

.sc-message--content.received .sc-message--file a {
  color: rgb(43 40 40 / 70%);
}

.sc-message--content.received .sc-message--file a:hover {
  color: #0c0c0c;
}
</style>
