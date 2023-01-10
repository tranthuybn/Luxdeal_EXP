import { ERP_DOMAIN, ERP_DOMAIN_LOGIN } from '../../public/config'
export const API_URL = ERP_DOMAIN
export const LOGIN_API_URL = ERP_DOMAIN_LOGIN
export const PRODUCTS_AND_SERVICES_API = {
  GET_CATEGORY: '/api/v1/Category/GetCategory',
  ADD_CATEGORY: '/api/v1/Category/AddCategory',
  GET_CATEGORY_BY_ID: '/api/v1/Category/GetCategoryById',
  UPDATE_CATEGORY: '/api/v1/Category/updateCategory',
  HIDE_CATEGORY: '/api/v1/Category/HideCategory',
  DELETE_CATEGORY: '/api/v1/Categories/DeleteCategory',
  GET_PRODUCT: '/api/v1/Product/GetProduct',
  CHECK_PRODUCT: '/api/v1/Product/CheckProduct',
  GET_PRODUCTS: '/api/v1/Product/GetProductProperty',
  GET_SPA: '/api/v1/Spa/GetListOfSpaService',
  POST_SPA: '/api/v1/Spa/CreateANewSpaSevice',
  PUT_SPA: '/api/v1/Spa/UpdateSpaService',
  DELETE_SPA: '/api/v1/Spa/DeleteSpaService',
  DELETE_SPA_IMAGE: '/api/v1/Spa/DeleteSpaImage',
  GET_SPASERVICE: '/api/v1/Spa/GetSpaService',
  POST_PRODUCT: '/api/v1/Product/CreateProduct',
  UPDATE_PRODUCT: '/api/v1/Product/UpdateProductInfo',
  DELETE_PRODUCT: '/api/v1/Product/DeleteProduct',
  UPDATE_SEO_PRODUCT: '/api/v1/Product/UpdateProductSeo',
  GET_PRODUCT_PROPERTY: '/api/v1/Product/GetProductProperty',
  GET_COLLABORATOR: '/api/v1/Order/GetCollaborator',
  ADD_PRODUCT_PROPERTY: '/api/v1/Product/CreateProductProperty',
  UPDATE_PRODUCT_PROPERTY: '/api/v1/Product/UpdateProductProperty',
  DELETE_PRODUCT_PROPERTY: '/api/v1/Product/DeleteProductProperty',
  GET_PRICE_PRODUCT_PROPERTY: '/api/v1/Product/GetPrice',
  CHANGE_PRICE_PRODUCT_PROPERTY: '/api/v1/Product/ChangePrice',
  GET_TAGS: '/api/v1/Product/GetTag',
  GET_COLLABORATORS: '/api/v1/Customer/GetCollaborator',
  GET_PROMOTIONS: 'api/v1/Campaign/GetCampaignForOrder',
  GET_ALL_CUSTOMER: 'api/v1/Customer/GetCustomers',
  POST_SPA_ORDER: '/api/v1/Order/CreateOrder'
}
export const CUSTOMER_API = {
  GET_POTENTIAL_CUSTOMERS: '/api/v1/Customer/GetPotentialCustomers',
  GET_POTENTIAL_CUSTOMER_BY_ID: 'api/v1/Customer/getPotentialCustomerById',
  ADD_POTENTIAL_CUSTOMER: '/api/v1/Customer/addPotentialCustomers',
  ALL_CUSTOMER: '/api/v1/Customer/GetCustomers',
  UPDATE_POTENTIAL_CUSTOMER: '/api/v1/Customer/UpdatePotentialCustomers',
  UPDATE_POTENTIAL_CUSTOMER_HISTORY: '/api/v1/Customer/UpdatePotentialCustomerHistory',
  DELETE_POTENTIAL_CUSTOMER: '/api/v1/Customer/deletePotentialCustomers',
  DELETE_POTENTIAL_CUSTOMER_HISTORY: 'api/v1/Customer/deletePotentialCustomerHistory',
  DELETE_POTENTIAL_CUSTOMER_HISTORY_CHILD: 'api/v1/Customer/deletePotentialCustomerHistoryOfSale',
  GET_COLLABORATOR_API: 'api/v1/Customer/GetCollaborator',
  GET_COLLABORATOR_BY_ID: 'api/v1/Customer/getCollaboratorById',
  GET_GEN_CODE_COLLABORATOR: 'api/v1/Customer/genCodeCollaborator',
  POST_COLLABORATOR_API: 'api/v1/Customer/addCollaborator',
  PUT_COLLABORATOR_API: 'api/v1/Customer/UpdateCollaborator',
  GET_LIST_CUSTOMER: '/api/v1/Customer/GetCustomers',
  GET_CUSTOMER_RATINGS: '/api/v1/Customer/getCustomerRatings',
  ADD_CUSTOMER_RATINGS: '/api/v1/Customer/addCustomerRatings',
  GET_CUSTOMER_RANKING: '/api/v1/Customer/getCustomerRanking',
  UPDATE_CUSTOMER_RATINGS: '/api/v1/Customer/updateCustomerRatings',
  GET_CUSTOMER_RAINGS_BY_ID: '/api/v1/Customer/getCustomerRatingsById',
  DELETE_CUSTOMER_RATING: '/api/v1/Customer/DelteCustomerRatings',
  GET_PAYMENT_REQUEST_LIST_API: '/api/v1/Accountant/GetPaymentRequestList',
  GET_COMMISSION_PAYMENT_API: 'api/v1/Customer/getCommissionPayment',
  GET_COMMISSION_PAYMENT_BY_ID_API: 'api/v1/Customer/getCommissionPaymentById',
  GET_CUSTOMER_BY_ID: '/api/v1/Customer/GetCustomerById',
  ADD_CUSTOMER: '/api/v1/Customer/addCustomer',
  GET_GEN_CODE_CUSTOMER: '/api/v1/Customer/genCodeCustomer',
  POST_AUTH_REGISTER: '/api/auth/register'
}

