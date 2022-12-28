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
    value: 4,
    key: 5,
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

export const STATUS_ORDER_PURCHASE = [
  {
    orderStatus: 0,
    orderStatusName: 'Hủy đơn hàng',
    createdAt: ''
  },
  {
    orderStatus: 61,
    orderStatusName: 'Duyệt đơn mua hàng',
    createdAt: ''
  },
  {
    orderStatus: 2,
    orderStatusName: 'Chốt đơn hàng',
    createdAt: ''
  },
  {
    orderStatus: 63,
    orderStatusName: 'Đặt hàng thành công',
    createdAt: ''
  },
  {
    orderStatus: 64,
    orderStatusName: 'Mua hàng thành công',
    createdAt: ''
  },
  {
    orderStatus: 5,
    orderStatusName: 'Đối soát & kết thúc',
    createdAt: ''
  },
  {
    orderStatus: 6,
    orderStatusName: 'Duyệt đổi/trả hàng',
    createdAt: ''
  },
  {
    orderStatus: 7,
    orderStatusName: 'Hoàn thành đổi/trả hàng',
    createdAt: ''
  },
  {
    orderStatus: 8,
    orderStatusName: 'Duyệt hủy đơn hàng',
    createdAt: ''
  }
]
