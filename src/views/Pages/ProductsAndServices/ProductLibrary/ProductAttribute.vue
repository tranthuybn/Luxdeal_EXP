<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { ElTree, ElTreeSelect } from 'element-plus'
import { onBeforeMount, ref } from 'vue'
import {
  colorData,
  genderData,
  getCategoriesData,
  materialData,
  sizeData,
  statusData
} from './ProductLibraryManagement'

const { t } = useI18n()

const props = defineProps({
  defaultValue: {
    type: Array,
    default: () => []
  }
})
const modelValue = ref(props.defaultValue)
const treeRef = ref<InstanceType<typeof ElTree>>()

const emit = defineEmits(['change-value'])
// type treeType = {
//   value: number
//   label: string
//   parentid: number
//   disabled: boolean
//   children: treeType[]
// }
const treeSelectData: any = ref([
  {
    value: -1,
    label: t('reuse.color'),
    parentid: 0,
    disabled: true,
    children: []
  },
  {
    value: -3,
    label: t('reuse.material'),
    parentid: 0,
    disabled: true,
    children: []
  },
  {
    value: -2,
    label: t('reuse.size'),
    parentid: 0,
    disabled: true,
    children: []
  },
  {
    value: -5,
    label: t('reuse.gender'),
    parentid: 0,
    disabled: true,
    children: []
  },
  {
    value: -4,
    label: t('reuse.status'),
    parentid: 0,
    disabled: true,
    children: []
  }
])

const customCheck = (nodeObj, tree) => {
  const checkedNodes = tree.checkedNodes
  console.log('checkedNodes', modelValue.value, checkedNodes)
  // const checkedKeys = tree.checkedKeys
  // let sameParent = false
  switch (nodeObj.parentid) {
    //parentid ==0 cap 1
    // case 0:
    //   sameParent = true
    //   break
    //parentid ==1 color
    case -1:
      const nodeBefore = checkedNodes.find((node) => {
        return node.parentid == -1 && node.value != nodeObj.value
      })
      if (nodeBefore) {
        tree.checkedKeys.splice(tree.checkedKeys.indexOf(nodeBefore.value), 1)
      }
      break
    //parentid ==2 size
    case -2:
      const nodeBefore2 = checkedNodes.find((node) => {
        return node.parentid == -2 && node.value != nodeObj.value
      })
      if (nodeBefore2) {
        tree.checkedKeys.splice(tree.checkedKeys.indexOf(nodeBefore2.value), 1)
      }
      break
    //parentid ==3 material
    case -3:
      const nodeBefore3 = checkedNodes.find((node) => {
        return node.parentid == -3 && node.value != nodeObj.value
      })
      if (nodeBefore3) {
        tree.checkedKeys.splice(tree.checkedKeys.indexOf(nodeBefore3.value), 1)
      }
      break
    case -4:
      const nodeBefore4 = checkedNodes.find((node) => {
        return node.parentid == -4 && node.value != nodeObj.value
      })
      if (nodeBefore4) {
        tree.checkedKeys.splice(tree.checkedKeys.indexOf(nodeBefore4.value), 1)
      }
      break
    case -5:
      const nodeBefore5 = checkedNodes.find((node) => {
        return node.parentid == -5 && node.value != nodeObj.value
      })
      if (nodeBefore5) {
        tree.checkedKeys.splice(tree.checkedKeys.indexOf(nodeBefore5.value), 1)
      }
      break
  }
}
const arrayObj: any = ref([])
const checkChange = (nodeObj: any, checked: boolean, _subtree: boolean) => {
  console.log('change:', nodeObj, checked)
  checked ? arrayObj.value.push(nodeObj) : arrayObj.value.splice(arrayObj.value.indexOf(nodeObj), 1)
  emit('change-value', arrayObj.value)
  // parentid = -1 color
  // parentid = -2 material
  // parentid = -3 size
  // parentid = -4 gender
  // parentid = -5 status
}
const loading = ref(true)
onBeforeMount(async () => {
  await getCategoriesData()
    .then(() => {
      treeSelectData.value[0].children = colorData
      treeSelectData.value[2].children = sizeData
      treeSelectData.value[1].children = materialData
      treeSelectData.value[4].children = statusData
      treeSelectData.value[3].children = genderData
    })
    .finally(() => (loading.value = false))
})

const clickTree = () => {
  if (props.defaultValue.length > 0) {
    treeRef.value!.setCheckedKeys(props.defaultValue, false)
  }
}

const filterNodeMethod = (searching, data) => {
  if (!searching) return true
  else {
    searching = searching.toLowerCase()
    return data.label.toLowerCase().includes(searching)
  }
}
</script>
<template>
  <ElTreeSelect
    ref="treeRef"
    v-model="modelValue"
    :loading="loading"
    :data="treeSelectData"
    filterable
    :filter-node-method="filterNodeMethod"
    multiple
    accordion
    check-strictly
    :render-after-expand="false"
    show-checkbox
    node-key="value"
    @check="(nodeObj, tree) => customCheck(nodeObj, tree)"
    @check-change="checkChange"
    @click="clickTree"
  />
</template>
