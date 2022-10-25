<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts">
import { getCategories } from '@/api/LibraryAndSetting'
import { useI18n } from '@/hooks/web/useI18n'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'

import { ElTreeSelect } from 'element-plus'
import { reactive, ref, watch } from 'vue'

const { t } = useI18n()
const props = defineProps({
  value: {
    type: String || Array,
    default: ''
  }
})
const modelValue = ref()
watch(
  () => props.value,
  () => (modelValue.value = props.value)
)
const emit = defineEmits(['change-value'])
const treeSelectData = ref([
  {
    value: 1,
    label: t('reuse.color'),
    parentid: 0,
    disabled: true,
    children: []
  },
  {
    value: 2,
    label: t('reuse.size'),
    parentid: 0,
    disabled: true,
    children: []
  },
  {
    value: 3,
    label: t('reuse.material'),
    parentid: 0,
    disabled: true,
    children: []
  },
  {
    value: 4,
    label: t('reuse.status'),
    parentid: 0,
    disabled: true,
    children: []
  },
  {
    value: 5,
    label: t('reuse.gender'),
    parentid: 0,
    disabled: true,
    children: []
  }
])
let colorData = reactive([])
let sizeData = reactive([])
let materialData = reactive([])
let statusData = reactive([])
let genderData = reactive([])

let callAttribute = 0
const getAttributeData = async () => {
  if (callAttribute == 0) {
    await getCategories({
      TypeName: PRODUCTS_AND_SERVICES[1].key,
      pageSize: 1000,
      pageIndex: 1
    }).then(
      (res) =>
        (colorData = res.data.map((color) => ({ label: color.name, value: color.id, parentid: 1 })))
    )
    await getCategories({
      TypeName: PRODUCTS_AND_SERVICES[2].key,
      pageSize: 1000,
      pageIndex: 1
    }).then(
      (res) =>
        (sizeData = res.data.map((size) => ({ label: size.name, value: size.id, parentid: 2 })))
    )
    await getCategories({
      TypeName: PRODUCTS_AND_SERVICES[3].key,
      pageSize: 1000,
      pageIndex: 1
    }).then(
      (res) =>
        (materialData = res.data.map((material) => ({
          label: material.name,
          value: material.id,
          parentid: 3
        })))
    )
    await getCategories({
      TypeName: PRODUCTS_AND_SERVICES[4].key,
      pageSize: 1000,
      pageIndex: 1
    }).then(
      (res) =>
        (statusData = res.data.map((status) => ({
          label: status.name,
          value: status.id,
          parentid: 4
        })))
    )
    await getCategories({
      TypeName: PRODUCTS_AND_SERVICES[5].key,
      pageSize: 1000,
      pageIndex: 1
    }).then(
      (res) =>
        (genderData = res.data.map((gender) => ({
          label: gender.name,
          value: gender.id,
          parentid: 5
        })))
    )

    treeSelectData.value[0].children = colorData
    treeSelectData.value[1].children = sizeData
    treeSelectData.value[2].children = materialData
    treeSelectData.value[3].children = statusData
    treeSelectData.value[4].children = genderData

    callAttribute++
  }
}
const customCheck = (nodeObj, tree) => {
  const checkedNodes = tree.checkedNodes
  const checkedKeys = tree.checkedKeys
  // let sameParent = false
  switch (nodeObj.parentid) {
    //parentid ==0 cap 1
    // case 0:
    //   sameParent = true
    //   break
    //parentid ==1 color
    case 1:
      const nodeBefore = checkedNodes.find((node) => {
        return node.parentid == 1 && node.value != nodeObj.value
      })
      if (nodeBefore) {
        tree.checkedKeys.splice(tree.checkedKeys.indexOf(nodeBefore.value), 1)
      }
      break
    //parentid ==2 size
    case 2:
      const nodeBefore2 = checkedNodes.find((node) => {
        return node.parentid == 2 && node.value != nodeObj.value
      })
      if (nodeBefore2) {
        tree.checkedKeys.splice(tree.checkedKeys.indexOf(nodeBefore2.value), 1)
      }
      break
    //parentid ==3 material
    case 3:
      const nodeBefore3 = checkedNodes.find((node) => {
        return node.parentid == 3 && node.value != nodeObj.value
      })
      if (nodeBefore3) {
        tree.checkedKeys.splice(tree.checkedKeys.indexOf(nodeBefore3.value), 1)
      }
      break
    case 4:
      const nodeBefore4 = checkedNodes.find((node) => {
        return node.parentid == 4 && node.value != nodeObj.value
      })
      if (nodeBefore4) {
        tree.checkedKeys.splice(tree.checkedKeys.indexOf(nodeBefore4.value), 1)
      }
      break
    case 5:
      const nodeBefore5 = checkedNodes.find((node) => {
        return node.parentid == 5 && node.value != nodeObj.value
      })
      if (nodeBefore5) {
        tree.checkedKeys.splice(tree.checkedKeys.indexOf(nodeBefore5.value), 1)
      }
      break
  }
  emit('change-value', checkedKeys)
  // if (sameParent) {
  //   ElNotification({
  //     message: t('reuse.cantChooseMultipleValueForOneAttribute'),
  //     type: 'warning'
  //   })
  //   tree.checkedKeys.splice(tree.checkedKeys.indexOf(nodeObj.value), 1)
  //   // treeRef.value!.setChecked(nodeObj.value, false, false)
  // }

  //bind value to table data
  //   const colorNode = checkedNodes.find((node) => node.parentid == 1)
  //   colorNode
  //     ? ((scope.row.categories[0].id = colorNode.value),
  //       (scope.row.categories[0].value = colorNode.label))
  //     : ''
  //   const sizeNode = checkedNodes.find((node) => node.parentid == 2)
  //   sizeNode
  //     ? ((scope.row.categories[2].id = sizeNode.value),
  //       (scope.row.categories[2].value = sizeNode.label))
  //     : ''
  //   const materialNode = checkedNodes.find((node) => node.parentid == 3)
  //   materialNode
  //     ? ((scope.row.categories[1].id = materialNode.value),
  //       (scope.row.categories[1].value = materialNode.label))
  //     : ''
  //   scope.row.categoriesValue = checkedKeys
  //   scope.row.categoriesLabel = checkedNodes.map((node) => node.label)
}
</script>
<template>
  <ElTreeSelect
    v-model="modelValue"
    :data="treeSelectData"
    multiple
    accordion
    check-strictly
    :render-after-expand="false"
    ref="treeRef"
    show-checkbox
    node-key="value"
    @check="(nodeObj, tree) => customCheck(nodeObj, tree)"
    @click="getAttributeData"
  />
</template>
