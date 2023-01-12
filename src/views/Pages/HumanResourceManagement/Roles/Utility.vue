<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  FormInstance,
  ElDivider,
  ElTree,
  FormRules
} from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { appModules } from '@/config/app'

const { utility } = appModules
let ElTreeData = reactive<any[]>([])
const router = useRouter()
onMounted(() => {
  console.log(router.getRoutes)
  const decentralizedRoute = router.getRoutes().map((route) => {
    const { path, meta } = route
    if (path && !path.includes(utility) && meta.title) {
      return {
        id: path,
        label: meta.title
      }
    }
  })
  if (decentralizedRoute.length > 0) ElTreeData = decentralizedRoute
})

const { t } = useI18n()

const decentralizationRef = ref<FormInstance>()
const RouterListRef = ref<FormInstance>()
const decentralizationModule = reactive({
  roleName: ''
})
const decentralizationRule = reactive<FormRules>({
  roleName: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ]
})
const defaultProps = {
  children: 'children',
  label: 'label'
}
</script>
<template>
  <ContentWrap :title="t('reuse.decentralization')" :back-button="true">
    <ElRow>
      <ElCol>
        <ElDivider content-position="left">{{ t('reuse.addNewRole') }}</ElDivider>
        <ElForm
          ref="decentralizationRef"
          :rules="decentralizationRule"
          :module="decentralizationModule"
          status-icon
        >
          <ElFormItem :label="t('reuse.roleName')" prop="roleName">
            <ElInput v-model="decentralizationModule.roleName" class="w-[40]" />
          </ElFormItem>
        </ElForm>
      </ElCol>
    </ElRow>
    <ElRow>
      <ElCol>
        <ElDivider content-position="left">{{ t('reuse.choosePermission') }}</ElDivider>
        <ElForm ref="RouterListRef" status-icon>
          <ElFormItem>
            <ElTree
              :data="ElTreeData"
              show-checkbox
              node-key="id"
              default-expand-all
              :props="defaultProps"
            >
              <template #default="{ node }">
                <span class="custom-tree-node">
                  <span>{{ t(node.label) }}</span>
                  <span>
                    <a> Append </a>
                    <a style="margin-left: 8px"> Delete </a>
                  </span>
                </span>
              </template>
            </ElTree>
          </ElFormItem>
        </ElForm>
      </ElCol>
    </ElRow>
  </ContentWrap>
</template>
