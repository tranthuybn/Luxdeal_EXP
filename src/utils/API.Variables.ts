import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

export const ORDER_STYTE = [
  {
    value: 1,
    key: 'Bán',
    lable: ''
  },
  {
    value: 2,
    key: 'Kygui',
    lable: 'Đơn hàng Ký Gửi'
  },
  {
    value: 3,
    key: 'Chothue',
    lable: 'Cho thuê'
  },
  {
    value: 4,
    key: 'Thechap',
    lable: 'Thế chấp'
  },
  {
    value: 5,
    key: 'Spa',
    lable: 'Đơn hàng Span'
  },
  {
    value: 6,
    key: 'Mua',
    lable: 'Đơn hàng mua'
  },
]

export const PRODUCTS_AND_SERVICES = [
  {
    value: 0,
    key: 'danhmuc',
    label: 'Tất cả'
  },
  {
    value: 1,
    key: 'mausac',
    label: 'Màu sắc'
  },
  {
    value: 2,
    key: 'kichco',
    label: 'Kích cỡ'
  },
  {
    value: 3,
    key: 'chatlieu',
    label: 'Chất liệu'
  },
  {
    value: 4,
    key: 'tinhtrang',
    label: 'Tình trạng'
  },
  {
    value: 5,
    key: 'gioitinh',
    label: 'Giới tính'
  },
  {
    value: 6,
    key: 'donvitinh',
    label: 'Đơn vị tính'
  },
  {
    value: 7,
    key: 'thuonghieu',
    label: 'Thương hiệu'
  },
  {
    value: 8,
    key: 'xuatxu',
    label: 'Xuất xứ'
  }
]
export const PAYMENT = [
  {
    value: false,
    key: 'Thu',
    label: 'Thu'
  },
  {
    value: true,
    key: 'Chi',
    label: 'Chi'
  }
]
export const ATTACH_DOCUMENT = [
  {
    value: 0,
    key: 'Không có tài liệu đính kèm',
    label: 'Không có tài liệu đính kèm'
  },
  {
    value: 1,
    key: 'Có tài liệu đính kèm',
    label: 'Có tài liệu đính kèm'
  }
]
export const PEOPLE_TYPE = [
  {
    value: 1,
    key: 0,
    label: 'Khách hàng'
  },
  {
    value: 2,
    key: 1,
    label: 'Cộng tác viên'
  },
  {
    value: 3,
    key: 2,
    label: 'Nhân viên'
  }
]

export const CUSTOMER_TYPE = [
  {
    value: 1,
    key: 0,
    label: 'Khách hàng'
  },
  {
    value: 2,
    key: 1,
    label: 'Nhà cung cấp'
  },
  {
    value: 3,
    key: 2,
    label: 'Chung'
  }
]

export const STATUS_TYPE = [
  {
    value: 0,
    key: 'Đã hủy',
    label: 'Đã hủy'
  },
  {
    value: 1,
    key: 'Đang đề nghị',
    label: 'Đang đề nghị'
  },
  {
    value: 2,
    key: 'Đang duyệt',
    label: 'Đang duyệt'
  }
]
export const PROMOTION_STRATEGY = [
  {
    value: 0,
    key: 1,
    label: 'Flash sale'
  },
  {
    value: 1,
    key: 2,
    label: 'Bộ sưu tập'
  },
  {
    value: 2,
    key: 3,
    label: 'Hàng mới về'
  },
  {
    value: 3,
    key: 4,
    label: 'Voucher'
  },
  {
    value: 4,
    key: 5,
    label: 'Combo'
  },
  {
    value: 5,
    key: 6,
    label: 'Đấu giá'
  }
]

export const typeOfPeople = {
  1: 'Khách hàng',
  2: 'Cộng tác viên',
  3: 'Nhân viên'
}

export const API_ORDER = [
  {
    value: 0,
    key: 1,
    label: 'orderSell'
  },
  {
    value: 1,
    key: 3,
    label: 'orderRental'
  },
  {
    value: 2,
    key: 2,
    label: 'orderDeposit'
  },
  {
    value: 3,
    key: 4,
    label: 'orderPawn'
  },
  {
    value: 4,
    key: 5,
    label: 'orderSpa'
  },
  {
    value: 5,
    key: 6,
    label: 'orderMua'
  }
]

export const STATUS = [
  {
    value: false,
    key: 1,
    label: 'Không hoạt động'
  },
  {
    value: true,
    key: 1,
    label: 'Đang hoạt động'
  }
]

export const ORDER_STATUS = [
  {
    value: -1,
    label: 'Giao hàng thất bại'
  },
  {
    value: 0,
    label: 'Chờ giao hàng'
  },
  {
    value: 2,
    label: 'Đang giao hàng'
  },
  {
    value: 3,
    label: 'Giao hàng thành công'
  },
  {
    value: 4,
    label: 'Đã nhận hàng'
  }
]

