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
  ElCheckbox,
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


onBeforeMount(async () => {
  // filter recursive
  var filterRouter = await routerMap.
    filter(function filterFunction(o) {
      if (o.children) {
        return (o.children = o.children.filter(filterFunction)).length
      }
      if (o?.name && !o?.name.includes(utility)) {          
       
      return true
    } 

  
    })
  if (filterRouter[filterRouter.length - 1] && filterRouter[filterRouter.length - 1].name == 'NotFound')
      filterRouter.splice(filterRouter.length - 1,1)
// mapping recursive
  ElTreeData.value = mappingRouterTree(filterRouter)
})

function mappingRouterTree(tree) {
if(Array.isArray(tree) && tree.length > 0)
  return cloneDeepWith(tree, node => {
    if (node?.name && !node?.name.includes(utility)) {
      /**
       * Be careful not to mutate `node` unless you want also
       * want the original tree to be affected.
       */
      if (node.children)
        return {
          id: node.path,
          label: node.meta?.title ? t(`${node.meta.title}`) : '',
          addable: node.meta?.add,
          editable: node.meta?.edit,
          deletable: node.meta?.delete,
          add: false,
          edit: false,
          delete:false,
          children: mappingRouterTree(node.children)
        };
      else
        return {
          id: node.path,
          label: node.meta?.title ? t(`${node.meta.title}`) : '',
          addable: node.meta?.add,
          editable: node.meta?.edit,
          deletable: node.meta?.delete,
          add: false,
          edit: false,
          delete:false
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
          <ElFormItem class="w-screen-lg">
            <ElTree                
              :data="ElTreeData"
              show-checkbox
              node-key="id"
              default-expand-all 
              class="w-[100%]"                      
            >
              <template #default="{ node }">
                <div class="flex justify-between w-[100%]" >                  <div> {{ node.data.label }}</div>
               
                    
                  
                  <div class="extension-function w-[30%]">
                    <p v-if="node.data.addable" >
                      <ElCheckbox v-model="node.data.add">Thêm</ElCheckbox>   
                    </p>
                    <p  v-if="node.data.editable" > 
                      <ElCheckbox v-model="node.data.edit">Sửa</ElCheckbox> 
                    </p>
                    <p  v-if="node.data.deletable"> 
                      <ElCheckbox v-model="node.data.delete">Xóa</ElCheckbox> 
                    </p>
                  </div>
                </div>
              </template>
            </ElTree>
          </ElFormItem>
        </ElForm>
      </ElCol>
    </ElRow>
  </ContentWrap>
</template>
<style lang="scss" scoped>

@mixin d-flex {
  display: flex;
  align-items: center;
}
.extension-function {
  @include d-flex;
  justify-content: space-around;

  p {
    border-bottom: 2px solid var(--app-contnet-bg-color);
    @include d-flex;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    width: 30%;
    span {
      width: fit-content;
      font-weight: 500;
      text-align: center;
    }
    &:hover {
      border-bottom: 2px solid var(--el-color-primary);
    }
  }
}
</style>