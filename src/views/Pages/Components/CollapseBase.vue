<script setup lang="ts">
import { ref } from 'vue'
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from './Type'
import { TableOperator } from '../Components/TableBase'
import tableDatetimeFilterBasicVue from '@/views/Pages/Components/TableDataBase.vue'
const props = defineProps({
  collapse: {
    type: Array<Collapse>,
    default: () => []
  }
})
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
let currentCollapse = ref<string>(props.collapse[0].name)
const collapseChangeEvent = (val) => {
  if (val) {
    props.collapse.forEach((el) => {
      if (val.includes(el.name)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else
    props.collapse.forEach((el) => {
      el.icon = plusIcon
    })
}

const activeName = ref('information')
// const router = useRouter()
// const currentRoute = String(router.currentRoute.value.params.backRoute)
</script>

<template>
  <div class="demo-collapse">
    <el-collapse v-model="activeName" :collapse="collapse" @change="collapseChangeEvent">
      <el-collapse-item
        v-for="(item, index) in collapse"
        :key="index"
        :name="item.name"
        v-model="currentCollapse"
      >
        <template #title>
          <el-button class="header-icon" :icon="item.icon" link />
          <span class="text-center">{{ item.title }}</span>
        </template>
        <tableDatetimeFilterBasicVue
          :pagination="item.pagination"
          :removeHeaderFilter="item.removeHeaderFilter"
          :removeDrawer="item.removeDrawer"
          :expand="item.expand"
          v-if="item.type === 'table'"
          :titleButtons="item.buttonAdd"
          :columns="item.columns"
          :api="item.api"
          :key="index"
          :apiTableChild="item.apiTableChild"
          :columnsTableChild="item.columnsTableChild"
          :selection="item.selection"
          :customOperator="item.customOperator"
          :titleChilden="item.titleChilden"
        />
        <TableOperator
          v-else
          :hasImage="item.hasImage"
          :schema="item.columns"
          :title="item.title"
          :type="item.type"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
.text-center {
  font-size: 20px;
  margin-left: 5px;
}
</style>
