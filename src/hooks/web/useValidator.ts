import { useI18n } from '@/hooks/web/useI18n'
import moment from 'moment'
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
    const { min, max } = options
    if (val.length < min || val.length > max) {
      callback(new Error(t('reuse.lengthRange')))
    } else {
      callback()
    }
  }

  const notSpace = (_, val: any, callback: Callback) => {
    // Username cannot have space
    if (val && val.toString().indexOf(' ') !== -1) {
      callback(new Error(t('reuse.notSpace')))
    } else {
      callback()
    }
  }
  const notSpecialCharacters = (_, val: any, callback: Callback) => {
    // The password cannot be a special character
    if (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/gi.test(val)) {
      callback(new Error(t('reuse.notSpecialCharacters')))
    } else {
      callback()
    }
  }

  // Whether the two string wants to wait
  const isEqual = (val1: string, val2: string, callback: Callback) => {
    if (val1 === val2) {
      callback()
    } else {
      callback(new Error(t('reuse.isNotEqual')))
    }
  }

  const ValidService = {
    checkPhone: {
      pattern: /((09|03|07|08|05)+([0-9]{8})\b)/g,
      message: t('reuse.phoneNumberFormat'),
      trigger: 'blur'
    },
    checkEmail: {
      pattern:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: t('reuse.emailFormat'),
      trigger: 'blur'
    },
    checkDateTime: {
      pattern:
        /^([1-9]|([012][0-9])|(3[01]))[/]([0]{0,1}[1-9]|1[012])[/]\d\d\d\d [012]{0,1}[0-9]:[0-6][0-9]$/g,
      message: t('reuse.dateTimeFormat'),
      trigger: 'blur'
    },
    checkDate: {
      pattern:
        /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g,
      message: t('reuse.dateFormat'),
      trigger: 'blur'
    },
    checkMonth: {
      pattern: /^\d{2}[/]\d{4}$/g,
      message: t('reuse.monthFormat'),
      trigger: 'blur'
    },
    checkYear: {
      pattern: /^\d{4}$/g,
      message: t('reuse.yearFormat'),
      trigger: 'blur'
    },
    checkNumber: {
      validator: (_rule: any, value: Number | string, callback: any) => {
        if (value === '') callback(new Error(t('reuse.required')))
        else if (typeof value !== 'number') callback(new Error(t('reuse.numberFormat')))
        callback()
      },
      required: true,
      trigger: 'blur'
    },
    checkPositiveNumber: {
      validator: (_rule: any, value: any, callback: any) => {
        if (isNaN(value)) callback(new Error(t('reuse.numberFormat')))
        else if (value < 0) callback(new Error(t('reuse.positiveNumber')))
        callback()
      },
      required: true,
      trigger: 'blur'
    },
    checkSpace: {
      validator: (_rule: any, value: any, callback: any) => {
        // if (value.match(/^\s+$/) === null) {
        //   callback(new Error(t('reuse.notSpaceAfter')))
        // }
        if (/^\s+$/.test(value)) {
          callback(new Error(t('reuse.notSpaceAfter')))
        }
        callback()
      },
      required: false,
      trigger: 'blur'
    },
    checkNameLength: {
      type: 'string',
      validator: (_rule: any, value: any, callback: any) => {
        if (value && value.length > 50) {
          callback(new Error(t('reuse.checkNameLength')))
        }
        callback()
      },
      required: false,
      trigger: 'change'
    },
    checkCodeServiceLength: {
      type: 'string',
      validator: (_rule: any, value: any, callback: any) => {
        if (value && value.length > 20) {
          callback(new Error(t('reuse.checkCodeServiceLength')))
        }
        callback()
      },
      required: false,
      trigger: 'change'
    },
    checkDescriptionLength: {
      type: 'string',
      validator: (_rule: any, value: any, callback: any) => {
        if (value.length > 500) {
          callback(new Error(t('reuse.checkDescriptionLength')))
        }
        callback()
      },
      required: false,
      trigger: 'change'
    },
    checkNameServiceLength: {
      type: 'string',
      validator: (_rule: any, value: any, callback: any) => {
        if (value.length > 255) {
          callback(new Error(t('reuse.checkNameServiceLength')))
        }
        callback()
      },
      required: true,
      trigger: 'change'
    },
    checkStartDateTime: {
      type: 'date',
      validator: (val, callback) => {
        const dateNow = new Date()
        if (!moment(val).isSameOrAfter(dateNow)) {
          callback(new Error(t('reuse.checkStartDateTime')))
        }
        callback()
      },
      required: true,
      trigger: 'change'
    },
    checkSpecialPhoneNumber: {
      validator: (value, callback) => {
        // eslint-disable-next-line no-useless-escape
        const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
        if (!regex.test(value)) {
          callback(new Error(t('reuse.notSpecialCharacters')))
        }
        callback()
      },
      required: true,
      trigger: 'blur'
    },
    checkMoney: {
      validator: (value, callback) => {
        if (value === '') callback(new Error(t('reuse.required')))
        else if (/\s/g.test(value)) callback(new Error(t('reuse.notSpace')))
        else if (isNaN(value)) callback(new Error(t('reuse.numberFormat')))
        else if (value < 0) callback(new Error(t('reuse.positiveNumber')))
        else if (value % 1 !== 0) callback(new Error(t('reuse.integerNumber')))
        callback()
      },
      required: true,
      trigger: 'blur'
    },
    checkOrderCode: {
      type: 'string',
      validator: (val, callback) => {
        if (val.length > 50) {
          callback(new Error(t('reuse.checkNameLength')))
        }
        callback()
      },
      required: true,
      trigger: 'change'
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
