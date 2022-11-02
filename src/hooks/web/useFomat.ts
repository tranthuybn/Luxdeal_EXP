export const formatPrice = (value) =>
  `${value}`
    .replace(/\s+/gm, '')
    .replace(/[a-zA-Z]/gm, '')
    .replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/gi, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    .replace(/\$\s?|(,*)/g, '')
    .replace(
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi,
      ''
    )
    .replace(
      /[aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz0123456789]/g,
      ''
    )
export const formatNumber = (value) =>
  value
    .replace(/\s+/gm, '')
    .replace(/[a-zA-Z]/gm, '')
    .replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/gi, '')
    .replace(
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi,
      ''
    )
    .replace(
      /[aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz0123456789]/g,
      ''
    )
