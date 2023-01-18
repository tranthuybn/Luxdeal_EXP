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
  ElTree
} from 'element-plus'
import { onBeforeMount, reactive, ref } from 'vue'
import { appModules } from '@/config/app'
import { useValidator } from '@/hooks/web/useValidator'
import { asyncRouterMap } from '@/router'
import { cloneDeep,cloneDeepWith } from 'lodash-es'
const { utility } = appModules
const { required, notSpecialCharacters } = useValidator()
interface Tree {
  label: string
  children?: Tree[]
}
let ElTreeData = ref<Tree[]>([])
const routerMap = cloneDeep(asyncRouterMap)


onBeforeMount( async () => {
  ElTreeData.value = await mappingRouterTree(routerMap)      
})


function mappingRouterTree(tree) {
if(Array.isArray(tree) && tree.length > 0)
  return cloneDeepWith(tree, node => {
    if (node.path && !node.path.includes(utility)) {
      /**
       * Be careful not to mutate `node` unless you want also
       * want the original tree to be affected.
       */
      if(node.children)
      return {   
        id:node.path,      
        label: t(`${node.meta.title}`),
        children:mappingRouterTree(node.children)
      };
      else 
        return {   
        id:node.path,               
        label: t(`${node.meta.title}`),        
      };
    }
  });
  return []
}

const { t } = useI18n()

const decentralizationRef = ref<FormInstance>()
const RouterListRef = ref<FormInstance>()
const decentralizationModule = reactive({
  roleName: ''
})
const decentralizationRule = {
  username: [required(), { validator: notSpecialCharacters, trigger: 'blur' }],
  password: [required(), { validator: notSpecialCharacters, trigger: 'blur' }]
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
            >
              <template #default="{ node }">
                <span class="custom-tree-node">
                  <span>{{ t(node.label) }}</span>
                  <span>
                    <a> Thêm </a>
                    <a> Sửa </a>
                    <a> Xóa </a>
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
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  span
  {
    a{
      margin-left: 8px    
    }
  }
}
</style>