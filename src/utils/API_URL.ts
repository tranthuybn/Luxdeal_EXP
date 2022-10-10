import { ERP_DOMAIN, ERP_DOMAIN_LOGIN } from '../../public/config'
export const API_URL = ERP_DOMAIN
export const LOGIN_API_URL = ERP_DOMAIN_LOGIN
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
  GET_PRODUCT_PROPERTY: '/api/v1/Product/GetProductProperty',
  GET_COLLABORATOR: '/api/v1/Order/GetCollaborator',
  ADD_PRODUCT_PROPERTY: '/api/v1/Product/CreateProductProperty',
  UPDATE_PRODUCT_PROPERTY: '/api/v1/Product/UpdateProductProperty',
  DELETE_PRODUCT_PROPERTY: '/api/v1/Product/DeleteProductProperty',
  GET_PRICE_PRODUCT_PROPERTY: '/api/v1/Product/GetPrice',
  CHANGE_PRICE_PRODUCT_PROPERTY: '/api/v1/Product/ChangePrice',
  GET_TAGS: '/api/v1/Product/GetTag',
  GET_COLLABORATORS: 'api/v1/Order/GetCollaborator',
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
  GET_CUSTOMER_BY_ID: '/api/v1/Customer/GetCustomerById',
  ADD_CUSTOMER: '/api/v1/Customer/addCustomer'
}
export const ORDER_API = {
  GET_ORDER_LIST: '/api/v1/Order/GetOrder',
  ADD_NEW_ORDER: '/api/v1/Order/CreateOrder'
}
export const ADDRESS_API = {
  CITY: '/api/addr/getAllCity',
  DISTRICT: '/api/addr/getDistrict',
  WARD: '/api/addr/getWard',
  STREET: '/api/addr/getStreet'
}
