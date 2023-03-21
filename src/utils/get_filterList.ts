import {ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const getFilterList = async (getListFunc, errorMessage, params = {}) => {
  const res = await getListFunc(params)
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

export const getBadgeAccountList = async (getListFunc, typeAccount, errorMessage) => {
  const res = await getListFunc()
  if (res) {
    if(typeAccount == '1') return res.data.map((item) => ({ label: item.accountNumber, value: item.accountNumber, id: item.id}))
    return res.data.map((item) => ({ label: item.children.accountNumber, value: item.children.accountNumber, id: item.children.id}))
  } else {
    ElMessage({
      message: t(errorMessage),
      type: 'error'
    })
    return
  }
}