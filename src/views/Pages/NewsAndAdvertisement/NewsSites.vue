//trang tin tức
<template>
  <div>{{ t(currentRoute?.meta?.title ? currentRoute?.meta?.title?.toString() : '') }}</div>
</template>

<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
const { currentRoute } = useRouter()
const { t } = useI18n()
</script>

<style></style>
