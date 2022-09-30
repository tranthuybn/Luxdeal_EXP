<script setup lang="ts">
import { ref } from 'vue'
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useDesign } from '@/hooks/web/useDesign'
import { Collapse } from './Type'
import { TableOperator } from '../Components/TableBase'
import tableDatetimeFilterBasicVue from '@/views/Pages/Components/TableDataBase.vue'
import TableChildren from './TableBase/src/TableChildren.vue'
import { useI18n } from '@/hooks/web/useI18n'
import { getPotentialCustomerListById } from '@/api/Business'
const { t } = useI18n()

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
const emit = defineEmits(['post-data'])
const postData = (data) => {
  console.log('runhere', data)
  emit('post-data', data)
}
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
          :typeButton="item.typeButton"
        >
          <template #expand>
            <div id="title-price-information">{{ t(`${item.titleChilden}`) }}</div>
            <TableChildren
              id="price-information"
              :expand="false"
              :selection="false"
              :fullColumns="item.columnsTableChild"
              :api="item.apiTableChild"
              :customOperator="item.customOperator"
              :customOperatorChildren="item.customOperatorChildren"
            />
            <ElButton
              v-if="!(item.titleButtonChildren === 'false')"
              :icon="plusIcon"
              id="bt-add"
              class="mx-52"
            >
              {{ item.titleButtonChildren }}</ElButton
            >
          </template>
        </tableDatetimeFilterBasicVue>
        <TableOperator
          v-if="item.typeForm === 'form' || item.typeForm === 'all'"
          class="infinite-list"
          style="overflow: auto"
          :rules="item.rules"
          :apiId="getPotentialCustomerListById"
          :hasImage="item.hasImage"
          @post-data="postData"
          :id="item.id"
          :type="item.type"
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
#title-price-information {
  font-size: large;
  text-align: center;
  font-weight: 600;
}
</style>
