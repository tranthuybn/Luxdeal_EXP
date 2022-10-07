import { getAllCity, getAllDistrict, getAllStreet, getAllWard } from '@/api/Address'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
export const cityOptions = ref()
export const getCity = async () => {
  const res = await getAllCity()
  if (res) {
    cityOptions.value = res.data.map((city) => ({ label: city.name, value: city.id }))
    return cityOptions.value
  } else {
    ElMessage({
      message: t('reuse.cantGetData'),
      type: 'error'
    })
    return
  }
}

export const getDistrict = async (ID) => {
  const districtOptions = ref()
  const res = await getAllDistrict({ id: ID })
  if (res) {
    districtOptions.value = res.data.map((district) => ({
      label: district.name,
      value: district.id
    }))
    return districtOptions.value
  } else {
    ElMessage({
      message: t('reuse.cantGetData'),
      type: 'error'
    })
    return
  }
}
export const getWard = async (ID) => {
  const wardOptions = ref()
  const res = await getAllWard({ id: ID })
  if (res) {
    wardOptions.value = res.data.map((ward) => ({
      label: ward.name,
      value: ward.id
    }))
    return wardOptions.value
  } else {
    ElMessage({
      message: t('reuse.cantGetData'),
      type: 'error'
    })
    return
  }
}
export const getStreet = async (ID) => {
  const streetOptions = ref()
  const res = await getAllStreet({ id: ID })
  if (res) {
    streetOptions.value = res.data.map((street) => ({
      label: street.name,
      value: street.id
    }))
    return streetOptions.value
  } else {
    ElMessage({
      message: t('reuse.cantGetData'),
      type: 'error'
    })
    return
  }
}