export const CAMPAIGN_API = {
  GET_CAMPAIGN: '/api/v1/Campaign/GetCampaign',
  POST_CAMPAIGN: '/api/v1/Campaign/CreateCampaign',
  GET_CAMPAIGN_BY_ID: '/api/v1/Campaign/GetCampaign',
  UPDATE_CAMPAIGN: '/api/v1/Campaign/UpdateCampaign',
  DELETE_CAMPAIGN: '/api/v1/Campaign/DeleteCampaign'
}

export const ORDER_API = {
  GET_ORDER_LIST: '/api/v1/Order/GetOrder',
  ADD_NEW_ORDER: '/api/v1/Order/CreateOrder',
  UPDATE_ORDER_INFO: '/api/v1/Order/UpdateOrderInfo',
  UPDATE_ORDER_STATUS: '/api/v1/Order/UpdateOrderStatus',
  CANCEL_ORDER: '/api/v1/Order/CancelOrder',
  FINISH_ORDER: '/api/v1/Order/FinishOrder',
  CREATE_QUICK_PRODUCT: '/api/v1/Product/CreateQuickProductProperty',
  CHECK_PRODUCT: '/api/v1/Product/CheckProduct',
  GET_PRODUCT_ID: '/api/v1/Product/GetProduct',
  ADD_QUICK_CUSTOMER: '/api/v1/Customer/addCustomer',
  TOTAL_ORDER: '/api/v1/Order/CalculateOrder',
  ORDER_TRANSACTION: '/api/v1/Accountant/GetOrderStransaction',
  GET_SPA_BY_PRODUCT: '/api/v1/Order/GetProductPropertySpaService',
  ADD_NEW_RECEIPT_PAYMENTVOUCHER: '/api/v1/Accountant/CreateANewReceiptOrPaymentVoucher',
  UPDATE_ORDER_TRANSACTION: '/api/v1/Accountant/UpdateOrderTransaction',
  CREATE_RETURN_REQUEST: '/api/v1/Order/CreateReturnRequest',
  GET_RETURN_REQUEST: '/api/v1/Order/GetReturnRequest',
  GET_NEW_RECEIPT_PAYMENT_VOUCHER_CODE: '/api/v1/Accountant/GetNewReceiptOrPaymentVoucherCode',
  GET_DETAIL_RECEIPT_PAYMENT_VOUCHER_CODE: '/api/v1/Accountant/ReceiptOrPaymentVoucherDetail',
  GET_NEW_RECEIPT_PAYMENT_REQUEST_CODE: '/api/v1/Accountant/GetNewPaymentRequestCode',
  GET_RECEIPT_PAYMENT_REQUEST_DETAIL: '/api/v1/Accountant/GetPaymentRequestDetail',
  GET_NEW_RECEIPT_PAYMENT_REQUEST: '/api/v1/Accountant/CreateANewPaymentRequest',
  ADD_ORDER_STRANSACTION: '/api/v1/Accountant/AddAOrderStransaction',
  GET_ACCOUNTING_ENTRY_BY_ID: '/api/v1/Accountant/getDetailAccountingEntry',
  POST_AUTOMATIC_WAREHOUSE: '/api/v1/Warehouse/CreateTicketFromOrder',
  GET_PRODUCT_PROPERTY_ORDER_PRICE: '/api/v1/Order/GetProductPropertyOrderPrice',
  GET_PRODUCT_PROPERTY_INVENTORY: '/api/v1/Order/GetProductPropertyInventory',
  GET_WAREHOUSE_LIST: '/api/v1/Warehouse/GetWarehouse',
  UPDATE_ORDER_INFORMATION: '/api/v1/Order/UpdateOrderInfo',
  UPDATE_STATUS_FINISH_ORDER: '/api/v1/Order/FinishOrder',
  ORDER_APPROVAL_LIST: '/api/v1/Approve/GetOrderApprove',
  APPROVAL_ORDER: '/api/v1/Approve/ApproveItem'
}
export const ADDRESS_API = {
  CITY: '/api/v1/Address/getAllCity',
  DISTRICT: '/api/v1/Address/getDistrictByCityId',
  WARD: '/api/v1/Address/getWardByDistrictId',
  STREET: '/api/addr/getStreet'
}
export const ACCOUNTANT_API = {
  PAYMENT_LIST: '/api/v1/Accountant/GetPaymentRequestList',
  GET_RECEIPT_EXPENDITURES_LIST: 'api/v1/Accountant/GetListOfReceiptOrPaymentVoucher',
  GET_RECEIPT_PAYMENT_BY_ID_API: 'api/v1/Accountant/GetListOfReceiptOrPaymentVoucher',
  POST_COMMISSION_PAYMENT_API: 'api/v1/Customer/addCommissionPayment',
  PUT_COMMISSION_PAYMENT_API: 'api/v1/Customer/UpdateCommissionPayment',
  BALANCE_SHEET_LIST: '/api/v1/Accountant/GetListOfAccountingAccounts'
}

