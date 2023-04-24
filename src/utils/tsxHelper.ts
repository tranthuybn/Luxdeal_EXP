import { Slots, computed } from 'vue'
import { isFunction } from '@/utils/is'
import moment from 'moment';
import { usePermissionStore } from '@/store/modules/permission'
import { useCache } from '@/hooks/web/useCache'
import {
  UploadProps,
  ElMessage,
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const getSlot = (slots: Slots, slot = 'default', data?: Recordable) => {
  // Reflect.has determines whether an object exists in a certain attribute
  if (!slots || !Reflect.has(slots, slot)) {
    return null
  }
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`)
    return null
  }
  const slotFn = slots[slot]
  if (!slotFn) return null
  return slotFn(data)
}


export const filterHandler = (value,row,column) => {
  const property = column['property']
  return row[property] === value
}

export const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

export const formartDate = (date) => {
  if(date) return moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
  return ''
}

export const usePermission = (currentRoute) => {
  const { wsCache } = useCache()
  const permissionStore = usePermissionStore()
  permissionStore.checkRoleAndSetPermission(wsCache.get(permissionStore.routerByRoles), currentRoute )
  const userPermission = computed(()=>permissionStore.getUserPermission)
  return userPermission.value
}

export function printPage(id: string) {
  const prtHtml = document.getElementById(id)?.innerHTML
  let stylesHtml = ''
  for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
    stylesHtml += node.outerHTML
  }
  const WinPrint = window.open(
    '',
    '',
    'left=0,top=0,width=800px,height=1123px,toolbar=0,scrollbars=0,status=0'
  )
  WinPrint?.document.write(`<!DOCTYPE html>
                <html>
                  <head>
                    ${stylesHtml}
                  </head>
                  <body>
                    ${prtHtml}
                  </body>
                </html>`)

  WinPrint?.document.close()
  WinPrint?.focus()
  setTimeout(() => {
    WinPrint?.print()
    WinPrint?.close()
  }, 800)
}


export const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `${t('reuse.limitUploadImages')}. ${t('reuse.imagesYouChoose')}: ${files.length}. ${t(
      'reuse.total'
    )} ${files.length + uploadFiles.length}`
  )
}