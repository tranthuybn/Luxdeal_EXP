<script setup lang="ts">
import { ref } from 'vue'
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useDesign } from '@/hooks/web/useDesign'
import { Collapse } from './Type'
import { TableOperator } from '../Components/TableBase'
import tableDatetimeFilterBasicVue from '@/views/Pages/Components/TableDataBase.vue'
const props = defineProps({
  collapse: {
    type: Array<Collapse>,
    default: () => []
  },
  default: {
    type: String,
    default: ''
  }
})
const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('descriptions')

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

const activeName = ref(props.default)
// const router = useRouter()
// const currentRoute = String(router.currentRoute.value.params.backRoute)
</script>

<template>
  <div>
    <el-collapse
      v-model="activeName"
      :collapse="collapse"
      @change="collapseChangeEvent"
      :class="[
        prefixCls,
        'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
      ]"
    >
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
          v-if="item.typeForm === 'table' || item.typeForm === 'all'"
          :titleButtons="item.buttonAdd"
          :columns="item.columns"
          :api="item.api"
          :key="index"
          :apiTableChild="item.apiTableChild"
          :columnsTableChild="item.columnsTableChild"
          :selection="item.selection"
          :customOperator="item.customOperator"
          :titleChilden="item.titleChilden"
          :customOperatorChilden="item.customOperatorChilden"
          :typeButton="item.typeButton"
        />
        <TableOperator
          v-if="item.typeForm === 'form' || item.typeForm === 'all'"
          class="infinite-list"
          style="overflow: auto"
          :hasImage="item.hasImage"
          :schema="item.columns"
          :title="item.title"
          :typeButton="item.typeButton"
          :class="[
            'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
          ]"
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
.infinite-list {
  max-height: 75vh;
}
</style>