export const WAREHOUSE_API = {
  GET_LIST_PRODUCT_STORAGE: '/api/v1/Warehouse/GetWarehouse',
  CREATE_PRODUCT_STORAGE: '/api/v1/Warehouse/CreateWarehouse',
  UPDATE_PRODUCT_STORAGE: '/api/v1/Warehouse/UpdateWarehouse',
  DELETE_PRODUCT_STORAGE: '/api/v1/Warehouse/DeleteWarehouse',
  GET_WAREHOUSE_INVENTORY_API: '/api/v1/Warehouse/GetWarehouseInventory',
  GET_WAREHOUSE_TRANSACTION_API: 'api/v1/Warehouse/GetWarehouseTransaction',
  CREATE_LOT_WAREHOUSE_IMAGE: 'api/v1/Warehouse/CreateWarehouseLotImage',
  GET_WAREHOUSE_LOT: 'api/v1/Warehouse/GetWarehouseLot',
  CREATE_WAREHOUSE_LOT: 'api/v1/Warehouse/CreateWarehouseLot',
  CREATE_TICKET_MANUALLY: 'api/v1/Warehouse/CreateTicketManually',
  CANCEL_TICKET: '/api/v1/Warehouse/CancelTicket',
  UPDATE_INVENTORY: '/api/v1/Warehouse/UpdateInventory',
  UPDATE_INVENTORY_ORDER: '/api/v1/Warehouse/UpdateInventoryForOrder',
  UPDATE_TICKET_MANUALLY: 'api/v1/Warehouse/UpdateTicketManually'
}
export const STAFF_API = {
  GET_STAFF: '/api/v1/Staff/GetStaff'
}
export const POINT_API = {
  GET_CUSTOMER_POINT: '/api/v1/Point/GetCustomerPoint',
  GET_DETAIL_CUSTOMER_POINT: '/api/v1/Point/GetDetailCustomerPoint',
  GET_SETTING_POINT: '/api/v1/Point/GetSettingPoint',
  CANCEL_POINT_TRANSACTION: '/api/v1/Point/CancelPointTransaction',
  CREATE_POINT_EXCHANGE: '/api/v1/Point/CreatePointExchange',
  UPDATE_POINT_EXCHANGE: '/api/v1/Point/UpdatePointExchange',
  CANCEL_POINT_EXCHANGE: '/api/v1/Point/CancelPointExchange'
}
export const DEPARTMENT_DIRECTORY = {
  //Branch
  BRANCH_LIST: '/api/v1/Branch/GetBranch',
  ADD_BRANCH: '/api/v1/Branch/CreatBranch',
  UPDATE_BRANCH: '/api/v1/Branch/UpdateBranch',
  DELETE_BRANCH: '/api/v1/Branch/DeleteBranch',
  //Department
  DEPARTMENT_LIST: '/api/v1/Department/GetDeparment',
  POST_NEW_DEPARTMENT: '/api/v1/Department/creatDepartment',
  UPDATE_DEPARTMENT: '/api/v1/Department/updateDepartment',
  DELETE_DEPARTMENT: '/api/v1/Department/DeleteDepartment',
  DEPARTMENT_BY_ID: '/api/v1/Department/GetId',
  //POSITION
  GET_LIST_POSITION: '/api/v1/Position/GetPosition',
  ADD_POSITION: '/api/v1/Position/GetPosition',
  UPDATE_POSITION: '/api/v1/Position/UpdatePosition',
  DELETE_POSITION: '/api/v1/Position/DeletePosition',
  //TY OF STAFF
  GET_LIST_TYPEOFSTAFF: '/api/v1/TypeOfStaff/GetTypeStaff',
  ADD_STAFF: '/api/v1/TypeOfStaff/CreateAccount',
  UPDATE_STAFF: '/api/v1/TypeOfStaff/Update',
  DELETE_STAFF: '/api/v1/TypeOfStaff/Delete',
  //nhan su
  ADD_NEW_STAFF: '/api/v1/AccountStaff/CreateAccountOne',
  GET_STAFF_INFO_BY_ACCOUNT: 'api/v1/AccountStaff/GetStaffByAccountId'
}

export const APPROVAL_API = {
  GET_LIST_APPROVAL: '/api/v1/Approve/GetApproveSetting',
  GET_LIST_PRODUCT_APPROVAL: '/api/v1/Approve/GetProductApprove'
}
