<script setup lang="ts">
import { reactive, ref, unref, watch } from 'vue'
import { Form } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox, ElLink, ElNotification } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { loginApi, GetRouterByStaffAccountId } from '@/api/login'
// import { getRoutesAsRolesApi } from '@/api/login'
import { getStaffInfoByAccountId } from '@/api/HumanResourceManagement'
import { useCache } from '@/hooks/web/useCache'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { UserType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'

const { required, notSpecialCharacters } = useValidator()

// const emit = defineEmits(['to-register'])

const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push } = useRouter()

const { wsCache } = useCache()

const { t } = useI18n()

const rules = {
  username: [required(), { validator: notSpecialCharacters, trigger: 'blur' }],
  password: [required(), { validator: notSpecialCharacters, trigger: 'blur' }]
}
const loading = ref(false)

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    }
  },
  {
    field: 'username',
    label: t('login.username'),
    value: '',
    disabled: loading.value == true,
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.usernamePlaceholder')
    }
  },
  {
    field: 'password',
    label: t('login.password'),
    value: '',
    disabled: loading.value == true,
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    }
  }
  // {
  //   field: 'other',
  //   component: 'Divider',
  //   label: t('login.otherLogin'),
  //   componentProps: {
  //     contentPosition: 'center'
  //   }
  // },
  // {
  //   field: 'otherIcon',
  //   colProps: {
  //     span: 24
  //   }
  // }
])

const iconSize = 30

const remember = ref(false)

const { register, elFormRef, methods } = useForm()

const iconColor = '#999'

const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

// Log in
const signIn = () => {
  const formRef = unref(elFormRef)
  formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const { getFormData } = methods
      const formData = await getFormData<UserType>()

      try {
        const res = await loginApi(formData)
        if (res) {
          const now = new Date()
          if(wsCache['storage']?.length > 0)
            wsCache.clear() 
          Object.assign(res.data['userInformation'], { loginTime: now.getTime() })
          const accountId = res.data['userInformation']?.id ?? null
          if (accountId) {
            getUserInfoByAccountId(accountId)
            setPermissionForUser(res.data)
            getRole(accountId)
            ElNotification({
              message: t('login.welcome'),
              type: 'success'
            })
          } else {
            ElNotification({
              message: t('reuse.accountInfo'),
              type: 'error'
            })
            wsCache.clear()
          }          
        } else
        ElNotification({
              message: t('login.incorrectAccount'),
              type: 'error'
            })
      } catch (err:any){
        ElNotification({
              message: err ? err.toString() : t('router.errorPage'),
              type: 'error'
            })
       }
      finally {
        loading.value = false
      }
    }
  })
}

// Get role information
const getRole = async (accountId) => {
  // get role list
  try {
    const routers = await GetRouterByStaffAccountId({ id: accountId })
    // var tempUrl = await getRoutesAsRolesApi({ roleName: 'test' })

    if (routers?.data && routers.data.length > 0) {
      const urlList = routers.data.map((el) => el.url)
      //generateRouter(tempUrl.data)
      await generateRouter(urlList)
    } else {
      ElNotification({
        message: t('reuse.authorized'),
        type: 'error'
      })
    }
  } catch {
    ElNotification({
      message: `${t('router.errorPage')}`,
      type: 'error'
    })
  }
}
const generateRouter = (routers) => {
  // save roles in local storage
  wsCache.set(permissionStore.getRouterByRoles, routers)
  //  generate router by roles
  permissionStore.generateRoutes(routers, 'client').catch(() => {})

  permissionStore.getAddRouters.forEach((route) => {
    addRoute(route as RouteRecordRaw) //Dynamic adding accessible routing table
  })
  permissionStore.setIsAddRouters(true)
  push({ path: redirect.value || permissionStore.addRouters[0].path })
}
const getUserInfoByAccountId = (id) => {
  getStaffInfoByAccountId({ Id: id })
    .then((res) => {
      if (res.data && Object.keys(res.data).length > 0) {
        wsCache.set(permissionStore.getStaffInfo, res.data)
      }
    })
    .catch((err) => {
      console.error(err)
      ElNotification({
        message: t('reuse.accountInfo'),
        type: 'error'
      })
    })
}
// store user information
const setPermissionForUser = (data) => {
  wsCache.set(permissionStore.getAccessToken, data['accessToken'] ?? '')
  wsCache.set(permissionStore.getRefreshToken, data['refreshToken'] ?? '')
}
// Go to register a page
// const toRegister = () => {
//   emit('to-register')
// }
</script>

<template>
  <Form
    :schema="schema"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="border-1 border-[var(--el-border-color)] border-solid rounded-3xl box-shadow-blue"
    @register="register"
  >
    <template #title>
      <h2 class="text-2xl font-bold text-center w-[100%]">{{ t('login.login') }}</h2>
    </template>

    <template #tool>
      <div class="flex justify-between items-center w-[100%]">
        <ElCheckbox v-model="remember" :label="t('login.remember')" size="small" />
        <ElLink type="primary" :underline="false">{{ t('login.forgetPassword') }}</ElLink>
      </div>
    </template>

    <template #login>
      <div class="w-[100%]">
        <ElButton
          v-loading.fullscreen.lock="loading"
          type="primary"
          class="w-[100%]"
          @click="signIn"
          :disabled="loading"
        >
          {{ t('login.login') }}
        </ElButton>
      </div>
      <!-- bỏ chức năng đăng ký -->
      <!-- <div class="w-[100%] mt-15px">
        <ElButton class="w-[100%]" @click="toRegister">
          {{ t('login.register') }}
        </ElButton>
      </div> -->
    </template>

    <template #otherIcon>
      <div class="flex justify-between w-[100%]">
        <Icon
          icon="ant-design:github-filled"
          :size="iconSize"
          class="cursor-pointer anticon"
          :color="iconColor"
        />
        <Icon
          icon="ant-design:wechat-filled"
          :size="iconSize"
          class="cursor-pointer anticon"
          :color="iconColor"
        />
        <Icon
          icon="ant-design:alipay-circle-filled"
          :size="iconSize"
          :color="iconColor"
          class="cursor-pointer anticon"
        />
        <Icon
          icon="ant-design:weibo-circle-filled"
          :size="iconSize"
          :color="iconColor"
          class="cursor-pointer anticon"
        />
      </div>
    </template>
  </Form>
</template>

<style lang="less" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
.box-shadow-blue {
  box-shadow: 0px 0px 7px 1px #68d3fd;
}
</style>