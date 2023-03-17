import { useI18n } from '@/hooks/web/useI18n'
import moment from 'moment'
const { t } = useI18n()

type Callback = (error?: string | Error | undefined) => void

export const useValidator = () => {
  const required = (message?: string) => {
    return {
      required: true,
      message: message || t('common.required'),
      trigger: 'blur'
    }
  }

  const requiredOption = (message?: string) => {
    return {
      required: true,
      message: message || t('common.required'),
      trigger: 'change'
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
    if (val) {
      if (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/gi.test(val)) {
        callback(new Error(t('reuse.notSpecialCharacters')))
      } else if (
        /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi.test(
          val
        )
      ) {
        callback(new Error(t('reuse.checkEmoji')))
      } else {
        callback()
      }
    }
  }
  const checkCode = (_, val: any, callback: Callback) => {
    // The password cannot be a special character
    if (!/^[a-zA-Z0-9]*$/.test(val)) {
      callback(new Error(t('reuse.CheckCode')))
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

  const checkNumber = (_, val: any, callback: Callback) => {
    if(isNaN(val)) {
      callback(new Error(t('reuse.numberFormat')))
    } else {
      callback()
    }
  }

  const checkLength = (config, minLength, maxLength) => {
    const [_, val, callback] = config
    if (minLength && val && val.length < minLength) {
      callback(new Error(`Nhập tối thiếu ${minLength} ký tự`))
    } else if (maxLength && val && val.length > maxLength) {
      callback(new Error(`Nhập tối đa ${maxLength} ký tự`))
    }
     else {
      callback()
    }
  }

  const checkDuplicate = (config, listToCheck, message) => {
    const [_, val, callback] = config
    console.log('listToCheck', listToCheck)
    const duplicateValue = listToCheck.find(item => val == item.value)
    if (val && duplicateValue) {
      callback(new Error(message))
    } else {
      callback()
    }
  }

  const doNotHaveNumber = (_, val: any, callback: Callback) => {
     if (/^[^0-9]+$/.test(val) || val.length == 0) {
      callback()
    } else {
      callback(new Error(t('reuse.doNotHaveNumber')))
    }
  }

  const ValidService = {
    checkEmojiValidator: {
      validator: (_rule: any, value: any, callback: any) => {
        if (
          /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi.test(
            value
          )
        ) {
          callback(new Error(t('reuse.checkEmoji')))
        } else {
          callback()
        }
      },
      required: true,
      trigger: 'blur'
    },
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
    checkLink: {
      pattern: /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/,
      message: t('reuse.linkFormat'),
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
    checkEmoji: {
      pattern:
        /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g,
      message: t('reuse.checkEmoji'),
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
    checkCode: {
      pattern: /^[a-zA-Z0-9]*$/,
      message: t('reuse.codeFormat'),
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
      required: false,
      trigger: 'blur'
    },
    checkSpace: {
      validator: (_rule: any, value: any, callback: any) => {
        if (/^\s+$/.test(value)) {
          callback(new Error(t('reuse.notSpaceAfter')))
        }
        callback()
      },
      required: false,
      trigger: 'blur'
    },
    checkDecimal: {
      validator: (_rule: any, value: any, callback: any) => {
        if (!/^[0-9]+$/.test(value)) {
          if (value != null) {
            callback(new Error(t('reuse.checkDecimal')))
          }
        }
        callback()
      },
      required: false,
      trigger: 'blur'
    },
    checkNameLength: {
      type: 'string',
      validator: (_rule: any, value: any, callback: any) => {
        if (value && value.length > 256) {
          callback(new Error(t('reuse.checkNameLength')))
        }
        callback()
      },
      required: true,
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
    checkPercent: {
      type: 'number',
      validator: (_rule: any, value: any, callback: any) => {
        if (value && value.length > 3) {
          callback(new Error(t('reuse.checkNameLength')))
        }
        callback()
      },
      required: false,
      trigger: 'change'
    },
    checkDescriptionLength: {
      type: 'string',
      validator: (_rule: any, value: any, callback: any) => {
        if (value) {
          if (value.length > 507) {
            callback(new Error(t('reuse.checkDescriptionLength')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      required: false,
      trigger: 'change'
    },
    checkNameServiceLength: {
      type: 'string',
      validator: (_rule: any, value: any, callback: any) => {
        if (value.length >= 255) {
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
      validator: (_rule, value, callback) => {
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
    maxPercent: {
      validator: (_rule, value, callback) => {
        if (value === '') callback(new Error(t('reuse.required')))
        else if (/\s/g.test(value)) callback(new Error(t('reuse.notSpace')))
        else if (isNaN(value)) callback(new Error(t('reuse.numberFormat')))
        else if (value < 0) callback(new Error(t('reuse.positiveNumber')))
        else if (value % 1 !== 0) callback(new Error(t('reuse.integerNumber')))
        else if (value > 100) callback(new Error(t('reuse.maxPercent')))
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
    },
    checkStringSpace: {
      validator: (_rule, value, callback) => {
        if (value.toString().trim() === '') {
          callback(new Error(t('reuse.required')))
        } else {
          callback()
        }
      },
      trigger: 'change'
    },
    checkSpaceBeforeAndAfter: {
      validator: (_rule, value, callback) => {
        if (value) {
          if (value.indexOf(' ') == 0 || value.slice(-1) == ' ') {
            callback(new Error(t('reuse.notSpaceBeforeAndAfter')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      trigger: 'change'
    },
    //check CCCD, CMT
    /**/
    checkCCCD: {
      pattern: /^([0-9]{9}|[0-9]{12})+$/,
      message: t('reuse.cccdFormat'),
      trigger: 'blur'
    }
  }

  const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
    str = str.replace(/Đ/g, 'D')
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // ̀ ́ ̃ ̉ ̣
    str = str.replace(/\u02C6|\u0306|\u031B/g, '') // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    str = str.trim()
    return str
  }

    const requiredCategory = (_, val: any, callback: Callback) => {
      if (val.length < 5) {
        callback(new Error(t('reuse.notFillAllInformation')))
      } else {
        callback()
      }
    }
  return {
    required,
    requiredOption,
    notSpace,
    notSpecialCharacters,
    isEqual,
    checkCode,
    ValidService,
    removeVietnameseTones,
    requiredCategory,
    doNotHaveNumber,
    checkNumber,
    checkLength,
    checkDuplicate
  }
}
