import { ERP_DOMAIN } from '../../public/config'
export const API_URL = ERP_DOMAIN
export const PRODUCTS_AND_SERVICES_API = {
  GET_CATEGORY: '/api/v1/Category/GetCategory',
  ADD_CATEGORY: '/api/v1/Category/AddCategory',
  GET_CATEGORY_BY_ID: '/api/v1/Category/GetCategoryById',
  UPDATE_CATEGORY: '/api/v1/Category/updateCategory',
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
  GET_COLLABORATORS: 'api/v1/Order/GetCollaborator',
  GET_PROMOTIONS: 'api/v1/Campaign/GetCampaignForOrder'
}
export const CUSTOMER_API = {
  GET_POTENTIAL_CUSTOMERS: '/api/v1/Customer/GetPotentialCustomers',
  GET_POTENTIAL_CUSTOMER_BY_ID: 'api/v1/Customer/getPotentialCustomerById',
  ADD_POTENTIAL_CUSTOMER: '/api/v1/Customer/addPotentialCustomers',
  ALL_CUSTOMER: '/api/v1/Customer/GetCustomers',
  DELETE_POTENTIAL_CUSTOMER: '/api/v1/Customer/deletePotentialCustomers',
  DELETE_POTENTIAL_CUSTOMER_HISTORY: 'api/v1/Customer/deletePotentialCustomerHistory',
  DELETE_POTENTIAL_CUSTOMER_HISTORY_CHILD: 'api/v1/Customer/deletePotentialCustomerHistoryOfSale'
}
