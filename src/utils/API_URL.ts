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
  GET_PRODUCT_PROPERTY: '/api/v1/Product/GetProductProperty',
  GET_COLLABORATOR: '/api/v1/Order/GetCollaborator',
  ADD_PRODUCT_PROPERTY: '/api/v1/Product/CreateProductProperty',
  UPDATE_PRODUCT_PROPERTY: '/api/v1/Product/UpdateProductProperty',
  DELETE_PRODUCT_PROPERTY: '/api/v1/Product/DeleteProductProperty',
  GET_PRICE_PRODUCT_PROPERTY: '/api/v1/Product/GetPrice',
  CHANGE_PRICE_PRODUCT_PROPERTY: '/api/v1/Product/ChangePrice'
}
export const CUSTOMER_API = {
  GET_POTENTIAL_CUSTOMERS: '/api/v1/Customer/GetPotentialCustomers',
  ADD_POTENTIAL_CUSTOMER: '/api/v1/Customer/addPotentialCustomers'
}
