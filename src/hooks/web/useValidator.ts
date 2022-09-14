import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

type Callback = (error?: string | Error | undefined) => void

interface LengthRange {
  min: number
  max: number
  message: string
}

export const useValidator = () => {
  const required = (message?: string) => {
    return {
      required: true,
      message: message || t('common.required')
    }
  }

  const lengthRange = (val: any, callback: Callback, options: LengthRange) => {
    const { min, max, message } = options
    if (val.length < min || val.length > max) {
      callback(new Error(message))
    } else {
      callback()
    }
  }

  const notSpace = (val: any, callback: Callback, message: string) => {
    // Username cannot have space
    if (val.indexOf(' ') !== -1) {
      callback(new Error(message))
    } else {
      callback()
    }
  }
  const notSpecialCharacters = (_, val: any, callback: Callback) => {
    // The password cannot be a special character
    if (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/gi.test(val)) {
      callback(new Error('Không nhập ký tự đặc biệt'))
    } else {
      callback()
    }
  }

  // Whether the two string wants to wait
  const isEqual = (val1: string, val2: string, callback: Callback, message: string) => {
    if (val1 === val2) {
      callback()
    } else {
      callback(new Error(message))
    }
  }

  const ValidService = {
    checkPhone: {
      pattern: /((09|03|07|08|05)+([0-9]{8})\b)/g,
      message: 'khong phai so dien thoai',
      trigger: 'blur'
    }
  }

  return {
    required,
    lengthRange,
    notSpace,
    notSpecialCharacters,
    isEqual,
    ValidService
  }
}