export const STATUS_ORDER_PURCHASE = [
  {
    orderStatus: -1,
    orderStatusName: t('formDemo.cancelOrder'),
    createdAt: '',
    approvedAt: ''
  },
  {
    orderStatus: 61,
    orderStatusName: t('formDemo.approvalPurchaseOrder'),
    createdAt: '',
    approvedAt: ''
  },
  {
    orderStatus: 2,
    orderStatusName: t('formDemo.closingOrder'),
    createdAt: '',
    approvedAt: ''
  },
  {
    orderStatus: 63,
    orderStatusName: t('formDemo.successOrder'),
    createdAt: '',
    approvedAt: ''
  },
  {
    orderStatus: 64,
    orderStatusName: t('formDemo.successfullPurchaseOrder'),
    createdAt: '',
    approvedAt: ''
  },
  {
    orderStatus: 3,
    orderStatusName: t('formDemo.checkAndFinishOrder'),
    createdAt: '',
    approvedAt: ''
  },
  {
    orderStatus: 65,
    orderStatusName: t('formDemo.aprrovalExchangeReturn'),
    createdAt: '',
    approvedAt: ''
  },
  {
    orderStatus: 66,
    orderStatusName: t('formDemo.completeExchangeReturnOrder'),
    createdAt: '',
    approvedAt: ''
  },
  {
    orderStatus: 0,
    orderStatusName: t('formDemo.approvalCancelOrder'),
    createdAt: '',
    approvedAt: ''
  },
  {
    orderStatus: -2,
    orderStatusName: 'Tạo mới',
    createdAt: '',
    approvedAt: ''
  }
]

export const STATUS_ORDER_DEPOSIT = [
  //0
  {
    orderStatus: -1,
    orderStatusName: 'Hủy đơn hàng',
    createdAt: ''
  },
  //1
  {
    orderStatus: 2,
    orderStatusName: 'Chốt đơn hàng',
    createdAt: ''
  },
  //2
  {
    orderStatus: 3,
    orderStatusName: 'Đối soát & kết thúc',
    createdAt: ''
  },
  //3
  {
    orderStatus: 0,
    orderStatusName: 'Duyệt hủy đơn hàng',
    createdAt: ''
  },
  //4
  {
    orderStatus: 21,
    orderStatusName: 'Bắt đầu ký gửi',
    createdAt: ''
  },
  //5
  {
    orderStatus: 22,
    orderStatusName: 'Duyệt trả hàng trước hạn',
    createdAt: ''
  },
  //6
  {
    orderStatus: 23,
    orderStatusName: 'Hết hạn ký gửi',
    createdAt: ''
  },
  //7
  {
    orderStatus: 24,
    orderStatusName: 'Trả hàng hết hạn',
    createdAt: ''
  },
  //8
  {
    orderStatus: 25,
    orderStatusName: 'Bắt đầu gia ký gửi',
    createdAt: ''
  },
  //9
  {
    orderStatus: 26,
    orderStatusName: 'Kết thúc gia ký gửi',
    createdAt: ''
  },
  //10
  {
    orderStatus: 4,
    orderStatusName: 'Duyệt đơn hàng',
    createdAt: ''
  },
  //11
  {
    orderStatus: 27,
    orderStatusName: 'Hoàn thành trả hàng',
    createdAt: ''
  },
  //12
  {
    orderStatus: 28,
    orderStatusName: 'Trả toàn bộ',
    createdAt: ''
  },
  //13
  {
    orderStatus: 29,
    orderStatusName: 'Trả một phần',
    createdAt: ''
  },
]

export const STATUS_ORDER_PAWN = [
  //0
  {
    orderStatus: -1,
    orderStatusName: 'Hủy đơn hàng',
    createdAt: ''
  },
  {
    orderStatus: 2,
    orderStatusName: 'Chốt đơn hàng',
    createdAt: ''
  },
  {
    orderStatus: 3,
    orderStatusName: 'Đối soát & kết thúc',
    createdAt: ''
  },
  {
    orderStatus: 4,
    orderStatusName: 'Duyệt đơn hàng',
    createdAt: ''
  },
  {
    orderStatus: 0,
    orderStatusName: 'Duyệt hủy đơn hàng',
    createdAt: ''
  },
  {
    orderStatus: 41,
    orderStatusName: 'Bắt đầu cầm đồ',
    createdAt: ''
  },
  {
    orderStatus: 42,
    orderStatusName: 'Duyệt trả hàng trước hạn',
    createdAt: ''
  },
  {
    orderStatus: 43,
    orderStatusName: 'Hết hạn cầm đồ',
    createdAt: ''
  },
  {
    orderStatus: 44,
    orderStatusName: 'Duyệt chuộc hàng hết hạn',
    createdAt: ''
  },
  {
    orderStatus: 45,
    orderStatusName: 'Duyệt đứt hàng hết hạn',
    createdAt: ''
  },
  {
    orderStatus: 46,
    orderStatusName: 'Bắt đầu gia hạn cầm đồ',
    createdAt: ''
  },
  {
    orderStatus: 47,
    orderStatusName: 'Kết thúc gia hạn cầm đồ',
    createdAt: ''
  }
]

