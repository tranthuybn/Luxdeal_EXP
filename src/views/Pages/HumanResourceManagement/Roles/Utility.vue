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
import { computed, onBeforeMount, reactive, ref,unref } from 'vue'
import { appModules } from '@/config/app'
import { useValidator } from '@/hooks/web/useValidator'
import { asyncRouterMap } from '@/router'
import { cloneDeep, cloneDeepWith } from 'lodash-es'
import { getRoleDetail, postCreateNewStaffRole, editStaffRole } from '@/api/HumanResourceManagement'
import { useForm } from '@/hooks/web/useForm' 
import { RouteRecordName, useRouter } from 'vue-router'
import { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'
import { usePermissionStore } from '@/store/modules/permission'
const { t } = useI18n()
const { utility } = appModules
const { required, notSpecialCharacters } = useValidator()
interface Tree {
  label: string
  children?: Tree[]
}
let ElTreeData = ref<Tree[]>([])
const { register, elFormRef, methods } = useForm()
const loading = ref(false)
const { currentRoute, push } = useRouter()
let roleStatus = ref(true)
const treeRef = ref<InstanceType<typeof ElTree>>()
const { go } = useRouter()
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const utilitiesNodes = reactive<TreeNodeData[]>([])
const permissionStore = usePermissionStore()
const routers = computed(() => permissionStore.getRouters)
const parentRoute = computed((): RouteRecordName  => {
  const { name } = unref(currentRoute)
  if (typeof name == 'string' && name?.length > 0) {    
    return name.replace('.' + utility, '')
  }return ''
})
const typeOfActivity = computed((): string | string[] => { 
     const { params } = unref(currentRoute)
    return params?.type ?? 'add'
}) 
const RoleId = computed(():number=> { 
  const { params } = unref(currentRoute)
  return params.id && typeof params.id == 'string'  ? parseInt(params.id): 0
}) 
const elTReeCheckedNode = computed((): TreeNodeData[] => 
treeRef.value?.getCheckedNodes() ? treeRef.value?.getCheckedNodes() : []
)
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
      placeholder: t('reuse.inputName'),
      disabled: typeOfActivity.value == 'detail'
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
      placeholder: t('formDemo.enterDescription'),
      disabled:typeOfActivity.value == 'detail'
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
onBeforeMount(() => {

//mapping data to the el-tree component
loading.value = true
  ElTreeData.value = mappingRouterTree(routerPreprocessing(), null)
loading.value = false
// mapping recursive
  if (typeof typeOfActivity.value == 'string' && typeOfActivity.value != 'add')
    getRoleDetailEvent()
  })

// filter recursive, eliminate the utilities screen
function routerPreprocessing(): AppRouteRecordRaw[]{ 
  let routesWithoutUtilityPage: AppRouteRecordRaw[] = []
  if (Array.isArray(routers.value) && routers.value.length > 0) {
    let childrenPath = ''
    let char = '/'
    routesWithoutUtilityPage = routers.value.filter(function filterFunction(o) {
      // check if it is the first tier
      if(routers.value.find(el=>el.name == o.name))
        childrenPath = ''
      if (o.path) { 
        childrenPath += o.path[0] == char ? o.path :  char+ o.path
      }
      if (o.children) {
        return (o.children = o.children.filter(filterFunction)).length
      } 
      else if (o?.name && !o?.name.includes(utility) && !o.meta.hidden && o.meta.title) {
        if (childrenPath.includes(char)) { 
          let cutIndex = childrenPath.lastIndexOf(char);
          childrenPath = childrenPath.substring(0, cutIndex);
        }
        return true
      }
      else { 
        // collect all the utility screens for post router to server, next after that
        utilitiesNodes.push({
          url:childrenPath,
          routeName:o.name
        })
        childrenPath = ''
      }
    })
  } 
  return routesWithoutUtilityPage
}



function mappingRouterTree(tree, parentPath) {
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
          routeName: node.name,
          add: false,
          edit: false,
          delete:false,
          children: mappingRouterTree(node.children, currentNodePath),
          isParents: true,
          disabled: typeOfActivity.value == 'detail',
        };
      else
        return {
          url: currentNodePath,
          label: node.meta?.title ? t(`${node.meta.title}`) : '' ,
          addable: node.meta?.add,
          editable: node.meta?.edit,
          deletable: node.meta?.delete,
          routeName: node.name,
          add: false,
          edit: false,
          delete: false,
          isParents: false,
          disabled: typeOfActivity.value == 'detail',
        };
    }
    
  });
  return []
}
const getRoleDetailEvent = () => {
    loading.value = true
    getRoleDetail({ id: RoleId.value }).then((res) => {
      const { data } = res
      if (data) {
        const { setValues } = methods
        setValues({
          roleName: data.roleName,
          description: data.description
        })
        // mapping keys into el-tree, remove indeterminate node
        const routerMap = data.router.filter((el) => !el?.indeterminate)?.map((el) => el.url) ?? []
        if (data.router.length > 0) {
          treeRef.value?.setCheckedKeys(routerMap)
          // mapping type of operators for the nodes
          treeRef.value?.data.map((i: any) => i.children?.map(it => it.children?.map(item => data.router.map((el) => {
            if(el.url == item.url) {
              item.add = el.addable,
              item.edit = el.editable,
              item.delete = el.deletable
            }
          }))))
          treeRef.value?.data.map((i: any) => i.children?.map(it => data.router.map((el) => {
            if(el.url == it.url) {
              it.add = el.addable,
              it.edit = el.editable,
              it.delete = el.deletable
            }
          })))
          treeRef.value?.data.map((i: any) => data.router.map((el) => {
            if(el.url == i.url) {
              i.add = el.addable,
              i.edit = el.editable,
              i.delete = el.deletable
            }
          }))
        }
        // mapping status variable 
        roleStatus.value = data.isActive
      }

    }).catch((err) => {
      ElNotification({
        message: t('reuse.cantFindData'),
        type: 'error'
      })
      console.error(err);
    }).finally(() => {
      loading.value = false
    })
}
const elTReeIndeterminateNodes = reactive<TreeNodeData[]>([])
const handleCheckChange = (nodeData) => {
  // node unchecked then reset all node's operator
  const alreadyChecked = elTReeCheckedNode.value.find(el => el.url === nodeData.url) ?? null 
  const currentNode = treeRef.value?.getNode(nodeData.url);
  if (!alreadyChecked ) { 
    if (!currentNode?.indeterminate) {
      nodeData.add = false,
      nodeData.edit = false
      nodeData.delete = false
      elTReeIndeterminateNodes.splice(elTReeIndeterminateNodes.indexOf(nodeData),1)
    } else{    
    // get indeterminate node
        elTReeIndeterminateNodes.push(nodeData)
    }
  }
 
}
const createOrEditRoleEvent = (goOut = true) => {
  const formRef = unref(elFormRef)
  formRef?.validate(async (isValid) => {
    if (isValid) {
      // loading.value = true
      const utilitiesRoutes = getUtilitiesRoutes(elTReeCheckedNode.value.filter(el=>el.add || el.edit || el.delete))
      const listRouters = elTReeCheckedNode.value.concat(elTReeIndeterminateNodes,utilitiesRoutes)
      const { getFormData } = methods
      const formData = await getFormData()
      if (listRouters.length > 0) {
        const params = {
          ...formData,
          isActive: roleStatus.value,
          router: listRouters?.map(el => ({
            url: el.url ?? '',
            addable: el.add ?? false,
            editable: el.edit ?? false,
            deletable: el.delete ?? false,
            indeterminate: elTReeIndeterminateNodes.find(check=>check.url === el.url) != null
          }))
        }
        if(typeOfActivity.value == 'add')
        postCreateNewStaffRole(params).then(res => {
          ElNotification({
            message: res.message ?? t('reuse.addSuccess'),
            type: res.statusCode == 200 ? 'success' : 'error'
          })
          if (res.statusCode == 200 && goOut&&parentRoute)
            push({name:unref(parentRoute)})
        }).catch(() => {
          ElNotification({
            message: t('reuse.addFail'),
            type: 'error'
          })
        }).finally(() => {
          loading.value = false
        })
        else
        editStaffRole(id, params).then(res => {
          ElNotification({
            message: res.message ?? t('reuse.updateSuccess'),
            type: res.statusCode == 200 ? 'success' : 'error'
          })
          push({name:unref(parentRoute)})
        }).catch(() => {
          ElNotification({
            message: t('reuse.updateFail'),
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
function getUtilitiesRoutes(routes: TreeNodeData[]): TreeNodeData[] {
  const utilitiesNodesChecked: TreeNodeData[] = [] 
  if (unref(routes).length > 0) 
    unref(routes).forEach(rc => {
      // by convention utility screen name = the screen list's name + utility
      const checkedRouteName = rc.routeName + '.' + utility
      const find = utilitiesNodes.find(u => u.routeName === checkedRouteName)
      if (find) { 
        utilitiesNodesChecked.push({
          url: find.url,
          routeName: find.routeName,
          add: rc.add,
          edit: rc.edit,
          delete:rc.delete,
        })
      }
    })
  return utilitiesNodesChecked
}
const openEditRoleEvent = () => {
  push({
    name: `human-resource-management.set-role.${utility}`,
    params: { type: 'edit', id: id }
  })
}
const disableElTreeOperator = (currentNodeKey):boolean => { 
 return typeOfActivity.value == 'detail' || elTReeCheckedNode.value.find((el)=>el.url === currentNodeKey) == null
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
                :check-strictly="false"
                node-key="url"
                default-expand-all 
                class="w-[100%]"           
                @check-change="handleCheckChange"      
              >
                <template #default="{ node,data }">
                  <div class="flex justify-between w-[100%]" >                  
                    <div> {{ data.label }}</div>
                    <div class="extension-function w-[30%]">
                      <p v-if="node.data.addable" >
                        <ElCheckbox v-model="data.add" :disabled="disableElTreeOperator(data.url)">Thêm</ElCheckbox>   
                      </p>
                      <p  v-if="node.data.editable" >
                        <ElCheckbox v-model="data.edit" :disabled="disableElTreeOperator(data.url)">Sửa</ElCheckbox> 
                      </p>
                      <p  v-if="node.data.deletable">
                        <ElCheckbox v-model="data.delete" :disabled="disableElTreeOperator(data.url)">Xóa</ElCheckbox> 
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
         <ElCheckbox v-model = "roleStatus" :disabled="typeOfActivity === 'detail'">{{ t('formDemo.isActive') }}</ElCheckbox>
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
  
    <ElButton v-if="typeOfActivity == 'add' || typeOfActivity == 'edit' " type="primary" @click="createOrEditRoleEvent(true)" v-loading.fullscreen.lock="loading">
      {{ t('reuse.save') }}
    </ElButton>
    <ElButton v-if="typeOfActivity == 'add'" type="primary" @click="createOrEditRoleEvent(false)" v-loading.fullscreen.lock="loading">
      {{ t('reuse.saveAndAdd') }}
    </ElButton>
    <ElButton v-if="typeOfActivity == 'detail'" type="primary" @click="openEditRoleEvent()" v-loading.fullscreen.lock="loading" >
      {{ t('button.edit') }}
    </ElButton>
    <ElButton v-if="typeOfActivity != 'add'" type="danger" @click="go(-1)" >
      {{ t('button.cancel') }}
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