import {ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const getFilterList = async (getListFunc, errorMessage) => {
    const res = await getListFunc()
    if (res) {
      return res.data.map((item) => ({ text: item.name, value: item.id }))
    } else {
      ElMessage({
        message: t(errorMessage),
        type: 'error'
      })
      return
    }
}

export const getBadgeAccount1List = async (getListFunc, errorMessage) => {
  const res = await getListFunc()
  if (res) {
    return res.data.map((item) => ({ label: item.accountNumber, value: item.accountNumber, id: item.id}))
  } else {
    ElMessage({
      message: t(errorMessage),
      type: 'error'
    })
    return
  }
}