export const STATUS_ORDER_SPA = [
  //0
  {
    orderStatus: -1,
    orderStatusName: 'Hủy đơn hàng',
    createdAt: ''
  },
  {//1
    orderStatus: 2,
    orderStatusName: 'Chốt đơn hàng',
    createdAt: ''
  },
  {//2
    orderStatus: 3,
    orderStatusName: 'Đối soát & kết thúc',
    createdAt: ''
  },
  {//3
    orderStatus: 4,
    orderStatusName: 'Duyệt đơn hàng',
    createdAt: ''
  },
  {//4
    orderStatus: 0,
    orderStatusName: 'Duyệt hủy đơn hàng',
    createdAt: ''
  },
  {//5
    orderStatus: 51,
    orderStatusName: 'Bắt đầu quá trình spa',
    createdAt: ''
  },
  {//6
    orderStatus: 52,
    orderStatusName: 'Trả hàng spa',
    createdAt: ''
  },
  {//7
    orderStatus: 53,
    orderStatusName: 'Hết hạn spa',
    createdAt: ''
  },
  {//8
    orderStatus: 54,
    orderStatusName: 'Duyệt thay đổi dịch vụ spa',
    createdAt: ''
  },
  {//9
    orderStatus: 1,
    orderStatusName: 'Duyệt giá thay đổi',
    createdAt: ''
  },
  {//10
    orderStatus: 55,
    orderStatusName: 'Duyệt trả hàng không spa',
    createdAt: ''
  },
  {//11
    orderStatus: 56,
    orderStatusName: 'Trả hàng đã spa',
    createdAt: ''
  },
  {//12
    orderStatus: 57,
    orderStatusName: 'Trả toàn bộ',
    createdAt: ''
  },
  {//13
    orderStatus: 58,
    orderStatusName: 'Trả một phần',
    createdAt: ''
  }
]

export const STATUS_ORDER_SELL = [
  {
    orderStatus: -1,
    orderStatusName: 'Hủy đơn hàng',
    createdAt: ''
  },
  {
    orderStatus: 1,
    orderStatusName: 'Duyệt giá thay đổi',
    createdAt: ''
  },
  {
    orderStatus: 2,
    orderStatusName: 'Chốt đơn hàng',
    createdAt: ''
  },
  {
    orderStatus: 13,
    orderStatusName: 'Hoàn thành đơn hàng',
    createdAt: ''
  },
  {
    orderStatus: 3,
    orderStatusName: 'Đối soát & kết thúc',
    createdAt: ''
  },
  {
    orderStatus: 14,
    orderStatusName: 'Duyệt đổi/trả hàng',
    createdAt: ''
  },
  {
    orderStatus: 0,
    orderStatusName: 'Duyệt hủy đơn hàng',
    createdAt: ''
  },
  {
    orderStatus: 15,
    orderStatusName: 'Hoàn thành đổi trả',
    createdAt: ''
  },
  {
    orderStatus: 5,
    orderStatusName: 'Đã đặt cọc',
    createdAt: ''
  }
]

export const STATUS_ORDER_RENTAL = [
  {
    orderStatus: -1,
    orderStatusName: 'Hủy đơn hàng',
    createdAt: ''
  },
  {
    orderStatus: 1,
    orderStatusName: 'Duyệt giá thay đổi',
    createdAt: ''
  },
  {
    orderStatus: 2,
    orderStatusName: 'Chốt đơn hàng',
    createdAt: ''
  },
  {
    orderStatus: 0,
    orderStatusName: 'Duyệt hủy đơn hàng',
    createdAt: ''
  },
  {
    orderStatus: 32,
    orderStatusName: 'Duyệt trả hàng trước hạn',
    createdAt: ''
  },
  {
    orderStatus: 31,
    orderStatusName: 'Bắt đầu thuê',
    createdAt: ''
  },
  {
    orderStatus: 33,
    orderStatusName: 'Hết hạn thuê',
    createdAt: ''
  },
  {
    orderStatus: 34,
    orderStatusName: 'Trả hàng hết hạn',
    createdAt: ''
  },
  {
    orderStatus: 35,
    orderStatusName: 'Bắt đầu gia hạn thuê',
    createdAt: ''
  },
  {
    orderStatus: 36,
    orderStatusName: 'Kết thúc gia hạn thuê',
    createdAt: ''
  },
  {
    orderStatus: 3,
    orderStatusName: 'Đối soát & kết thúc',
    createdAt: ''
  },
  {
    orderStatus: 37,
    orderStatusName: 'Hoàn thành trả hàng trước hạn',
    createdAt: ''
  }
]

export const CampaignType = {

  Flashsale: 1,

  BoSuuTap: 2,

  HangMoiVe: 3,

  Voucher: 4,

  Combo: 5,
  Auction: 6
}
export const CampaignTypeArr = [CampaignType.Flashsale, CampaignType.BoSuuTap, CampaignType.HangMoiVe, CampaignType.Voucher, CampaignType.Combo, CampaignType.Auction]
export const Approvement = {

  Product: 1,

  Order: 2,

  CustomerAccount: 3,

  CollaboratorAccount: 4,

  DeNghiThanhToan: 5,

  Campaign: 6,

  PhieuThuChi: 7,

  SpaService: 8
}
