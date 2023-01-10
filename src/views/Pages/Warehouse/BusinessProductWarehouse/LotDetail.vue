<script setup lang="ts">
import { Qrcode } from '@/components/Qrcode'
import { ElDivider, ElImage } from 'element-plus'
</script>
<template>
  <div class="flex">
    <div class="w-6/10">
      <ElDivider content-position="left">absadsadsadasd</ElDivider>
      <div class="ml-1/10">
        <div class="flex">
          <div class="w-2/10 text-right pr-4">1</div>
          <div class="w-7/10 break-words">2</div>
        </div>
        <div class="flex">
          <div class="w-2/10 text-right pr-4">3</div>
          <div class="w-7/10 break-words">4</div></div
        >
        <div class="flex">
          <div class="w-2/10 text-right pr-4">5</div>
          <div class="w-7/10 break-words"
            >1234124asjdflkasjfaklsjfl;asjf;lksaaaaaasdjfkal;skaaaaaaaaaaaaaaaaaaa6lksaaaaaaaaaaaaaaaaaaaaaaaa6</div
          ></div
        >
        <div class="flex">
          <div class="w-2/10 text-right pr-4">7</div>
          <div class="w-7/10 break-words">81234124</div></div
        >
        <div class="flex">
          <div class="w-2/10 text-right pr-4">1</div>
          <div class="w-7/10 break-words">2</div></div
        >
        <div class="flex">
          <div class="w-2/10 text-right pr-4">3</div>
          <div class="w-7/10 break-words">4</div></div
        >
        <div class="flex">
          <div class="w-2/10 text-right pr-4">5</div>
          <div class="w-7/10 break-words">6</div></div
        >
      </div>
      <div>
        <ElDivider content-position="left">absadsadsadasd</ElDivider>
        <div class="ml-1/10">
          <div class="flex">
            <div class="w-2/10 text-right pr-4">1</div>
            <div class="w-7/10 break-words">2</div></div
          >
          <div class="flex">
            <div class="w-2/10 text-right pr-4">1</div>
            <div class="w-7/10 break-words">2</div></div
          >
          <div class="flex">
            <div class="w-2/10 text-right pr-4">1</div>
            <div class="w-7/10 break-words">2</div></div
          >
          <div class="flex">
            <div class="w-2/10 text-right pr-4">1</div>
            <div class="w-7/10 break-words">2</div></div
          >
          <div class="flex">
            <div class="w-2/10 text-right pr-4">1</div>
            <div class="w-7/10 break-words">2</div></div
          >
        </div>
      </div>
      <div>
        <ElDivider content-position="left">absadsadsadasd</ElDivider>
        <div class="ml-1/10">
          <div class="flex">
            <div class="w-2/10 text-right pr-4">1</div>
            <div class="w-7/10 break-words">2</div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-4/10">
      <div>
        <ElDivider content-position="left">absadsadsadasd</ElDivider>
        <ElImage />
      </div>
      <div>
        <ElDivider content-position="left">absadsadsadasd</ElDivider>
        <Qrcode :width="100" />
      </div>
    </div>
  </div>
</template>
