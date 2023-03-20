<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'
import { appModules } from '@/config/app'
import { computed, h, provide, reactive, } from 'vue'
import { combo, auction, collection, flashSale, newProduct, voucher, banner } from './tables'
import { getCampaignApproval } from '@/api/Approval'
import TableType01 from '../../Components/TableDataBase.vue'
import { ContentWrap } from '@/components/ContentWrap'
import { CampaignType } from '@/utils/API.Variables'



const { utility } = appModules
const { currentRoute } = useRouter()
const { t } = useI18n()
const { push } = useRouter()
const operatorColumn = reactive<TableColumn>({
      field: 'operator',
      label: t('reuse.operator'),
      minWidth: '200',
      formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
        return h('div', { class: 'btn-detail_Approval' }, [
          h(ElButton, { type: 'primary', onClick: () => action(row, 'detail') }, 'Duyệt chi tiết '),
          h('span', { class: 'arrowRight' })
        ])
      }
})

// parameter to call api 
const campaignTypeIndex = computed(():number => {
  switch (currentRoute.value.meta.title) {
    case 'router.flashsale':
    return CampaignType.Flashsale  
    case 'router.collection':
    return CampaignType.BoSuuTap 
    case 'router.newproduct':
    return  CampaignType.HangMoiVe   
    case 'router.voucher':
    return CampaignType.Voucher   
    case 'router.combo':
    return  CampaignType.Combo
    case 'router.auction':
    return  CampaignType.Auction
    case 'router.advertisingBanner':
    return  CampaignType.AdvertisingBanner
    default:
      return 0
  }
})
const params = { CampaignType: campaignTypeIndex.value }
provide('parameters', {
  params
})
// route'name of detail screen
const routeToDetailScreen = computed(():string => {
switch (currentRoute.value.meta.title) {
    case 'router.flashsale':
    return `business.promotion-strategy.flash-sale.${utility}`
    case 'router.collection':
    return `business.promotion-strategy.collection.${utility}`
    case 'router.newproduct':
    return `business.promotion-strategy.new-product.${utility}`
    case 'router.voucher':
    return `business.promotion-strategy.voucher.${utility}`  
    case 'router.combo':
    return `business.promotion-strategy.combo.${utility}` 
    case 'router.auction':
    return  `business.promotion-strategy.auction.${utility}` 
    case 'router.advertisingBanner':
    return  `business.promotion-strategy.advertisingBanner.${utility}` 
    default:
      return ''
  }
})
 

  const tableColumns = computed(():Array<TableColumn> => {
  switch (currentRoute.value.meta.title) {
    case 'router.flashsale':
    return setTableColumn(flashSale)   
    case 'router.collection':
    return setTableColumn(collection)   
    case 'router.newproduct':
    return  setTableColumn(newProduct)   
    case 'router.voucher':
    return  setTableColumn(voucher)   
    case 'router.combo':
    return  setTableColumn(combo)   
    case 'router.auction':
    return  setTableColumn(auction)   
    case 'router.advertisingBanner':
    return  setTableColumn(banner)   
    default:
      return setTableColumn(banner)
  }
})

const setTableColumn = (arr:Array<TableColumn>) => { 
 return [...arr, operatorColumn].slice()
} 

const action = (row: any, _type: string) => {
  const params: any =  { type:'approval', id: row.targetId, targetId: row.id}
  if(row.approveActionType == 2) params.approveRequestId = row.id
  push({
    path: routeToDetailScreen.value ?? '',
    params: params
  })
  }
</script>
<template>
  <ContentWrap
    class="relative"
    :title="t(currentRoute?.meta?.title ? currentRoute?.meta?.title?.toString() : '')"
    :message="t(currentRoute?.meta?.title ? currentRoute?.meta?.title?.toString() : '')"
  >
    <TableType01
      :columns="tableColumns"
      :api="getCampaignApproval"
      isOperatorColumnCustomize
      :selection="false"
      :removeHeaderFilter="true"
      :customOperator="3"
    />
  </ContentWrap>

</template>


<style scoped>
::v-deep(.arrowRight) {
  position: relative;
  top: 12px;
  right: 20px;
  height: 0;
}

::v-deep(.btn-detail_Approval) {
  display: flex;
  justify-content: center;
}

::v-deep(.btn-detail_Approval > button) {
  padding: 8px 24px 8px 10px;
}
</style>

<style></style>
