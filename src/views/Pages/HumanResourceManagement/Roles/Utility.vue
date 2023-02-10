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
  ElButton
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
    // remove not found 404 page
  if (filterRouter[filterRouter.length - 1] && filterRouter[filterRouter.length - 1].name == 'NotFound')
    filterRouter.splice(filterRouter.length - 1, 1)
// mapping recursive
  ElTreeData.value = mappingRouterTree(filterRouter,null)
})

function mappingRouterTree(tree,parentPath) {
if(Array.isArray(tree) && tree.length > 0)
  return cloneDeepWith(tree, node => {
    if (node?.name && !node?.name.includes(utility)) {
      /**
       * Be careful not to mutate `node` unless you want also
       * want the original tree to be affected.
       */
      const currentNodePath = parentPath !== null ? parentPath + '/'+ node.path: node.path
      if (node.children)
        return {
          id: currentNodePath,
          label: node.meta?.title ? t(`${node.meta.title}`) : '',
          addable: node.meta?.add,
          editable: node.meta?.edit,
          deletable: node.meta?.delete,
          add: false,
          edit: false,
          delete:false,
          children: mappingRouterTree(node.children,currentNodePath)
        };
      else
        return {
          id: currentNodePath,
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
  roleName: [required(), { validator: notSpecialCharacters, trigger: 'blur' }],
}
const roleStatus = ref(true)
const createNewRoleEvent = () => { 

}
const getCheckedKeysEvent = (...params) => { 
  console.log(params)
}
</script>
<template>
  <ContentWrap :title="t('reuse.decentralization')" :back-button="true">
    <section style="width: 60%;">
    <ElRow>
      <ElCol>
        <ElDivider content-position="left" >{{ t('reuse.addNewRole') }}</ElDivider>
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
    <ElDivider  content-position="left">{{ t('reuse.choosePermission') }}</ElDivider>
      <ElRow class="row-bg" justify="space-between" >
        <ElCol :span="12" ><span class="grid-content bg-gray-500 bg-opacity-50 pl-4">{{t('reuse.accessCategoriesPermission')}}</span></ElCol>
        <ElCol :span="12"><span class="grid-content bg-gray-500 bg-opacity-50 text-right pr-4 "> {{t('reuse.actionPermision')}}</span></ElCol>
      </ElRow>
    <ElRow class="max-h-500px overflow-y-scroll overflow-x-hidden box-shadow-inset">
      <ElCol>
        <ElForm ref="RouterListRef" status-icon>
          <ElFormItem class="w-screen-lg">
            <ElTree                
              :data="ElTreeData"
              show-checkbox
              node-key="id"
              default-expand-all 
              class="w-[100%]"   
              :getCheckedKeys ="getCheckedKeysEvent"                  
            >
              <template #default="{ node }">
                <div class="flex justify-between w-[100%]" >                  
                  <div> {{ node.data.label }}</div>
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
    <ElRow justify="space-between">
      <ElCol :span="4" >
          <p class="mr-5">{{t('formDemo.statusActive')}}</p>          
        </ElCol>
        <ElCol :span="20" >
         <ElCheckbox v-model = "roleStatus">{{ t('formDemo.isActive') }}</ElCheckbox>
      </ElCol>
    </ElRow >
    <ElRow justify="space-between">
      <ElCol :span="4">
          <p class="mr-5">{{t('formDemo.statusAccount')}}</p>
        </ElCol>
        <ElCol :span="20">
        <ul class="arrow-box">
          <li class="arrow-box-item"> {{t('formDemo.isNewAccount')}}</li>    
        </ul>
      </ElCol>
    </ElRow>
  
          <ElButton type="primary" @click="createNewRoleEvent" >
          {{ t('reuse.save') }}
        </ElButton>
        <ElButton type="primary">
          {{ t('reuse.saveAndAdd') }}
        </ElButton>
  
      
  </section>
  </ContentWrap>
</template>
<style lang="scss" scoped>
@import '@/styles/reusable.scss';
.extension-function {
  display: flex;
  align-items: center;
  justify-content: space-around;

  p {
    border-bottom: 2px solid var(--app-contnet-bg-color);
    display: flex;
    align-items: center;
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
:deep(.el-divider__text)
{
    font-size: 17px; 
    font-weight: 700;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
 display: block;
 height: 100%;
}
.box-shadow-inset{
  box-shadow: inset 0 0 10px var(--el-color-info);
}

</style>