<script setup lang="ts">
import { reactive, ref, unref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import TableAddBusinessProduct from '@/views/Pages/Components/TableAddBusinessProduct.vue'
import { getBranchList, getTypePersonnelList } from '@/api/HumanResourceManagement'
import {
  getFeaturesDepositFee,
  getFeaturesPawnFee,
  getFeaturesPrices,
  getFeaturesRentalPrice,
  getSpaLPrice,
  getInventoryTrading
} from '@/api/LibraryAndSetting'
import TableType03 from '@/views/Pages/Components/TableBase/src/TableType03.vue'
import { useIcon } from '@/hooks/web/useIcon'
import { ElCollapse, ElCollapseItem, ElButton, ElSwitch } from 'element-plus'
import { RendererElement, RendererNode, VNode } from 'vue'
import { h } from 'vue'
const tableBase03 = ref<ComponentRef<typeof TableType03>>()

const seeDetail = (...param) => {
  const array = Array.isArray(unref(tableBase03)?.tableObject.tableList)
    ? unref(tableBase03)?.tableObject.tableList
    : []
  if (array && array.length > 0) {
    array.forEach((el) => {
      if (el.id === param[0].id) el['approveOrNot'] = !param[2]
    })
  }
}
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const { t } = useI18n()
const columnProfileProduct = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('router.productCategoryProducts'),
    component: 'Divider'
  },
  {
    field: 'field2',
    label: t('reuse.selectCategory'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      placeholder: 'Chọn danh mục cấp 1',
      style: 'width: 400px',
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'field',
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      style: 'width: 400px',
      placeholder: 'Chọn danh mục cấp 2',
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'field3',
    label: t('router.productCategoryBrand'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      placeholder: 'Chọn thương hiệu cấp 1',
      style: 'width: 400px',
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'field',
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      style: 'width: 400px',
      placeholder: 'Chọn thương hiệu cấp 2',
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'field3',
    label: t('router.productCategoryOrigin'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      placeholder: 'Chọn xuất xứ cấp 1',
      style: 'width: 400px',
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'field4',
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      style: 'width: 400px',
      placeholder: 'Chọn xuất xứ cấp 2',
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'field41',
    label: t('reuse.generalProductInformation'),
    component: 'Divider'
  },
  {
    field: 'field5',
    label: t('reuse.productCode'),
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập mã sản phẩm'
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'field6',
    label: t('reuse.productName'),
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập tên sản phẩm'
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'field7',
    label: t('reuse.shortDescription'),
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập mô tả'
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'field8',
    label: t('reuse.inspectionInformation'),
    component: 'Input',
    componentProps: {
      placeholder: 'Thêm Link ...'
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'field42',
    label: t('reuse.descriptionParameters'),
    component: 'Divider'
  },
  {
    field: 'field5',
    label: t('reuse.parameter') + ' 1',
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập tên thông số'
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'field6',
    label: ' ',
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập nội dung thông số'
    },
    colProps: {
      span: 14
    }
  },
  {
    field: 'field5',
    label: t('reuse.parameter') + ' 2',
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập tên thông số'
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'field6',
    label: ' ',
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập nội dung thông số'
    },
    colProps: {
      span: 14
    }
  },
  {
    field: 'field5',
    label: t('reuse.parameter') + ' 3',
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập tên thông số'
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'field6',
    label: ' ',
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập nội dung thông số'
    },
    colProps: {
      span: 14
    }
  },
  {
    field: 'field5',
    label: t('reuse.parameter') + ' 4',
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập tên thông số'
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'field6',
    label: ' ',
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập nội dung thông số'
    },
    colProps: {
      span: 14
    }
  },
  {
    field: 'field5',
    label: t('reuse.parameter') + ' 5',
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập tên thông số'
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'field6',
    label: ' ',
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập nội dung thông số'
    },
    colProps: {
      span: 14
    }
  },
  {
    field: 'field43',
    label: t('reuse.descriptions'),
    component: 'Editor',
    componentProps: {
      placeholder: 'Hello'
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'field41',
    label: t('reuse.statusAndFunction'),
    component: 'Divider'
  },
  {
    field: 'field47',
    label: t('reuse.setInventoryForSale'),
    component: 'Checkbox',
    value: [],
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: t('reuse.stocking'),
          value: '1'
        },
        {
          label: t('reuse.orders'),
          value: '2'
        },
        {
          label: t('reuse.outOfStock'),
          value: '3'
        },
        {
          label: t('reuse.displayed'),
          value: '4'
        }
      ]
    }
  },
  {
    field: 'field46',
    label: t('reuse.setInventoryForRent'),
    component: 'Checkbox',
    value: [],
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: t('reuse.stocking'),
          value: '1'
        },
        {
          label: t('reuse.orders'),
          value: '2'
        },
        {
          label: t('reuse.outOfStock'),
          value: '3'
        },
        {
          label: t('reuse.displayed'),
          value: '4'
        }
      ]
    }
  },
  {
    field: 'field45',
    label: t('reuse.productStatus'),
    component: 'Checkbox',
    value: [],
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: t('reuse.pending'),
          value: '1'
        },
        {
          label: t('reuse.active'),
          value: '2'
        },
        {
          label: t('reuse.pauseOperation'),
          value: '3'
        }
      ]
    }
  }
])
const columnManagementSeo = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('reuse.informationSeo'),
    component: 'Divider'
  },
  {
    field: 'field5',
    label: t('reuse.title'),
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập vị trí hiển thị'
    },
    colProps: {
      span: 16
    }
  },
  {
    field: 'field5',
    label: t('reuse.path'),
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập đường dẫn'
    },
    colProps: {
      span: 16
    }
  },
  {
    field: 'field2',
    label: 'Tag',
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      placeholder: 'Tag',
      style: 'width: 400px',
      options: [
        {
          label: 'Túi hàng hiệu',
          value: '1'
        },
        {
          label: 'LV',
          value: '2'
        }
      ]
    },
    colProps: {
      span: 16
    }
  },
  {
    field: 'field43',
    label: t('reuse.descriptions'),
    component: 'Editor',
    componentProps: {
      placeholder: 'Hello'
    },
    colProps: {
      span: 24
    }
  }
])
const featuresPrice = reactive<TableColumn[]>([
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'featureGroup',
    label: t('reuse.featureGroup'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'quantityTo',
    label: t('reuse.quantityTo'),
    minWidth: '200'
  },
  {
    field: 'productCategoryUnit',
    label: t('router.productCategoryUnit'),
    minWidth: '200'
  },
  {
    field: 'unitPrices',
    label: t('reuse.unitPrices'),
    minWidth: '200'
  },
  {
    field: 'promotionPrice',
    label: t('reuse.promotionPrice'),
    minWidth: '200'
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '200'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150'
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '100',
    fixed: false,
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) => {
      return h(ElSwitch, {
        style: { margin: 'auto' },
        modelValue: record.approveOrNot,
        onClick: () => seeDetail(record, column, cellValue)
      })
    }
  }
])
const featuresRentalPrice = reactive<TableColumn[]>([
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'featureGroup',
    label: t('reuse.featureGroup'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'quantityTo',
    label: t('reuse.quantityTo'),
    minWidth: '200'
  },
  {
    field: 'productCategoryUnit',
    label: t('router.productCategoryUnit'),
    minWidth: '200'
  },
  {
    field: 'dayRentalUnitPrice',
    label: t('reuse.dayRentalUnitPrice'),
    minWidth: '200'
  },
  {
    field: 'weeklyRent',
    label: t('reuse.weeklyRent'),
    minWidth: '200'
  },
  {
    field: 'monthlyRent',
    label: t('reuse.monthlyRent'),
    minWidth: '200'
  },
  {
    field: 'rentDeposit',
    label: t('reuse.rentDeposit'),
    minWidth: '200'
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '200'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150'
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '100',
    fixed: false,
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) => {
      return h(ElSwitch, {
        style: { margin: 'auto' },
        modelValue: record.approveOrNot,
        onClick: () => seeDetail(record, column, cellValue)
      })
    }
  }
])
const featuresDepositFee = reactive<TableColumn[]>([
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'featureGroup',
    label: t('reuse.featureGroup'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'quantityTo',
    label: t('reuse.quantityTo'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'productCategoryUnit',
    label: t('router.productCategoryUnit'),
    minWidth: '200'
  },
  {
    field: 'depositFee',
    label: t('reuse.depositFee'),
    minWidth: '200'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150'
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '100',
    fixed: false,
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) => {
      return h(ElSwitch, {
        style: { margin: 'auto' },
        modelValue: record.approveOrNot,
        onClick: () => seeDetail(record, column, cellValue)
      })
    }
  }
])
const featuresPawnFee = reactive<TableColumn[]>([
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'featureGroup',
    label: t('reuse.featureGroup'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'quantityTo',
    label: t('reuse.quantityTo'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'productCategoryUnit',
    label: t('router.productCategoryUnit'),
    minWidth: '200'
  },
  {
    field: 'interest',
    label: t('reuse.interest'),
    minWidth: '200'
  },
  {
    field: 'InsuranceMoney',
    label: t('reuse.InsuranceMoney'),
    minWidth: '200'
  },
  {
    field: 'intoMoney',
    label: t('reuse.intoMoney'),
    minWidth: '200'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150'
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '100',
    fixed: false,
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) => {
      return h(ElSwitch, {
        style: { margin: 'auto' },
        modelValue: record.approveOrNot,
        onClick: () => seeDetail(record, column, cellValue)
      })
    }
  }
])
const spaPrice = reactive<TableColumn[]>([
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'serviceOrGroupService',
    label: t('reuse.serviceOrGroupService'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'spaTime',
    label: t('reuse.spaTime'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'numberUses',
    label: t('reuse.numberUses'),
    minWidth: '200'
  },
  {
    field: 'spaPrice',
    label: t('router.spaPrice'),
    minWidth: '200'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150'
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '100',
    fixed: false,
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) => {
      return h(ElSwitch, {
        style: { margin: 'auto' },
        modelValue: record.approveOrNot,
        onClick: () => seeDetail(record, column, cellValue)
      })
    }
  }
])
const inventoryTrading = [
  { field: '', width: '50' },
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '100'
  },
  {
    field: 'featureGroup',
    label: t('reuse.featureGroup'),
    minWidth: '150'
  },
  {
    field: 'businessSynthesis',
    label: t('reuse.businessSynthesis'),
    children: [
      {
        field: 'numberOfTimesRented',
        label: t('reuse.quantitySold'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'numberOfTimesRented',
        label: t('reuse.numberOfTimesRented'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'numberOfTimesDeposited',
        label: t('reuse.numberOfTimesDeposited'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'numberOfTimesPawn',
        label: t('reuse.numberOfTimesPawn'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'numberOfTimesSpa',
        label: t('reuse.numberOfTimesSpa'),
        minWidth: '100',
        align: 'right'
      }
    ]
  },
  {
    field: 'inventoryConsolidation',
    label: t('reuse.inventoryConsolidation'),
    children: [
      {
        field: 'internalInventory',
        label: t('reuse.internalInventory'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'consignmentInventory',
        label: t('reuse.consignmentInventory'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'pawnInventory',
        label: t('reuse.pawnInventory'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'spaInventory',
        label: t('reuse.spaInventory'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'currentlyLeased',
        label: t('reuse.currentlyLeased'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'total',
        label: t('reuse.total'),
        minWidth: '100',
        align: 'right'
      }
    ]
  },
  {
    field: 'productCategoryUnit',
    label: t('reuse.dram'),
    minWidth: '150'
  }
]
interface Collapse {
  icon: VNode<RendererNode, RendererElement, { [key: string]: any }>
  name: string
  title: string
  columns: TableColumn[]
  api: <T = any>(option: any) => Promise<IResponse<T>>
  buttonAdd: string
  buttons: number
}
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'information',
    title: 'Thông tin sản phẩm',
    columns: columnProfileProduct,
    api: getBranchList,
    buttonAdd: '',
    buttons: 1
  },
  {
    icon: plusIcon,
    name: 'priceCharacteristics',
    title: 'Bảng đặc tính và giá bán',
    columns: featuresPrice,
    api: getFeaturesPrices,
    buttonAdd: 'Thêm đặc tính và giá bán',
    buttons: 2
  },
  {
    icon: plusIcon,
    name: 'rentalPriceCharacteristics ',
    title: 'Bảng đặc tính và giá cho thuê',
    columns: featuresRentalPrice,
    api: getFeaturesRentalPrice,
    buttonAdd: 'Thêm đặc tính và giá cho thuê',
    buttons: 2
  },
  {
    icon: plusIcon,
    name: 'depositFee',
    title: 'Bảng đặc tính và phí kí gửi',
    columns: featuresDepositFee,
    api: getFeaturesDepositFee,
    buttonAdd: 'Thêm đặc tính và phí kí gửi',
    buttons: 2
  },
  {
    icon: plusIcon,
    name: 'pawnFee',
    title: 'Bảng đặc tính và phí cầm đồ',
    columns: featuresPawnFee,
    api: getFeaturesPawnFee,
    buttonAdd: 'Thêm đặc tính và phí cầm đồ',
    buttons: 2
  },
  {
    icon: plusIcon,
    name: 'SpaPrice',
    title: 'Bảng giá dịch vụ spa',
    columns: spaPrice,
    api: getSpaLPrice,
    buttonAdd: 'Thêm dịch vụ và phí spa',
    buttons: 2
  },
  {
    icon: plusIcon,
    name: 'inventoryTrading',
    title: 'Tổng hợp tồn kho & kinh doanh',
    columns: inventoryTrading,
    api: getInventoryTrading,
    buttonAdd: 'Thêm đặc tính',
    buttons: 2
  },
  {
    icon: plusIcon,
    name: 'managementSeo',
    title: 'Quản lý SEO',
    columns: columnManagementSeo,
    api: getTypePersonnelList,
    buttonAdd: '',
    buttons: 3
  }
]
let currentCollapse = ref<string>(collapse[0].name)
const collapseChangeEvent = (val) => {
  if (val) {
    collapse.forEach((el) => {
      if (val.includes(el.name)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
}
const activeName = ref('information')
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
        <TableAddBusinessProduct
          :schema="item.columns"
          :title="item.title"
          :buttons="item.buttons"
          :backButton="false"
          :titleButtons="item.buttonAdd"
          :api="item.api"
          :key="index"
          :columns="item.columns"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
.header-icon {
  margin: 10px;
}
.text-center {
  font-size: 20px;
}
</style>
