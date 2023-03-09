<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElRow,
  ElCol,
  ElDivider,
  ElTree,
  ElCheckbox,
  ElButton,
  ElNotification,
ElMessage
} from 'element-plus'
import { Form } from '@/components/Form'
import { onBeforeMount, reactive, ref,unref } from 'vue'
import { appModules } from '@/config/app'
import { useValidator } from '@/hooks/web/useValidator'
import { asyncRouterMap } from '@/router'
import { cloneDeep, cloneDeepWith } from 'lodash-es'
import { postCreateNewStaffRole } from '@/api/HumanResourceManagement'
import { useForm } from '@/hooks/web/useForm' 
const { t } = useI18n()
const { utility } = appModules
const { required, notSpecialCharacters } = useValidator()
interface Tree {
  label: string
  children?: Tree[]
}
let ElTreeData = ref<Tree[]>([])
const routerMap = cloneDeep(asyncRouterMap)
const { register, elFormRef, methods } = useForm()
const loading = ref(false)

const rules = {
  roleName: [required(), {required: true, validator: notSpecialCharacters, trigger: 'blur' }],
}
const schema = reactive<FormSchema[]>([

  {
    field: 'roleName',
    label: t('reuse.roleName'),
    value: '',
    disabled: loading.value == true,
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('reuse.inputName')
    }
  },
  {
    field: 'description',
    label: t('reuse.description'),
    value: '',
    disabled: loading.value == true,
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: t('formDemo.enterDescription')
    }
  },
  {
    field: 'chooseRouter',
    label: t('reuse.choosePermission'),
    component: 'Divider',
    colProps: {
      span: 12
    }
  },
  {
    field: 'banner',
    colProps: {
      span: 24
    }
  },
  {
    field: 'tree',
    colProps: {
      span:24
    }
  }
])
onBeforeMount(async () => {
  // filter recursive, eliminate the utilities screen
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
          url: currentNodePath,
          label: node.meta?.title ? t(`${node.meta.title}`) : '',
          addable: node.meta?.add,
          editable: node.meta?.edit,
          deletable: node.meta?.delete,
          add: false,
          edit: false,
          delete:false,
          children: mappingRouterTree(node.children, currentNodePath),
          isParents:true
        };
      else
        return {
          url: currentNodePath,
          label: node.meta?.title ? t(`${node.meta.title}`) : '',
          addable: node.meta?.add,
          editable: node.meta?.edit,
          deletable: node.meta?.delete,
          add: false,
          edit: false,
          delete: false,
          isParents:false
        };
    }
    
  });
  return []
}
const roleStatus = ref(true)
const treeRef = ref<InstanceType<typeof ElTree>>()
const createNewRoleEvent = () => {
  const formRef = unref(elFormRef)
  formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const routes = treeRef.value?.getCheckedNodes() ?? []
      const { getFormData } = methods
      const formData = await getFormData()
      if (routes.length > 0) {
        const params = {
          ...formData,
          isActive: roleStatus.value,
          router: routes?.map(el => ({
            url: el.url,
            addable: el.addable ?? null,
            editable: el.editable ?? null,
            deletable: el.deletable ?? null
          }))
        }
        postCreateNewStaffRole(params).then(res => {
          console.log(res);

          ElNotification({
            message: t('reuse.addSuccess'),
            type: 'success'
          })
        }).catch(() => {
          ElNotification({
            message: t('reuse.addFail'),
            type: 'error'
          })
        }).finally(() => {
          loading.value = false
        })
      } else { 
        loading.value = false
        ElMessage.error(t('reuse.pleaseChooseTheRole'))
      } 
     
    }else ElMessage.error(t('reuse.notFillAllInformation'))
  })
  

}


</script>
<template>
  <ContentWrap :title="t('reuse.decentralization')" :back-button="true">
    <section style="width: 60%;">
    <ElRow>
      <ElCol>
        <ElDivider content-position="left" >{{ t('reuse.addNewRole') }}</ElDivider>
        <Form
        :schema="schema"
        :rules="rules"
        label-position="top"
        hide-required-asterisk
        size="large"
        @register="register"
        status-icon
        >
        <template #banner>
          <ElRow class="row-bg w-[100%]" justify="space-between">
            <ElCol :span="12" ><span class="grid-content bg-gray-500 bg-opacity-30 pl-4">{{t('reuse.accessCategoriesPermission')}}</span></ElCol>
            <ElCol :span="12"><span class="grid-content bg-gray-500 bg-opacity-30 text-right pr-4 "> {{t('reuse.actionPermision')}}</span></ElCol>
          </ElRow>
        </template>
        <template #tree>
          <ElRow class="max-h-500px overflow-y-scroll overflow-x-hidden w-[100%]">
            <ElCol>            
              <ElTree 
                ref="treeRef"               
                :data="ElTreeData"
                show-checkbox
                node-key="url"
                default-expand-all 
                class="w-[100%]"                   
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
            </ElCol>
          </ElRow>
        </template>
        </Form>
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
  
          <ElButton type="primary" @click="createNewRoleEvent()" v-loading.fullscreen.lock="loading" >
          {{ t('reuse.save') }}
        </ElButton>
        <ElButton type="primary" v-loading.fullscreen.lock="loading">
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
  border: 1px solid var(--el-color-info);
}

</style>