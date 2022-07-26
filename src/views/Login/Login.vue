<script setup lang="ts">
import { LoginForm, RegisterForm } from './components'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { LocaleDropdown } from '@/components/LocaleDropdown'
// import { useI18n } from '@/hooks/web/useI18n'
import { underlineToHump } from '@/utils'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { reactive, ref } from 'vue'
import shoppingBagLeft from '@/assets/svgs/login/shoppingBagLeft.svg'
import shoppingBagRight from '@/assets/svgs/login/shoppingBagRight.svg'
import humanBG from '@/assets/svgs/login/human.svg'
import plant from '@/assets/svgs/login/plant.svg'
import loginBackground from '@/assets/svgs/login/loginBackground.svg'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login')

const appStore = useAppStore()

const shoppingBG = reactive({
  backgroundImage: `url(${loginBackground})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center'
})

// const { t } = useI18n()

const isLogin = ref(true)

const toRegister = () => {
  isLogin.value = false
}

const toLogin = () => {
  isLogin.value = true
}
</script>

<template>
  <div
    :class="prefixCls"
    class="h-[100%] relative <xl:bg-v-dark <sm:px-10px <xl:px-10px <md:px-10px"
  >
    <div class="relative h-full flex mx-auto">
      <div
        :class="`${prefixCls}__left flex-1 bg-black-500 bg-opacity-30 relative p-30px <xl:hidden`"
      >
        <div class="flex items-center relative text-white">
          <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
          <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
        </div>
        <div class="flex justify-center items-center h-[calc(100%-60px)]">
          <TransitionGroup
            appear
            tag="div"
            enter-active-class="animate__animated animate__bounceInLeft"
            class="w-full h-full"
          >
            <div
              :span="16"
              class="cartoon-animation flex w-full h-full"
              :style="shoppingBG"
              key="1"
            >
              <div class="liquid-1"></div>
              <div class="liquid-2"></div>
              <div class="liquid-3"></div>
              <div class="rotate-shopping-bag-left">
                <img :src="shoppingBagLeft" alt="Shopping bag left" class="shopping-bag-left" />
              </div>
              <img :src="shoppingBagRight" alt="Shopping bag right" class="shopping-bag-right" />
              <img :src="humanBG" alt="Human" class="human" />
              <img :src="plant" alt="Plant" class="plant" />
              <div class="text-content">
                <p>ERP quản trị hệ thống LUXDEAL</p>
                <p>Sàn giao dịch hàng hiệu trực tuyến hàng đầu</p>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
      <div class="flex-1 p-30px <sm:p-10px dark:bg-v-dark relative">
        <div class="flex justify-between items-center text-white @2xl:justify-end @xl:justify-end">
          <div class="flex items-center @2xl:hidden @xl:hidden">
            <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
            <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
          </div>

          <div class="flex justify-end items-center space-x-10px">
            <ThemeSwitch />
            <LocaleDropdown class="<xl:text-white dark:text-white" />
          </div>
        </div>
        <Transition appear enter-active-class="animate__animated animate__bounceInRight">
          <div
            class="h-full flex items-center m-auto w-[100%] @2xl:max-w-500px @xl:max-w-500px @md:max-w-500px @lg:max-w-500px"
          >
            <LoginForm
              v-if="isLogin"
              class="p-20px h-auto m-auto <xl:(rounded-3xl light:bg-white)"
              @to-register="toRegister"
            />
            <RegisterForm
              v-else
              class="p-20px h-auto m-auto <xl:(rounded-3xl light:bg-white)"
              @to-login="toLogin"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-login';

.@{prefix-cls} {
  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/svgs/login/login-bg.svg');
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}
</style>
<style lang="scss" scoped>
@function get-vh($px-vh, $base-vh: 768px) {
  @return calc(($px-vh * 100vh) / $base-vh);
}
@function get-vw($px-vw, $base-vw: 1366px) {
  @return calc(($px-vw * 100vw) / $base-vw);
}
$title-color: #aeb11a;
$large-line-height: get-vh(24px);
$white: #fff;

.cartoon-animation {
  position: relative;
  background-size: get-vw(658.26px) get-vh(414.24px);
  box-shadow: 0px 0px 13px 3px #68d3fd;
  border-radius: 5%;
  .text-content {
    position: absolute;
    bottom: get-vh(23px);
    width: 100%;
    height: get-vw(56px);
    text-align: center;
    p:nth-child(1) {
      color: $title-color;
      font-weight: 400;
      font-size: $large-line-height;
      line-height: get-vh(28.13px);
      margin-bottom: get-vh(5px);
    }
    p:nth-child(2) {
      color: $white;
    }
  }
  .human {
    position: absolute;
    width: 26%;
    height: 50.7%;
    left: 35%;
    bottom: 14%;
    animation-name: humanMove;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-duration: 2.7s;
    z-index: 13px;
  }
  @keyframes humanMove {
    50% {
      bottom: 16%;
    }
  }
  .shopping-bag-right {
    position: absolute;
    width: 9%;
    height: 17%;
    left: 40%;
    bottom: 20.7%;
    z-index: 11px;
    animation-name: rightBag;
    animation-iteration-count: infinite;
    animation-duration: 2.7s;
    animation-timing-function: linear;
  }
  @keyframes rightBag {
    40% {
      bottom: 22.7%;
      transform: rotate(-7deg);
    }
  }
  .rotate-shopping-bag-left {
    position: relative;
    width: get-vw(200px);
    height: get-vw(230px);
    left: 40.1%;
    bottom: -40.3%;
    z-index: 12px;
    .shopping-bag-left {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 50%;
      height: 50%;
    }
    animation-name: leftBag;
    animation-iteration-count: infinite;
    animation-duration: 2.7s;
    animation-timing-function: linear;
  }
  @keyframes leftBag {
    40% {
      bottom: -38.3%;
      transform: rotate(5deg);
    }
  }
  .liquid-1 {
    position: absolute;
    width: get-vw(37.29px);
    height: get-vh(30.78px);
    left: get-vw(178.03px);
    top: get-vh(77.97px);
    border-radius: 54% 46% 42% 58% / 60% 58% 42% 40%;
    background: linear-gradient(153deg, #95b5af 22.13%, #1d6b62 94.14%);
    animation: liquid1 3s linear infinite;
    box-shadow: 1px 3px 3px #63702d;
  }
  .liquid-2 {
    position: absolute;
    width: get-vw(67.74px);
    height: get-vh(62px);
    left: get-vw(34px);
    top: get-vh(567px);
    background: linear-gradient(
      53deg,
      #5b3871 15.48%,
      #9a8fb3 58.4%,
      #a08cb3 15.48%,
      #beb0cf 77.27%
    );
    box-shadow: 0px 4px 4px #000;
    border-radius: 31% 69% 44% 56% / 66% 58% 42% 34%;
    animation: liquid2 3s linear infinite;
  }
  .liquid-3 {
    position: absolute;
    width: get-vw(70.42px);
    height: get-vh(64.07px);
    left: get-vw(577.34px);
    top: get-vh(65.78px);
    background: linear-gradient(50deg, #f3e7e7 28.33%, #e90707 94.38%);
    box-shadow: 2px -1px 4px 1px #2e0202;
    border-radius: 37% 63% 35% 65% / 55% 58% 42% 55%;
    animation: liquid3 3s linear infinite;
    z-index: 13;
  }
  @keyframes liquid1 {
    20% {
      border-radius: 28% 72% 62% 38% / 53% 41% 59% 47%;
    }
    40% {
      border-radius: 62% 38% 77% 23% / 36% 60% 40% 64%;
    }
    60% {
      border-radius: 30% 70% 60% 40% / 63% 62% 38% 37%;
    }
    80% {
      border-radius: 60% 40% 32% 68% / 38% 36% 64% 62%;
    }
  }
  @keyframes liquid2 {
    25% {
      border-radius: 28% 72% 62% 38% / 53% 41% 59% 47%;
    }
    50% {
      border-radius: 62% 38% 77% 23% / 36% 60% 40% 64%;
    }
    75% {
      border-radius: 30% 70% 60% 40% / 63% 62% 38% 37%;
    }
    95% {
      border-radius: 60% 40% 32% 68% / 38% 36% 64% 62%;
    }
  }
  @keyframes liquid3 {
    15% {
      border-radius: 28% 72% 62% 38% / 53% 41% 59% 47%;
    }
    26% {
      border-radius: 62% 38% 77% 23% / 36% 60% 40% 64%;
    }
    58% {
      border-radius: 30% 70% 60% 40% / 63% 62% 38% 37%;
    }
    86% {
      border-radius: 60% 40% 32% 68% / 38% 36% 64% 62%;
    }
  }
  .plant {
    position: absolute;
    left: 68.65%;
    top: 79.56%;
    animation: plantRotate 1s linear infinite;
  }
  @keyframes plantRotate {
    20% {
      transform: rotate(-5deg);
    }
    40% {
      transform: rotate(1deg);
    }
    60% {
      transform: rotate(5deg);
    }
    80% {
      transform: rotate(9deg);
    }
  }
}
</style>
